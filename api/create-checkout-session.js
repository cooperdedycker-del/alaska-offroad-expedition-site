import Stripe from "stripe";
import { partnerExperienceTotalCents, quotedBookingAmounts } from "../src/data/bookingPricing.mjs";
import { google } from "googleapis";
import { excursions, experiences, SEASONAL_RATES, BOOKING_RATES, getOperatingSeason } from "../src/data/experiences.js";

const ALASKA_TIME_ZONE = "America/Anchorage";

const PACKAGE_CONFIG = {
  "winter-knik-glacier": {
    name: "Winter Knik Glacier Experience",
    driverPrice: 695,
    passengerPrice: 395,
    maxDrivers: 2,
    maxPassengers: 11,
    availableMonths: [11, 12, 1, 2],
    lodgingPrice: 300,
  },
};

function splitMetadataValue(value, chunkSize = 450) {
  const text = String(value || "");
  const chunks = [];

  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }

  return chunks;
}

function getAlaskaDateString(dateValue) {
  const date = new Date(dateValue);

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: ALASKA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

async function isCalendarDateAvailable(dateString) {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;

  const privateKey =
    process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (!clientEmail || !privateKey || !calendarId) {
    throw new Error(
      "Missing Google Calendar environment variables."
    );
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: [
      "https://www.googleapis.com/auth/calendar.readonly",
    ],
  });

  await auth.authorize();

  const calendar = google.calendar({
    version: "v3",
    auth,
  });

  /*
   * Search a wide UTC window around the selected
   * Alaska date. This avoids timezone/DST issues.
   */
  const queryStart = new Date(`${dateString}T00:00:00Z`);
  queryStart.setUTCDate(queryStart.getUTCDate() - 1);

  const queryEnd = new Date(`${dateString}T00:00:00Z`);
  queryEnd.setUTCDate(queryEnd.getUTCDate() + 2);

  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin: queryStart.toISOString(),
      timeMax: queryEnd.toISOString(),
      timeZone: ALASKA_TIME_ZONE,
      items: [
        {
          id: calendarId,
        },
      ],
    },
  });

  const busy =
    response.data.calendars?.[calendarId]?.busy || [];

  const conflicts = busy.some((range) => {
    if (!range.start || !range.end) {
      return false;
    }

    const busyStartDate =
      getAlaskaDateString(range.start);

    /*
     * Google end times are exclusive.
     * Subtract 1ms so midnight on the next
     * day doesn't incorrectly block it.
     */
    const busyEndMilliseconds =
      new Date(range.end).getTime() - 1;

    const busyEndDate =
      getAlaskaDateString(
        new Date(busyEndMilliseconds)
      );

    return (
      dateString >= busyStartDate &&
      dateString <= busyEndDate
    );
  });

  return !conflicts;
}

/* =====================================================
   UNIFIED TRIP BUILDER CHECKOUT
   25% Deposit / 14-Day Balance Policy
===================================================== */

// V2 five-step Trip Builder checkout. All prices are recalculated server-side.
// Legacy form/package checkout below is preserved unchanged.
function strictDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}
function utcDayDiff(start, end) {
  return Math.round((Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86400000);
}
function datePlusDays(value, days) {
  const parsed = new Date(`${value}T00:00:00Z`);
  parsed.setUTCDate(parsed.getUTCDate() + days);
  return parsed.toISOString().slice(0, 10);
}
async function isFullVacationAvailable(start, lastDayInclusive) {
  const current = new Date(`${start}T00:00:00Z`);
  const end = new Date(`${lastDayInclusive}T00:00:00Z`);
  for (; current <= end; current.setUTCDate(current.getUTCDate() + 1)) {
    if (!(await isCalendarDateAvailable(current.toISOString().slice(0, 10)))) return false;
  }
  return true;
}

async function createUnifiedCheckout(req, res) {
  const booking = req.body?.booking;
  if (!booking || typeof booking !== "object") return res.status(400).json({ error: "Missing reservation details." });
  const { arrivalDate, departureDate, guestCount, expeditionStyle = "selfDrive",
    driverCount = 1, selectedExperiences = [], experienceParticipants = {},
    customerRigs = 1, guestInfo = {} } = booking;
  if (!strictDate(arrivalDate) || !strictDate(departureDate) || departureDate < arrivalDate)
    return res.status(400).json({error:"Choose valid arrival and departure dates."});
  const todayAK = getAlaskaDateString(new Date());
  if (arrivalDate < todayAK) return res.status(400).json({error:"Arrival date cannot be in the past."});
  const nights = utcDayDiff(arrivalDate, departureDate);
  if (nights > 365) return res.status(400).json({error:"Vacation exceeds the supported duration."});
  const guests = Number(guestCount);
  if (!Number.isInteger(guests) || guests < 1 || guests > 30) return res.status(400).json({error:"Invalid guest count."});
  if (typeof guestInfo.name !== "string" || !guestInfo.name.trim() ||
      typeof guestInfo.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email.trim()))
    return res.status(400).json({error:"Enter your name and a valid email."});
  if (!Array.isArray(selectedExperiences) || selectedExperiences.length > 30 ||
      selectedExperiences.some(id => typeof id !== "string") || new Set(selectedExperiences).size !== selectedExperiences.length)
    return res.status(400).json({error:"Invalid experiences selection."});
  const season = getOperatingSeason(arrivalDate);
  const dayTrip = season === "winter" && nights === 0;
  if (season === "summer" && nights < 1) return res.status(400).json({error:"Summer expeditions require arrival and departure travel days."});
  if (dayTrip && selectedExperiences.length !== 1) return res.status(400).json({error:"Choose exactly one winter day-trip experience."});
  if (!season) return res.status(400).json({error:"Operating season is unavailable."});
  // Allow one experience per winter expedition day.
// Standalone day trips may select one experience.
const maximumExperiences =
  season === "winter"
    ? Math.max(1, nights)
    : Math.max(1, nights - 1);

if (selectedExperiences.length > maximumExperiences) {
  return res.status(400).json({
    error: "Too many selected excursions for your vacation.",
  });
}
  const rates = SEASONAL_RATES[season];
 // Summer excludes arrival and departure travel days.
// Winter bills the number of days between arrival and departure.
// Same-day winter bookings have no expedition-day charge.
// Each overnight is one billable expedition day in both seasons.
const dailyExpeditionDays = nights;
  let base = 0;
  const lineItems = [];
  if (season === "summer") {
    const arrivalDeparture = 0;
    let daily = 0;
    if (expeditionStyle === "selfDrive") daily = rates.expeditionDay + Math.max(0, guests - 1) * rates.additionalGuestDay;
    else if (expeditionStyle === "tagAlong") {
      const rigs = Number(customerRigs);
      if (!Number.isInteger(rigs) || rigs < 1 || rigs > 6 || rigs > guests) return res.status(400).json({error:"Invalid customer rig count."});
      daily = rigs * rates.tagAlongRigDay;
    } else if (expeditionStyle === "rideAlong") daily = guests * 350;
    else return res.status(400).json({error:"Unknown expedition style."});
    base = daily * dailyExpeditionDays + arrivalDeparture;
    lineItems.push({name:"Summer AOE expedition", amount:base});
  } else if (!dayTrip) {
    const additionalGuests = Math.max(0, guests - 1);
    const dailyRate = rates.expeditionDay + additionalGuests * rates.additionalGuestDay;
    base = dailyExpeditionDays * dailyRate;
    lineItems.push({name:`Winter AOE vacation (${dailyExpeditionDays} days, ${guests} guest(s))`,amount:base});
  }
  let excursionTotal = 0;
  let transferTotal = 0;
  const details = [];
  for (const id of selectedExperiences) {
    if (id === "custom-offroad-expedition") continue;
    const ex = experiences.find(x => x.id === id && (x.operator === "AOE" ? x.active === true : Number(x.publishedBasePrice) > 0));
    if (!ex) return res.status(400).json({error:`Unknown experience: ${id}`});
    // Check every selected date, including arrival and departure.
// Supports standalone day trips and multi-day bookings.
if (
  Array.isArray(ex.availableMonths) &&
  !ex.availableMonths.some((month) => {
    for (let day = 0; day <= nights; day++) {
      const check = datePlusDays(arrivalDate, day);

      if (Number(check.slice(5, 7)) === Number(month)) {
        return true;
      }
    }

    return false;
  })
) {
  return res.status(400).json({
    error: `${ex.name} is not listed for the selected dates.`,
  });
}
     // Require a matching day in the published operating window.
     const days = Array.from({length:nights+1}, (_,i)=>datePlusDays(arrivalDate,i));
     const matchingDay = days.some(d=>{
       const m=Number(d.slice(5,7));
       if (Array.isArray(ex.availableMonths) && ex.availableMonths.length && !ex.availableMonths.map(Number).includes(m)) return false;
       if ((!ex.availableMonths || !ex.availableMonths.length) && ex.season === "summer" && ![6,7,8,9].includes(m)) return false;
       if ((!ex.availableMonths || !ex.availableMonths.length) && ex.season === "winter" && ![10,11,12,1,2,3,4,5].includes(m)) return false;
       if (ex.seasonStart && ex.seasonEnd && /^\d{2}-\d{2}$/.test(ex.seasonStart) && /^\d{2}-\d{2}$/.test(ex.seasonEnd)) {
         const md=d.slice(5), from=ex.seasonStart, to=ex.seasonEnd;
         if (!(from <= to ? md>=from && md<=to : md>=from || md<=to)) return false;
       }
       return true;
     });
     if (!matchingDay) return res.status(400).json({error:`${ex.name} is outside its advertised season.`});
    if (season === "summer" && ex.operator === "AOE") return res.status(400).json({error:"AOE summer expedition is already included."});
    let price = 0; let participants = guests;
    if (id === "winter-knik-glacier") {
      if (season !== "winter") return res.status(400).json({error:"Knik winter tours require winter dates."});
      const drivers = Number(driverCount);
      if (!Number.isInteger(drivers) || drivers < 0 || drivers > 2 || drivers > guests || guests - drivers > 11)
        return res.status(400).json({error:"Invalid Knik driver/passenger selection."});
      price = dayTrip ? drivers * rates.knikDriver + (guests - drivers) * rates.knikPassenger : 0; // Multi-day winter Knik is included.
    } else if (ex.operator !== "AOE") {
       // Published provider rates are server-owned. Draft card visibility does
       // not authorize arbitrary checkout amounts supplied by the browser.
       const unit = ex.publishedPriceUnit;
       if (!["perPerson", "perVehicle", "perCharter", "perNight"].includes(unit) || !(Number(ex.publishedBasePrice) > 0))
         return res.status(400).json({error:`Price confirmation required for ${ex.name}.`});
       participants = unit === "perPerson" ? Number(experienceParticipants[id] ?? guests) : 1;
       if (!Number.isInteger(participants) || participants < 1 || (unit === "perPerson" && participants > guests))
         return res.status(400).json({error:`Invalid quantity for ${ex.name}.`});
       price = partnerExperienceTotalCents({providerUnitPriceDollars:Number(ex.publishedBasePrice),quantity:participants}) / 100;
     } else {
       return res.status(400).json({error:`Experience cannot be priced: ${ex.name}.`});
     }
        excursionTotal += price;

    // Charge round-trip transportation only for standalone
    // winter partner excursions. Multi-day AOE trips include transport.
    // AOE-operated Knik Glacier trips never receive this fee.
    const transfer =
      dayTrip && ex.operator !== "AOE"
        ? rates.partnerTransferPerExcursion
        : 0;

    transferTotal += transfer;

    details.push({ id, name: ex.name, price, participants, transfer });

    lineItems.push({
      name:
        price === 0 && id === "winter-knik-glacier"
          ? `${ex.name} (included)`
          : ex.name,
      amount: price,
    });
  }

  if (transferTotal > 0) {
    lineItems.push({
      name: "Round-Trip Partner Experience Transportation",
      amount: transferTotal,
    });
  }
  const daysUntilArrival = utcDayDiff(todayAK, arrivalDate);
   const fullPaymentRequired = daysUntilArrival <= BOOKING_RATES.fullPaymentWithinDays;
   let quote;
   try {
     quote = quotedBookingAmounts({
       aoeExpeditionCents: Math.round(base * 100), expeditionDays: dailyExpeditionDays,
       partnerExperienceCents: Math.round(excursionTotal * 100),
       otherCents: Math.round(transferTotal * 100), fullPaymentRequired,
     });
   } catch (error) { return res.status(400).json({error:"Choose a priced expedition or excursion."}); }
   const { totalCents, discountCents, dueNowCents: amountDueCents, balanceDueCents: remainingCents } = quote;
   if (discountCents) lineItems.push({name:"Extended-stay AOE discount",amount:-discountCents/100});
  // Customer arrival and departure are both reserved; departure remains blocked until the customer leaves.
  const lastBlockedDay = departureDate;
  if (!(await isFullVacationAvailable(arrivalDate,lastBlockedDay))) return res.status(409).json({error:"One or more vacation dates are unavailable."});
  // Require complete contact details for each guest in the unified booking path.
  const emailOk = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
  const extraGuests = Array.isArray(guestInfo.additionalGuests) ? guestInfo.additionalGuests.slice(0, guests - 1) : [];
  if (!guestInfo.phone?.trim() || !guestInfo.address?.trim() || !guestInfo.shirtSize ||
      extraGuests.length !== guests - 1 ||
      extraGuests.some(g => !g || !g.name?.trim() || !emailOk(g.email) || !g.phone?.trim() || !g.shirtSize)) {
    return res.status(400).json({error:"Complete contact information for each guest before checkout."});
  }
  const allParticipants = [
    {name:guestInfo.name, email:guestInfo.email, phone:guestInfo.phone, shirtSize:guestInfo.shirtSize, address:guestInfo.address},
    ...extraGuests.map(g=>({name:g.name,email:g.email,phone:g.phone,shirtSize:g.shirtSize})),
  ];
  // Stripe metadata values are limited; chunk participant JSON and validate the count.
  const participantChunks = splitMetadataValue(JSON.stringify(allParticipants));
  if (participantChunks.length > 20) return res.status(400).json({error:"Guest contact details are too long."});
  const participantMetadata = Object.fromEntries(participantChunks.map((v,i)=>[i===0?"participants":`participants${i+1}`,v]));
  const selectedNames = details.map(item => item.name).join(", ");
  const metadata = {
    ...participantMetadata, primaryGuestAddress:String(guestInfo.address).slice(0,450),
    bookingType:"unified", pricingVersion:"partner-markup-v4-extended-stay", paymentType:fullPaymentRequired ? "full":"deposit",
    packageName:dayTrip ? (details[0]?.name || "Winter day trip") : `${season === "summer" ? "Summer" : "Winter"} AOE vacation`,
    packageId:dayTrip ? (details[0]?.id || "") : `aoe-${season}-vacation`,
    customerName:guestInfo.name.trim().slice(0,300),customerEmail:guestInfo.email.trim().slice(0,300),
    customerPhone:String(guestInfo.phone || "").slice(0,300),
    tripStart:arrivalDate,tripEnd:lastBlockedDay,arrivalDate,departureDate,
    rig:"Alaska Offroad Expedition Fleet",experienceType:expeditionStyle,
    drivers:String(selectedExperiences.includes("winter-knik-glacier") ? Number(driverCount) : (season === "summer" && expeditionStyle === "selfDrive" ? 1 : 0)),
    passengers:String(selectedExperiences.includes("winter-knik-glacier") ? guests - Number(driverCount) : Math.max(0,guests - 1)),
    totalGuests:String(guests), lodgingPreference:dayTrip ? "Not included for standalone day trip" : "AOE lodging included",
    lodgingNotes:dayTrip ? "No overnight stay" : "Included with AOE vacation rate",
    lodgingNights:"0",lodgingTotal:"0.00",selectedExcursions:selectedNames.slice(0,450),
    totalEstimate:(totalCents/100).toFixed(2),depositPaid:(amountDueCents/100).toFixed(2),paymentAmount:(amountDueCents/100).toFixed(2),
    balanceDue:(remainingCents/100).toFixed(2),balanceDueDate:datePlusDays(arrivalDate,-14),
    adventureTotal:(base/1).toFixed(2),extendedStayDiscount:(discountCents/100).toFixed(2),addOnTotal:(excursionTotal/1).toFixed(2),partnerTransportTotal:transferTotal.toFixed(2),
    guestNotes:String(guestInfo.notes || "").slice(0,450),
    selectedExperienceIds:selectedExperiences.join(",").slice(0,450),
    // Both Stripe and Google require small metadata values; keep a readable itemized email summary.
    excursionBreakdown:details.map(x=>`${x.name}: $${x.price} (${x.participants} guests)`).join("; ").slice(0,450),
  };
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const siteUrl = process.env.SITE_URL || "http://localhost:5173";
  const session = await stripe.checkout.sessions.create({
    mode:"payment", allow_promotion_codes:true, customer_email:guestInfo.email.trim(),
    client_reference_id:`aoe-${arrivalDate}-${departureDate}`,
    line_items:[{quantity:1,price_data:{currency:"usd",unit_amount:amountDueCents,
      product_data:{name:fullPaymentRequired ? `${metadata.packageName} — Full Payment` : `${metadata.packageName} — 25% Deposit`,
        description:`Trip total $${(totalCents/100).toFixed(2)}; remaining $${(remainingCents/100).toFixed(2)}`}}}],
    metadata,
    success_url:`${siteUrl}/reservation-confirmed?booking=unified&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:`${siteUrl}/plan-your-trip?checkout=cancelled`,
  });
  return res.status(200).json({url:session.url,pricing:{total:totalCents/100,amountDue:amountDueCents/100,
    balanceDue:remainingCents/100,fullPaymentRequired,lineItems}});
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  // Unified five-step Trip Builder checkout
  if (req.body?.bookingType === "unified") {
    try {
      return await createUnifiedCheckout(req, res);
    } catch (error) {
      console.error("Unified checkout error:", error);

      return res.status(500).json({
        error:
          error.message ||
          "Unable to create checkout session.",
      });
    }
  }
  
  try {
    const stripe = new Stripe(
      process.env.STRIPE_SECRET_KEY
    );

    const { form, pricing } = req.body;

    if (!form?.contact?.name || !form?.contact?.email) {
      return res.status(400).json({
        error: "Missing customer contact info",
      });
    }

    if (!form?.start || !form?.end) {
      return res.status(400).json({
        error: "Missing trip dates",
      });
    }

    const isPackageBooking =
      form.bookingType === "package";

    let amountDue = 0;
    let totalEstimate = 0;
    let balanceDue = 0;

    let productName =
      "Alaska Offroad Expedition Deposit";

    let packageName = "";
    let packageId = "";
    let packageSlug = "";

    let drivers = Number(form.drivers ?? 0);
    let passengers = Number(form.passengers ?? 0);
    let totalGuests = 0;

    /*
     * PACKAGE BOOKING
     */
    if (isPackageBooking) {
      packageId = form.packageId;
      packageSlug =
        form.packageSlug || form.packageId;

      const packageConfig =
        PACKAGE_CONFIG[packageId];

      if (!packageConfig) {
        return res.status(400).json({
          error: "Invalid expedition package",
        });
      }

      /*
       * Validate date
       */
      const tripDateParts = String(form.start)
        .split("-")
        .map(Number);

      const tripYear = tripDateParts[0];
      const tripMonth = tripDateParts[1];
      const tripDay = tripDateParts[2];

      if (
        !tripYear ||
        !tripMonth ||
        !tripDay
      ) {
        return res.status(400).json({
          error: "Invalid expedition date.",
        });
      }

      /*
       * Winter Knik season
       */
      if (
        packageConfig.availableMonths &&
        !packageConfig.availableMonths.includes(
          tripMonth
        )
      ) {
        return res.status(400).json({
          error:
            "Winter Knik Glacier Experience is only available November through February.",
        });
      }

      /*
       * Check Google Calendar again immediately
       * before creating the Stripe session.
       */
      const dateAvailable =
        await isCalendarDateAvailable(form.start);

      if (!dateAvailable) {
        return res.status(409).json({
          error:
            "That expedition date is no longer available. Please select another date.",
        });
      }

      packageName =
        packageConfig.name;

      /*
       * Driver validation
       */
      if (
        !Number.isInteger(drivers) ||
        drivers < 0 ||
        drivers > packageConfig.maxDrivers
      ) {
        return res.status(400).json({
          error: `Driver seats must be between 0 and ${packageConfig.maxDrivers}.`,
        });
      }

      /*
       * Passenger validation
       */
      if (
        !Number.isInteger(passengers) ||
        passengers < 0 ||
        passengers >
          packageConfig.maxPassengers
      ) {
        return res.status(400).json({
          error: `Passenger seats must be between 0 and ${packageConfig.maxPassengers}.`,
        });
      }

      totalGuests =
        drivers + passengers;

      if (totalGuests < 1) {
        return res.status(400).json({
          error:
            "At least one driver or passenger must be selected.",
        });
      }

 /*
 * Calculate package price SERVER SIDE.
 */
const driverTotal =
  drivers * packageConfig.driverPrice;

const passengerTotal =
  passengers * packageConfig.passengerPrice;

const lodgingBefore =
  form.lodgingBefore === true;

const lodgingAfter =
  form.lodgingAfter === true;

const lodgingNights =
  Number(lodgingBefore) +
  Number(lodgingAfter);

const lodgingTotal =
  lodgingNights * 300;

totalEstimate =
  driverTotal +
  passengerTotal +
  lodgingTotal;

// Stripe charges the full package amount
amountDue = totalEstimate;

// Package is paid in full
balanceDue = 0;

// Use the package name in Stripe
productName = packageConfig.name;

} // <-- closes if (isPackageBooking)

/*
 * NORMAL TRIP BUILDER
 *
 * Leave existing deposit system alone.
 */
if (!isPackageBooking) {
  if (
    !pricing?.depositDue ||
    Number(pricing.depositDue) <= 0
  ) {
    return res.status(400).json({
      error: "Invalid deposit amount",
    });
  }

  amountDue =
    Number(pricing.depositDue);

  totalEstimate =
    Number(pricing.total || 0);

  balanceDue =
    Number(pricing.balanceDue || 0);

  totalGuests =
    Number(pricing.totalGuests ?? 1);

  drivers =
    Number(form.drivers ?? 0);

  passengers =
    Number(form.passengers ?? 0);
}

/*
 * PARTICIPANTS
 */
    const participantJson =
      JSON.stringify(
        form.participants || []
      );

    const participantChunks =
      splitMetadataValue(participantJson);

    const participantMetadata = {};

    participantChunks.forEach(
      (chunk, index) => {
        const key =
          index === 0
            ? "participants"
            : `participants${index + 1}`;

        participantMetadata[key] =
          chunk;
      }
    );

    const siteUrl =
      process.env.SITE_URL ||
      "http://localhost:5173";

    const description =
      isPackageBooking
        ? [
            form.start,
            `${drivers} driver${
              drivers === 1 ? "" : "s"
            }`,
            `${passengers} passenger${
              passengers === 1 ? "" : "s"
            }`,
            `${totalGuests} total guests`,
            `Paid in full: $${totalEstimate.toLocaleString()}`,
          ]
            .join(" | ")
            .slice(0, 300)
        : [
            `${form.start} → ${form.end}`,
            `${totalGuests} guests`,
            `${drivers} drivers / ${passengers} passengers`,
            "Rig: Jeep Gladiator",
            `Total: $${totalEstimate.toLocaleString()}`,
            `Balance: $${balanceDue.toLocaleString()}`,
          ]
            .join(" | ")
            .slice(0, 300);

    const metadata = {
      bookingType:
        isPackageBooking
          ? "package"
          : "trip-builder",

      paymentType:
        isPackageBooking
          ? "full"
          : "deposit",

      packageId,
      packageSlug,
      packageName,

      customerName:
        form.contact.name,

      customerEmail:
        form.contact.email,

      customerPhone:
        form.contact.phone || "",

      tripStart:
        form.start,

      tripEnd:
        form.end,

      rig:
        isPackageBooking
          ? "Alaska Offroad Expedition Fleet"
          : form.rig ||
            "Jeep Gladiator Expedition Rig",

      experienceType:
        form.experienceType || "",

      drivers:
        String(drivers),

      passengers:
        String(passengers),

      totalGuests:
        String(totalGuests),

      ...participantMetadata,

      lodgingPreference:
        form.lodgingPreference || "",

      lodgingNotes:
        form.lodgingNotes || "",

        lodgingBefore:
  String(form.lodgingBefore === true),

lodgingAfter:
  String(form.lodgingAfter === true),

lodgingNights:
  String(
    Number(form.lodgingBefore === true) +
    Number(form.lodgingAfter === true)
  ),

lodgingTotal:
  String(
    (
      Number(form.lodgingBefore === true) +
      Number(form.lodgingAfter === true)
    ) * 300
  ),

      selectedExcursions:
        pricing?.selectedExcursions
          ?.map((x) => x.name)
          .join(", ")
          .slice(0, 450) || "",

      totalEstimate:
        String(totalEstimate),

      depositPaid:
        String(amountDue),

      paymentAmount:
        String(amountDue),

      balanceDue:
        String(balanceDue),

      cancellationPolicy:
        isPackageBooking
          ? "Full refund if canceled before the day of the expedition. Same-day cancellation receives a 50% refund."
          : "",
    };

    const cancelUrl =
      isPackageBooking
        ? `${siteUrl}/book-package?package=${encodeURIComponent(
            packageSlug
          )}&checkout=cancelled`
        : `${siteUrl}/?checkout=cancelled#trip-builder`;

    const session =
  await stripe.checkout.sessions.create({
    mode: "payment",

    customer_email:
      form.contact.email,

    allow_promotion_codes: true,

    line_items: [
          {
            quantity: 1,

            price_data: {
              currency: "usd",

              unit_amount:
                Math.round(
                  amountDue * 100
                ),

              product_data: {
                name: productName,
                description,
              },
            },
          },
        ],

        metadata,

       success_url: isPackageBooking
  ? `${siteUrl}/reservation-confirmed?booking=package&package=${encodeURIComponent(
      packageSlug
    )}&session_id={CHECKOUT_SESSION_ID}`
  : `${siteUrl}/reservation-confirmed?booking=trip-builder&session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          cancelUrl,
      });

    return res.status(200).json({
      url: session.url,
    });
  } catch (error) {
    console.error(
      "Create checkout session error:",
      error
    );

    return res.status(500).json({
      error:
        error.message ||
        "Failed to create checkout session",
    });
  }
}