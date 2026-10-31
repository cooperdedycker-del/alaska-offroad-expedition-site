import { useState, useEffect } from "react";
import { partnerExperienceTotalCents, extendedStayDiscountRate } from "../data/bookingPricing.mjs";
import { expeditionPackages } from "../data/packages.js";
import { useSearchParams } from "react-router-dom";
import { getVacationPackageById } from "../data/packages";
import {
  experiences,
  BOOKING_RATES,
  SEASONAL_RATES,
  getOperatingSeason,
  getPartnerDisplayPrice,
} from "../data/experiences";

/* =====================================================
   DATE HELPERS
===================================================== */

function parseDate(value) {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) return null;

  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

function addDays(date, days) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function formatDate(value) {
  const date = parseDate(value);

  if (!date) return "";

  return date.toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}


// Google Calendar availability calendar; blocked dates cannot be selected.
function AvailabilityDatePicker({label, value, minDate, blockedDates, loading, error, onSelect, today}) {
  const initialMonth = (value || minDate || today).slice(0, 7);
  const [month, setMonth] = useState(initialMonth);
  const [year, monthNumber] = month.split('-').map(Number);
  const first = new Date(Date.UTC(year, monthNumber - 1, 1));
  const days = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  const offset = first.getUTCDay();
  const limit = new Date(`${today}T00:00:00Z`);
  limit.setUTCMonth(limit.getUTCMonth() + 12);
  const maxDate = limit.toISOString().slice(0,10);
  const changeMonth = (delta) => {
    const next = new Date(Date.UTC(year, monthNumber - 1 + delta, 1));
    setMonth(next.toISOString().slice(0,7));
  };
  const title = first.toLocaleDateString('en-US', {timeZone:'UTC', month:'long', year:'numeric'});
  return (
    <div className="min-w-0">
      <div className="mb-3 font-semibold">{label}</div>
      <div className="rounded-xl border border-white/20 bg-neutral-800 p-3 sm:p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <button type="button" aria-label={`Previous month for ${label}`} onClick={() => changeMonth(-1)} disabled={`${month}-01` < `${today.slice(0,7)}-01`} className="rounded-lg border border-white/20 px-3 py-2 font-bold disabled:opacity-30">‹</button>
          <strong className="text-sm sm:text-base">{title}</strong>
          <button type="button" aria-label={`Next month for ${label}`} onClick={() => changeMonth(1)} disabled={month >= maxDate.slice(0,7)} className="rounded-lg border border-white/20 px-3 py-2 font-bold disabled:opacity-30">›</button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-neutral-400">{['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <span key={d}>{d}</span>)}</div>
        <div className="mt-2 grid grid-cols-7 gap-1">
          {Array.from({length:offset},(_,i)=><span key={`blank-${i}`} />)}
          {Array.from({length:days},(_,i)=>{
            const date = `${month}-${String(i+1).padStart(2,'0')}`;
            const booked = blockedDates.has(date);
            const disabled = loading || Boolean(error) || date < (minDate || today) || date > maxDate || booked;
            return <button key={date} type="button" aria-label={`${date}${booked?' unavailable':''}`} title={booked?'Unavailable on Google Calendar':date} disabled={disabled} onClick={()=>onSelect(date)} className={`aspect-square rounded-md text-xs sm:text-sm transition ${value === date ? 'bg-orange-500 font-extrabold text-white' : booked ? 'bg-red-950/60 text-red-300 line-through' : disabled ? 'text-neutral-600' : 'bg-neutral-700 text-white hover:bg-orange-500/50'}`}>{i+1}</button>;
          })}
        </div>
        <div className="mt-3 text-xs text-neutral-400">{value ? `Selected: ${formatDate(value)}` : 'Select an available date'} · <span className="text-red-300">Crossed-out dates are booked.</span></div>
        {loading && <p className="mt-2 text-xs text-amber-300">Checking Google Calendar availability…</p>}
        {error && <p role="alert" className="mt-2 text-xs text-red-300">{error}</p>}
      </div>
    </div>
  );
}

function rangeIncludesBlockedDay(start, end, blockedDates) {
  if (!start || !end) return false;
  const cursor = parseDate(start);
  const last = parseDate(end);
  if (!cursor || !last) return true;
  while (cursor <= last) {
    if (blockedDates.has(cursor.toISOString().slice(0,10))) return true;
    cursor.setUTCDate(cursor.getUTCDate()+1);
  }
  return false;
}

function getTodayLocal() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* =====================================================
   PACKAGE SEASON FILTER
===================================================== */

function packageAvailableForDates(pkg, arrival, departure) {
  const start = parseDate(arrival);
  const end = parseDate(departure);

  if (!start || !end || end <= start) return false;

  const months = Array.isArray(pkg.availableMonths)
    ? pkg.availableMonths.map(Number)
    : [];

  const hasMonthRules = months.length > 0;

  const hasDateRules =
    typeof pkg.seasonStart === "string" &&
    typeof pkg.seasonEnd === "string";

  // No seasonal restriction defined.
  if (!hasMonthRules && !hasDateRules) {
    return true;
  }

  // Check the selected vacation dates.
  // Departure is treated as a checkout/travel day.
  // Cap the search to one year.
  for (
    let day = new Date(start), checked = 0;
    day < end && checked < 366;
    day = addDays(day, 1), checked++
  ) {
    const month = day.getUTCMonth() + 1;

    if (hasMonthRules && !months.includes(month)) {
      continue;
    }

    if (hasDateRules) {
      const monthDay =
        `${String(month).padStart(2, "0")}-` +
        `${String(day.getUTCDate()).padStart(2, "0")}`;

      const seasonStart = pkg.seasonStart;
      const seasonEnd = pkg.seasonEnd;

      let withinSeason;

      if (seasonStart <= seasonEnd) {
        withinSeason =
          monthDay >= seasonStart &&
          monthDay <= seasonEnd;
      } else {
        // Handles winter seasons crossing New Year's Day.
        withinSeason =
          monthDay >= seasonStart ||
          monthDay <= seasonEnd;
      }

      if (!withinSeason) {
        continue;
      }
    }

    return true;
  }

  return false;
}

// Partner availability: public operating-window estimate, not confirmed inventory.
function experienceAvailableDuringTrip(ex, start, finish) {
  if (!start || !finish || finish < start) return false;
  const begin = parseDate(start), end = parseDate(finish);
  if (!begin || !end) return false;
  const months = Array.isArray(ex.availableMonths) ? ex.availableMonths.map(Number) : [];
  for (let d = new Date(begin); d <= end; d = addDays(d, 1)) {
    const mm = d.getUTCMonth() + 1;
    if (months.length ? !months.includes(mm) : ex.season === "summer" ? ![6,7,8,9].includes(mm) : ex.season === "winter" ? ![10,11,12,1,2,3,4,5].includes(mm) : false) continue;
    const md = `${String(mm).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
    if (ex.seasonStart && ex.seasonEnd && /^\d{2}-\d{2}$/.test(ex.seasonStart) && /^\d{2}-\d{2}$/.test(ex.seasonEnd)) {
      const inWindow = ex.seasonStart <= ex.seasonEnd
        ? md >= ex.seasonStart && md <= ex.seasonEnd
        : md >= ex.seasonStart || md <= ex.seasonEnd;
      if (!inWindow) continue;
    }
    return true;
  }
  return false;
}

function partnerQuote(ex, guests, participants) {
  const base = Number(ex.publishedBasePrice);
  const unit = ex.publishedPriceUnit;
  if (!(base > 0) || !["perPerson", "perVehicle", "perCharter", "perNight"].includes(unit)) return null;
  const count = unit === "perPerson" ? Number(participants ?? guests) : 1;
  if (!Number.isInteger(count) || count < 1 || (unit === "perPerson" && count > Number(guests))) return null;
  const cents = partnerExperienceTotalCents({ providerUnitPriceDollars: base, quantity: count });
  const label = unit === "perPerson" ? `${count} participant(s) · estimated price incl. AOE 5%`
    : unit === "perVehicle" ? "1 vehicle · estimated price incl. AOE 5%"
    : unit === "perCharter" ? "1 private charter · estimated price incl. AOE 5%"
    : "1 night · estimated price incl. AOE 5%";
  return { price: cents / 100, label };
}

/* =====================================================
   SHARED BUTTON STYLES
===================================================== */

const primaryButton = `
  inline-flex items-center justify-center
  rounded-xl
  bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500
  px-7 py-3
  font-bold text-white
  shadow-[0_0_20px_rgba(249,115,22,0.35)]
  transition
  hover:brightness-110
  disabled:cursor-not-allowed
  disabled:opacity-40
`;

const secondaryButton = `
  inline-flex items-center justify-center
  rounded-xl
  border border-white/20
  bg-white/5
  px-6 py-3
  font-semibold text-white
  transition
  hover:bg-white/10
`;

// Step 2 categories. Keep these independent of partner names and prices.
const EXPERIENCE_CATEGORIES = [
  { id: "offroad", title: "4x4, ATV & Dirt Bike Adventures", description: "Explore Alaska's backcountry by Jeep, ATV, UTV, or dirt bike." },
  { id: "snow", title: "Snowmachine & Winter Adventures", description: "Snowmachine rides, winter trails, and ice-fishing outings." },
  { id: "fishing", title: "Fishing & River Adventures", description: "Guided fishing, river trips, and on-the-water experiences." },
  { id: "glacier", title: "Glaciers, Hiking & Ice Climbing", description: "Guided glacier walks, hiking, and ice climbing." },
  { id: "helicopter", title: "Helicopter & Flightseeing", description: "Scenic flights, glacier landings, and helicopter-assisted adventures." },
  { id: "sightseeing", title: "Sightseeing, Culture & History", description: "Alaska's stories, landmarks, and historic places." },
  { id: "water", title: "Hovercraft & Water Adventures", description: "See remote scenery from Alaska's waterways." },
  { id: "lodging", title: "Lodging & Overnight Stays", description: "Partner lodges and overnight options, subject to confirmation." },
  { id: "other", title: "More Alaska Experiences", description: "Additional experiences tailored to your vacation." },
];

function getExperienceCategory(experience) {
  const category = String(experience.category || "").toLowerCase();
  const name = String(experience.name || "").toLowerCase();
  if (["offroad", "atv", "utv", "motorsports", "dirtbike", "dirt-bike"].includes(category)) return "offroad";
  if (["snowmachine", "snowmobile", "winter"].includes(category) || name.includes("snowmachine")) return "snow";
  if (["fishing", "river", "rafting", "float", "kayaking"].includes(category)) return "fishing";
  if (["glacier", "hiking", "ice-climbing", "iceclimbing", "climbing"].includes(category)) return "glacier";
  if (["helicopter", "flightseeing", "aviation"].includes(category)) return "helicopter";
  if (["history", "sightseeing", "culture"].includes(category)) return "sightseeing";
  if (["hovercraft", "water", "boating"].includes(category)) return "water";
  if (["lodging", "camping", "accommodation"].includes(category)) return "lodging";
  return "other";
}

// Short display labels are presentation-only; booking IDs remain unchanged.
const EXPERIENCE_SHORT_NAMES = {
  "winter-knik-glacier": "Knik Glacier 4x4",
  "gunsight-alpine-morning": "Alpine Morning Ride",
  "gunsight-frozen-waters": "Snowmachine & Ice Fishing",
  "gunsight-full-day": "Full-Day Snowmachine",
  "gunsight-twilight-ridge": "Twilight Ridge Ride",
  "hatcherPassAtv": "Hatcher Pass ATV",
  "outboundHeli": "Helicopter Adventures",
  "Ice Climbing Root Glacier!": "Root Glacier Ice Climbing",
  "Mill Tour": "Kennecott Mill Tour",
  "alaskaPremierEnduro": "Guided Dirt Bike Tour",
  "phantomTriRiver": "Talkeetna River Charters",
  "kingForADay": "King for a Day Fishing",
  "gunsightLodge": "Gunsight Mountain Lodge",
  "seacraftHover": "Hovercraft Tours",
};

function getExperienceShortName(experience) {
  const name = EXPERIENCE_SHORT_NAMES[experience.id] || experience.name || "Alaska Experience";
  return name.length > 36 ? `${name.slice(0, 33).trimEnd()}…` : name;
}

function getExperienceTeaser(experience) {
  const description = String(experience.description || experience.desc || "Explore Alaska with an experienced local operator.").trim();
  if (description.length <= 104) return description;
  return `${description.slice(0, 101).replace(/\s+\S*$/, "").trimEnd()}…`;
}

/* =====================================================
   MAIN PLAN YOUR TRIP COMPONENT
===================================================== */
function TripEstimateSidebar({
  experiencePriceItems,
  experienceSubtotal,
  hasUnpricedExperiences,
  lodgingCharge,
  selectedAirbnbNights,
  winterNightlyRate,
  transportationCharge,
  jeepRentalTotal,
  billableJeepRentalDays,
  winterJeepRentalRate,
  totalTripEstimate,
  aoeExtendedStayDiscount,
  estimatedDeposit,
  estimatedBalance,
  isSummerExpedition,
  summerExpeditionDays,
  summerArrivalTotal,
  summerGuidedDaysTotal,
  summerDepartureTotal,
  summerAdditionalPassengers,
  summerPassengerTotal,
  expeditionStyle,
summerDailyRate,
summerIncludedArrival,
summerIncludedDeparture,
guestCount,
  winterExpeditionDays,
  winterBaseTotal,
  winterExpeditionDailyRate,
  winterAdditionalGuests,
  winterAdditionalGuestTotal,
}) {


  return (
    <div className="max-h-[calc(100vh-3rem)] overflow-y-auto rounded-3xl border border-orange-400/30 bg-neutral-900 p-6 shadow-xl">
      {/* SUMMER EXPEDITION PRICE BREAKDOWN */}

{isSummerExpedition && (
  <div className="mb-6 rounded-2xl border border-orange-400/30 bg-orange-500/10 p-4">

    <h3 className="text-lg font-bold text-orange-300">
      Your Summer Expedition
    </h3>

    <div className="mt-4 space-y-3 text-sm">

      <div className="flex justify-between gap-3">
        <span>
          {summerExpeditionDays} Expedition Nights ×
          ${summerDailyRate.toLocaleString()}
        </span>

        <span>
          ${summerGuidedDaysTotal.toLocaleString()}
        </span>
      </div>

      {summerAdditionalPassengers > 0 && (
        <div className="flex justify-between gap-3">
          <span>
            {summerAdditionalPassengers} Additional Guest(s) ×
            {summerExpeditionDays} Nights × $200
          </span>

          <span>
            ${summerPassengerTotal.toLocaleString()}
          </span>
        </div>
      )}

      <div className="flex justify-between border-t border-orange-400/30 pt-3 text-lg font-bold">
        <span>Summer Expedition Total</span>

        <span className="text-orange-400">
          ${(
            summerGuidedDaysTotal +
            summerPassengerTotal
          ).toLocaleString()}
        </span>
      </div>
    </div>

    <p className="mt-4 text-xs leading-5 text-neutral-300">
      {expeditionStyle === "tagAlong"
        ? "Guided tag-along expedition. Lodging and airport transportation are not included."
        : "Includes your expedition Jeep or passenger transportation, guided adventures, Airbnb lodging or camping, airport pickup, and airport drop-off. Departure day is included at no additional charge."}
    </p>

  </div>
)}


      



<div className="mb-5 flex items-center justify-between">
        <h3 className="text-xl font-bold">Your Trip Estimate</h3>
        <span className="text-xs font-semibold uppercase tracking-wide text-orange-400">
          Live Pricing
        </span>
      </div>

      {experiencePriceItems.length === 0 && !isSummerExpedition && winterBaseTotal === 0 ? (
        <p className="text-sm text-neutral-400">
          Select experiences to see your estimated trip cost.
        </p>
      ) : (
        <div className="space-y-4">
          {winterBaseTotal > 0 && (
            <div className="grid grid-cols-[1fr_auto] items-start gap-3 border-b border-white/10 pb-3">
              <div><div className="font-semibold">Winter AOE Expedition</div>
                <div className="mt-1 text-xs text-neutral-400">{winterExpeditionDays} day(s) × ${winterExpeditionDailyRate}/day for first guest · Jeep, lodging and transportation included</div>
              </div>
              <div className="shrink-0 font-semibold">${winterBaseTotal.toLocaleString()}</div>
              {winterAdditionalGuestTotal > 0 && <p className="col-span-2 text-xs text-neutral-300">Additional guests: {winterAdditionalGuests} × {winterExpeditionDays} day(s) × $300 = ${winterAdditionalGuestTotal.toLocaleString()}</p>}
            </div>
          )}
          {experiencePriceItems.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-4 border-b border-white/10 pb-3"
            >
              <div>
                <div className="font-semibold">{item.name}</div>
                <div className="mt-1 text-xs text-neutral-400">
                  {item.label}
                </div>
              </div>

              <div className="shrink-0 font-semibold">
                {item.price > 0
                  ? `$${item.price.toLocaleString()}`
                  : item.label.startsWith("Included") ? "Included" : "TBD"}
              </div>
            </div>
          ))}




         {/* SHOW SUBTOTAL ONLY FOR WINTER BOOKINGS */}

{!isSummerExpedition && (
  <div className="flex items-center justify-between border-t border-white/20 pt-4">
    <span className="font-semibold">
      Experience Subtotal
    </span>

    <span className="font-bold">
      ${experienceSubtotal.toLocaleString()}
      {hasUnpricedExperiences ? "+" : ""}
    </span>
  </div>
)}

{/* OPTIONAL TRANSPORTATION */}

{transportationCharge > 0 && (
  <div className="flex items-center justify-between gap-4">
    <span className="text-sm text-neutral-300">
      Winter Partner Excursion Transfers
    </span>

    <span className="font-semibold">
      ${transportationCharge.toLocaleString()}
    </span>
  </div>
)}

 {aoeExtendedStayDiscount > 0 && (
   <div className="flex items-center justify-between gap-3 text-sm text-emerald-300">
     <span>Extended-stay discount (AOE only)</span>
     <strong>−${aoeExtendedStayDiscount.toFixed(2)}</strong>
   </div>
 )}

 {/* COMPLETE TRIP ESTIMATE */}

<div className="border-t border-orange-400/30 pt-5">

  <div className="flex items-center justify-between gap-4">
    <span className="text-lg font-bold">
      Estimated Trip Total
    </span>

    <span className="text-2xl font-extrabold text-orange-400">
      ${totalTripEstimate.toLocaleString()}
      {hasUnpricedExperiences ? "+" : ""}
    </span>
  </div>

</div>

{/* DEPOSIT */}

<div className="flex items-center justify-between gap-4 text-sm">
  <span className="text-neutral-300">
    Estimated Payment Due Now
  </span>

  <span className="font-semibold">
    ${estimatedDeposit.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
  </span>
</div>

{/* REMAINING BALANCE */}

<div className="flex items-center justify-between gap-4 text-sm">
  <span className="text-neutral-400">
    Estimated Remaining Balance
  </span>

  <span className="font-semibold">
    ${estimatedBalance.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
  </span>
</div>

{/* PRICING NOTICE */}

<p className="border-t border-white/10 pt-4 text-xs leading-5 text-neutral-400">
  Estimates are based on your current selections.
  Partner experiences and availability require confirmation.
  Partner reservations are subject to confirmation. Your deposit is based on the displayed quote; lower confirmed costs reduce the balance. Upward adjustments require your agreement.
</p>
        </div>
      )}
    </div>
  );
}
export default function PlanYourTrip() {

  // Read the package selected from the homepage
  const [searchParams] = useSearchParams();

  const selectedPackageId = searchParams.get("package");
  const requestedExperienceId = searchParams.get("experience");
  const requestedExperience = experiences.find(item => item.id === requestedExperienceId);
  const requestedExperienceHasPrice = requestedExperience && (requestedExperience.operator === "AOE" || Number(requestedExperience.publishedBasePrice) > 0);

  const preselectedPackage = selectedPackageId
    ? getVacationPackageById(selectedPackageId)
    : null;
  const params = new URLSearchParams(window.location.search);

  const requestedPackage = params.get("package");

  const initialPackage = expeditionPackages.find(
    (pkg) => pkg.active && pkg.slug === requestedPackage
  );

  // STEP 1: Dates and guests
  // STEP 2: Choose adventure
  // STEP 3: Existing booking form

  const [step, setStep] = useState(1);

// STEP 3 — EXPERIENCE CUSTOMIZATION

const [expeditionStyle, setExpeditionStyle] = useState("selfDrive");
const [activityDate, setActivityDate] = useState("");
const [driverCount, setDriverCount] = useState(1);
const [customerRigs, setCustomerRigs] = useState(1);
const [customExpeditionDays, setCustomExpeditionDays] = useState(1);

// Airbnb lodging
const [lodgingOption, setLodgingOption] = useState("none");
const [selectedLodgingDates, setSelectedLodgingDates] = useState([]);

// Transportation and Jeep rental
const [transportationOption, setTransportationOption] = useState("none");
const [jeepRentalDays, setJeepRentalDays] = useState(0);
const [jeepRentalVehicles, setJeepRentalVehicles] = useState(1);

// Partner experience participants
const [experienceParticipants, setExperienceParticipants] = useState({});

// Step 4 — Lodging and additional experiences
const [lodgingNights, setLodgingNights] = useState(0);
const [selectedAddOns, setSelectedAddOns] = useState([]);

// Step 5 — Guest information and review
const [guestInfo, setGuestInfo] = useState({
  name: "",
  email: "",
  phone: "",
  address: "",
  shirtSize: "",
  additionalGuests: [],
  notes: "",
});

const [alaskaResident, setAlaskaResident] = useState(false);


  const [blockedDates, setBlockedDates] = useState(new Set());
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [availabilityError, setAvailabilityError] = useState("");
  const [dateRangeError, setDateRangeError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function loadAvailability() {
      setAvailabilityLoading(true);
      setAvailabilityError("");
      try {
        const response = await fetch('/api/calendar-availability', {signal:controller.signal, cache:'no-store'});
        if (!response.ok) throw new Error('Unable to load Google Calendar availability.');
        const data = await response.json();
        if (!Array.isArray(data.blockedDates)) throw new Error('Calendar availability data is incomplete.');
        setBlockedDates(new Set(data.blockedDates));
      } catch (err) {
        if (err.name !== 'AbortError') setAvailabilityError('Availability is unavailable right now. Please try refreshing before selecting dates.');
      } finally {
        if (!controller.signal.aborted) setAvailabilityLoading(false);
      }
    }
    loadAvailability();
    return () => controller.abort();
  }, []);

  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [guestCount, setGuestCount] = useState(2);

  // Existing primary selection — retained during transition
const [selectedExperience, setSelectedExperience] = useState(
  initialPackage?.slug || ""
);

// Multiple experiences selected for the vacation
const [selectedExperiences, setSelectedExperiences] = useState(
  () => requestedExperienceHasPrice && requestedExperienceId ? [requestedExperienceId] : (preselectedPackage?.experienceIds || [])
);



// Available overnight dates, excluding departure day
const lodgingDates = [];

if (arrivalDate && departureDate) {
  const current = new Date(`${arrivalDate}T12:00:00`);
  const end = new Date(`${departureDate}T12:00:00`);

  while (current < end) {
    lodgingDates.push(
      `${current.getFullYear()}-${String(
        current.getMonth() + 1
      ).padStart(2, "0")}-${String(
        current.getDate()
      ).padStart(2, "0")}`
    );

    current.setDate(current.getDate() + 1);
  }
}

// Experiences chosen in Step 2
const hasKnik = selectedExperiences.includes("winter-knik-glacier");

const hasCustomExpedition = selectedExperiences.includes(
  "custom-offroad-expedition"
);

const selectedPartnerExperiences = experiences.filter(
  (experience) =>
    selectedExperiences.includes(experience.id) &&
    experience.operator !== "AOE"
);

const partnerExperienceCount = selectedPartnerExperiences.length;

  // Determine the operating season from the selected travel dates.
const tripSeason = getOperatingSeason(arrivalDate);


  const today = getTodayLocal();

  const arrival = parseDate(arrivalDate);
  const departure = parseDate(departureDate);

  const nights =
    arrival && departure
      ? Math.round(
          (departure.getTime() - arrival.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

// ==========================================
// WINTER EXPEDITION PRICING
// ==========================================

// Calculate billable winter days.
// November 22–24 = 2 days.
// Same-day bookings = 0 expedition days.
const winterExpeditionDays =
  tripSeason === "winter" && nights > 0
    ? nights
    : 0;

// First guest: $600/day.
// Each additional guest: $300/day.
const winterAdditionalGuests = Math.max(
  0,
  Number(guestCount) - 1
);

const winterAdditionalGuestTotal =
  winterExpeditionDays *
  winterAdditionalGuests *
  SEASONAL_RATES.winter.additionalGuestDay;

const winterBaseTotal =
  winterExpeditionDays * SEASONAL_RATES.winter.expeditionDay +
  winterAdditionalGuestTotal;

// Same-day winter bookings have no expedition daily charge.
const winterIsStandaloneDayTrip =
  tripSeason === "winter" && nights === 0;

// $250 round-trip transportation applies ONLY to standalone
// partner excursions, never AOE Knik trips or multi-day bookings.
const winterPartnerTransportationTotal =
  winterIsStandaloneDayTrip
    ? selectedPartnerExperiences.length *
      SEASONAL_RATES.winter.partnerTransferPerExcursion
    : 0;

// Legacy fields intentionally zero: remove optional lodging/rental pricing.
const selectedAirbnbNights = 0;
const airbnbTotal = 0;
const partnerTransportationTotal = winterPartnerTransportationTotal;
const winterActivityDays = winterExpeditionDays;
const winterBookedExcursionDays = selectedPartnerExperiences.length + (winterIsStandaloneDayTrip && hasKnik ? 1 : 0);
const availableJeepRentalDays = 0;
const billableJeepRentalDays = 0;
const jeepRentalTotal = 0;
const additionalServicesTotal = 0;

// ==========================================
// SUMMER EXPEDITION PRICING
// ==========================================

// Arrival and departure are charged separately.
// Every full day between them is an expedition day.

// ==========================================
// SUMMER EXPEDITION PRICING
// ==========================================

// Each overnight stay is a billable expedition day.
// Example: Wednesday arrival through Saturday departure
// = 3 expedition nights.
// Airport pickup and departure-day drop-off are included.

const summerExpeditionDays = Math.max(0, nights);

// No separate arrival or departure fees.
const summerArrivalTotal = 0;
const summerDepartureTotal = 0;

const summerDailyRate =
  expeditionStyle === "tagAlong"
    ? 350
    : expeditionStyle === "rideAlong"
      ? 350 * Number(guestCount)
      : SEASONAL_RATES.summer.expeditionDay;

const summerAdditionalPassengers =
  tripSeason === "summer" && expeditionStyle === "selfDrive"
    ? Math.max(0, Number(guestCount) - 1)
    : 0;

const summerPassengerTotal =
  summerAdditionalPassengers *
  SEASONAL_RATES.summer.additionalGuestDay *
  summerExpeditionDays;

const summerGuidedDaysTotal =
  tripSeason === "summer"
    ? summerDailyRate * summerExpeditionDays
    : 0;

const summerIncludedArrival = 0;
const summerIncludedDeparture = 0;

const summerExpeditionTotal =
  summerGuidedDaysTotal + summerPassengerTotal;

  // ==========================================
// LIVE EXPERIENCE ESTIMATE
// ==========================================

// Summer expeditions are automatically included with summer dates.
// Customers only select additional experiences.

const isSummerExpedition =
  tripSeason === "summer" && summerExpeditionDays > 0;

const selectedExperienceDetails = selectedExperiences
  .filter((id) => id !== "custom-offroad-expedition")
  .map((id) => experiences.find((item) => item.id === id))
  .filter(Boolean);

const experiencePriceItems = selectedExperienceDetails.map(
  (experience) => {

    let price = 0;
    let label = "";

    // Summer expedition
    if (
      experience.id === "custom-offroad-expedition" &&
      tripSeason === "summer"
    ) {
      price = summerExpeditionTotal;
      label = `${summerExpeditionDays} expedition days + arrival/departure`;
    }

    // Winter Knik Glacier
    else if (experience.id === "winter-knik-glacier") {
      const drivers = Math.min(
        Number(driverCount),
        Number(guestCount),
        2
      );

      const passengers = Math.max(
        0,
        Number(guestCount) - drivers
      );

      price = winterIsStandaloneDayTrip
        ? drivers * BOOKING_RATES.winterKnikDriver + passengers * BOOKING_RATES.winterKnikPassenger
        : 0; // Knik is included in the multi-day winter expedition rate.

      label = winterIsStandaloneDayTrip
        ? `${drivers} driver(s), ${passengers} passenger(s)`
        : `Included in winter expedition (${drivers} driver(s), ${passengers} passenger(s))`;
    }

    // External partner quotes: provider's published price plus 5% on the
    // complete line total. No unverified placeholder prices are used.
    else if (experience.operator !== "AOE") {
      const quoted = partnerQuote(experience, guestCount, experienceParticipants[experience.id]);
      price = quoted?.price ?? 0;
      label = quoted?.label ?? "Pricing confirmed by your guide";
    }
    else {
      label = "Pricing confirmed by your guide";
    }

    return {
      id: experience.id,
      name: experience.name,
      price,
      label,
      estimated: true,
    };
  }
);

const aoeBaseTotal = (isSummerExpedition ? summerExpeditionTotal : 0) + winterBaseTotal;
const extendedStayRate = extendedStayDiscountRate(nights);
const aoeExtendedStayDiscount = Math.round(aoeBaseTotal * extendedStayRate * 100) / 100;
const experienceSubtotal =
  experiencePriceItems.reduce((total, item) => total + item.price, 0) +
  aoeBaseTotal;

// ==========================================
// COMPLETE TRIP ESTIMATE
// ==========================================

// Summer expedition lodging and transportation are included.
// Winter lodging is optional and priced separately.

const lodgingCharge = 0; // Included in winter AOE daily expedition rate

const transportationCharge = winterPartnerTransportationTotal;

// No standalone Jeep rental is offered in this booking model.
const totalTripEstimate =
  experienceSubtotal -
  aoeExtendedStayDiscount +
  lodgingCharge +
  transportationCharge +
  jeepRentalTotal;

const daysUntilArrival = arrival
  ? Math.ceil((arrival.getTime() - parseDate(today).getTime()) / 86400000)
  : null;
const paymentDueNow = daysUntilArrival !== null && daysUntilArrival <= 14
  ? totalTripEstimate
  : totalTripEstimate * BOOKING_RATES.depositPercent;
const estimatedDeposit = paymentDueNow;

const estimatedBalance =
  totalTripEstimate - estimatedDeposit;


const hasUnpricedExperiences = experiencePriceItems.some(
  (item) => item.label === "Pricing confirmed by your guide"
);




// ==========================================
// AVAILABLE EXPERIENCE DAYS
// ==========================================

// Winter single-day trips allow one experience.
// Multi-day winter trips allow one experience per expedition day.
// Summer retains its existing arrival/departure travel-day rules.

const availableAdventureDays =
  tripSeason === "winter"
    ? Math.max(1, nights)
    : Math.max(0, nights - 1);

// AOE core expeditions (including Knik with a multi-day winter trip)
// are included and DO NOT consume add-on excursion days.
// A standalone Knik day trip uses one scheduled adventure day.
const usedAdventureDays = partnerExperienceCount + (winterIsStandaloneDayTrip && hasKnik ? 1 : 0);

// ==========================================
// EXPERIENCE SELECTION
// ==========================================

function toggleExperience(experienceId) {
  setSelectedExperiences((current) => {

    // Clicking an already-selected experience removes it.
    if (current.includes(experienceId)) {
      return current.filter((id) => id !== experienceId);
    }

    // Don't allow more experiences than available adventure days.
    const candidate = experiences.find(ex => ex.id === experienceId);
    const candidateUsesDay = candidate && (candidate.operator !== "AOE" || (winterIsStandaloneDayTrip && candidate.id === "winter-knik-glacier"));
    if (candidateUsesDay && usedAdventureDays >= availableAdventureDays) return current;
    if (!candidate || !experienceAvailableDuringTrip(candidate, arrivalDate, departureDate)) return current;
    if (candidate.operator !== "AOE" && !partnerQuote(candidate, guestCount, experienceParticipants[experienceId])) return current;
    return [...current, experienceId];
  });
}

  const datesValid =
    !!arrival &&
    !!departure &&
    arrivalDate >= today &&
    (nights >= 1 || (tripSeason === "winter" && nights === 0)) &&
    nights <= 365 && !availabilityLoading && !availabilityError && !rangeIncludesBlockedDay(arrivalDate, departureDate, blockedDates);

  const guestsValid =
    Number.isInteger(Number(guestCount)) &&
    Number(guestCount) >= 1 &&
    Number(guestCount) <= 30;

  const activePackages = expeditionPackages.filter(
    (pkg) => pkg.active
  );

  const availablePackages = activePackages.filter((pkg) =>
    packageAvailableForDates(
      pkg,
      arrivalDate,
      departureDate
    )
  );

  // Only display active offerings available during the chosen dates.
  // Checking arrival through departure inclusively supports same-day Knik tours.
  const visibleExperiences = experiences.filter((experience) => {
    if (!experience.id || experience.category === "partner-information") return false;
    if (tripSeason === "summer" && experience.operator === "AOE") return false;
    if (experience.operator === "AOE" && experience.active !== true) return false;
    // Show verified-price partner drafts in the builder, never unpriced drafts.
    if (experience.operator !== "AOE" && !partnerQuote(experience, guestCount, experienceParticipants[experience.id])) return false;
    return experienceAvailableDuringTrip(experience, arrivalDate, departureDate);
  });

  const primaryAOEExperiences = visibleExperiences.filter((experience) => experience.operator === "AOE");

  const categorizedExperiences = EXPERIENCE_CATEGORIES.map((category) => ({
    ...category,
    items: visibleExperiences.filter((experience) => experience.operator !== "AOE" && getExperienceCategory(experience) === category.id),
  })).filter((category) => category.items.length > 0);

  const selectedPackage = availablePackages.find(
    (pkg) => pkg.slug === selectedExperience
  );

  const canContinue =
    step === 1
      ? datesValid && guestsValid && (tripSeason !== "summer" || summerExpeditionDays >= 1)
      : step === 2
        ? true // Multi-day AOE stays can be booked without partner activities
        : step === 3
          ? usedAdventureDays <= availableAdventureDays &&
            (!hasKnik || (
              driverCount >= 0 && driverCount <= 2 &&
              driverCount <= Number(guestCount) &&
              Number(guestCount) - driverCount <= 11
            )) &&
            (tripSeason !== "winter" || !winterIsStandaloneDayTrip || selectedExperiences.length > 0)
          : step === 4;

  function selectExperience(value) {
    setSelectedExperience(value);

    const url =
      value && value !== "custom"
        ? `/plan-your-trip?package=${encodeURIComponent(value)}`
        : "/plan-your-trip";

    window.history.replaceState({}, "", url);
  }

  function handleContinue() {
  if (!canContinue) return;

  if (step === 1) {
    if (
      selectedExperience !== "custom" &&
      !availablePackages.some(
        (pkg) => pkg.slug === selectedExperience
      )
    ) {
      selectExperience("");
    }

    setStep(2);
  }

  if (step === 2) {
    // Preserve the customer's selections from Step 1.
    setStep(3);
  }

  if (step === 3) {
  setStep(4);
}

if (step === 4) {
  setStep(5);
}

  window.scrollTo({ top: 0, behavior: "smooth" });
}

  function handleBack() {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  const isCustomBooking =
    step === 3 && selectedExperience === "custom";

  const isPackageBooking =
    step === 3 && selectedExperience !== "custom";

  /* =====================================================
     PAGE HEADER
  ===================================================== */

  return (
    <div className="min-h-screen bg-neutral-950 text-white">

      <header className="border-b border-white/10 bg-neutral-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">

          <a href="/" className="flex items-center gap-3">
            <img
              src="/images/Newlogo.png"
              alt="Alaska Offroad Expedition"
              className="h-10 w-10 object-contain"
            />

            <span className="text-sm font-bold sm:text-base">
              Alaska Offroad Expedition
            </span>
          </a>

          <a
            href="/"
            className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/10"
          >
            Home
          </a>

        </div>
      </header>

     

            {/* =================================================
          BOOKING FORMS + SHARED PRICING SIDEBAR
      ================================================= */}

      <div className="mx-auto grid max-w-[1600px] items-start gap-8 px-4 lg:grid-cols-[minmax(0,1fr)_340px]">

        {/* LEFT — TRIP BUILDER */}
        <div className="min-w-0">

      {step === 3 ? (
        <main className="w-full min-w-0 px-4 pb-32 pt-10">
          <div className="mb-8 text-center">
            <div className="text-sm font-bold uppercase tracking-widest text-orange-400">Step 3 — Customize Your Trip</div>
            <h1 className="mt-3 text-4xl font-extrabold">Your Expedition Details</h1>
            <p className="mt-3 text-neutral-300">We'll coordinate the activity schedule and travel logistics. No need to choose excursion dates.</p>
          </div>

          <div className="space-y-6">
            {tripSeason === "summer" && (
              <section className="rounded-3xl border border-orange-400/30 bg-orange-500/10 p-6">
                <h2 className="text-2xl font-bold">Your Summer Expedition</h2>
                <p className="mt-3 text-neutral-200">{summerExpeditionDays} full guided expedition days, {guestCount} traveler(s).</p>
                <p className="mt-3 text-sm text-neutral-300">
                  {expeditionStyle === "tagAlong"
                    ? "You'll follow your guide in your own off-road vehicle. Airbnb, airport transfers, and vehicle rental are not included."
                    : "Guided expedition vehicle use, overnight arrangements at AOE lodging or campsites, and airport pickup/drop-off are included in your expedition price."}
                </p>
                <p className="mt-4 font-extrabold text-orange-300">${summerExpeditionTotal.toLocaleString()} base expedition</p>
              </section>
            )}

            {hasKnik && tripSeason === "winter" && (
              <section className="rounded-3xl border border-white/10 bg-neutral-900 p-6">
                <h2 className="text-2xl font-bold">Winter Knik Glacier — Drive or Ride</h2>
                <p className="mt-2 text-neutral-400">Drive an AOE Jeep while following your guide in another vehicle, or ride as a passenger.</p>
                <label className="mt-5 block font-semibold" htmlFor="knik-drivers">{winterIsStandaloneDayTrip ? "Number of drivers — $695 each" : "Number of drivers — included"}</label>
                <select id="knik-drivers" value={Math.min(driverCount, Number(guestCount), 2)}
                  onChange={(event) => setDriverCount(Number(event.target.value))}
                  className="mt-2 w-full max-w-xs rounded-xl border border-white/20 bg-neutral-800 px-4 py-4">
                  {Array.from({length: Math.min(2, Number(guestCount)) + 1}, (_, index) => index).map(count =>
                    <option value={count} key={count}>{count} driver(s)</option>)}
                </select>
                <p className="mt-4 text-neutral-300">{winterIsStandaloneDayTrip ? "Passengers — $395 each" : "Passengers — included"}: <strong>{Math.max(0, Number(guestCount) - driverCount)}</strong></p>
                <p className="mt-3 text-sm text-neutral-400">{winterIsStandaloneDayTrip ? "Standalone Knik pricing applies with no daily expedition fee." : "Knik is included at no additional charge with your multi-day winter expedition."} Hot lunch and glacier exploration are included. Passenger and driver capacity are subject to confirmation.</p>
              </section>
            )}

            {selectedPartnerExperiences.length > 0 && (
              <section className="rounded-3xl border border-white/10 bg-neutral-900 p-6">
                <h2 className="text-2xl font-bold">Partner Experience Participants</h2>
                <p className="mt-2 text-neutral-400">Choose how many guests will participate in each add-on. We'll arrange their dates with the providers.</p>
                <div className="mt-5 space-y-4">
                  {selectedPartnerExperiences.map((experience) => (
                    <div key={experience.id} className="rounded-xl border border-white/10 bg-neutral-800 p-4">
                      <div className="font-bold">{experience.name}</div>
                      {experience.publishedPriceUnit === "perPerson" ? <>
                      <label className="mt-3 block text-sm" htmlFor={`participants-${experience.id}`}>Participants</label>
                      <select id={`participants-${experience.id}`}
                        value={Math.min(Number(guestCount), Number(experienceParticipants[experience.id] ?? guestCount))}
                        onChange={(e) => setExperienceParticipants(current => ({...current, [experience.id]: Number(e.target.value)}))}
                        className="mt-2 rounded-xl border border-white/20 bg-neutral-900 px-4 py-3">
                        {Array.from({length: Number(guestCount)}, (_, i) => i + 1).map(n => <option key={n} value={n}>{n} guest(s)</option>)}
                      </select>
                      </> : <p className="mt-3 text-sm text-neutral-300">Quoted for one {experience.publishedPriceUnit === "perVehicle" ? "vehicle" : experience.publishedPriceUnit === "perCharter" ? "charter" : "night"}. Additional quantities require confirmation.</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {tripSeason === "winter" && (
              <section className="rounded-3xl border border-orange-400/30 bg-orange-500/10 p-6">
                <h2 className="text-2xl font-bold">Your Winter AOE Vacation</h2>
                {winterIsStandaloneDayTrip ? (
                  <p className="mt-3 text-neutral-200">Standalone day trip: no AOE daily vacation charge. Knik includes AOE guiding and vehicle use. Partner excursions receive an additional $250 round-trip transfer fee each.</p>
                ) : (
                  <>
                    <p className="mt-3 text-neutral-200">{winterExpeditionDays} expedition day(s) × ${SEASONAL_RATES.winter.expeditionDay.toLocaleString()} for the first guest + {winterAdditionalGuests} additional guest(s) × ${SEASONAL_RATES.winter.additionalGuestDay.toLocaleString()}/day = ${winterBaseTotal.toLocaleString()}</p>
                    <p className="mt-2 text-sm text-neutral-300">AOE lodging, the expedition Jeep and transportation are included. There is no separate nightly lodging, Jeep rental or airport transfer charge.</p>
                  </>
                )}
                {winterPartnerTransportationTotal > 0 && (
                  <p className="mt-3 text-sm text-orange-200">Partner excursion transfers: {selectedPartnerExperiences.length} × ${SEASONAL_RATES.winter.partnerTransferPerExcursion} = ${winterPartnerTransportationTotal.toLocaleString()}.</p>
                )}
              </section>
            )}
          </div>

          <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-neutral-950/95 px-4 py-4 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
              <button type="button" onClick={handleBack} className={secondaryButton}>← Back</button>
              <button type="button" onClick={handleContinue} disabled={!canContinue} className={primaryButton}>Review My Vacation →</button>
            </div>
          </div>
        </main>

) : step === 4 ? (
  <StepTripReview
    arrivalDate={arrivalDate} departureDate={departureDate} guestCount={guestCount}
    tripSeason={tripSeason} expeditionStyle={expeditionStyle}
    experiencePriceItems={experiencePriceItems} totalTripEstimate={totalTripEstimate}
    estimatedDeposit={estimatedDeposit} selectedAirbnbNights={tripSeason === "winter" ? selectedAirbnbNights : 0}
    lodgingCharge={lodgingCharge} transportationCharge={transportationCharge}
    jeepRentalTotal={jeepRentalTotal} billableJeepRentalDays={billableJeepRentalDays}
    selectedExperiences={selectedExperiences} winterExpeditionDays={winterExpeditionDays}
    winterBaseTotal={winterBaseTotal} aoeExtendedStayDiscount={aoeExtendedStayDiscount} onBack={handleBack} onContinue={handleContinue}
  />
) : step === 5 ? (
  <StepGuestReview
    arrivalDate={arrivalDate} departureDate={departureDate} guestCount={guestCount}
    tripSeason={tripSeason} expeditionStyle={expeditionStyle}
    experiencePriceItems={experiencePriceItems} totalTripEstimate={totalTripEstimate}
    estimatedDeposit={estimatedDeposit} estimatedBalance={estimatedBalance}
    lodgingCharge={lodgingCharge} selectedAirbnbNights={selectedAirbnbNights}
    jeepRentalTotal={jeepRentalTotal} billableJeepRentalDays={billableJeepRentalDays}
    guestInfo={guestInfo} setGuestInfo={setGuestInfo} winterExpeditionDays={winterExpeditionDays}
    winterBaseTotal={winterBaseTotal} aoeExtendedStayDiscount={aoeExtendedStayDiscount} transportationCharge={transportationCharge} onBack={handleBack}
    selectedExperiences={selectedExperiences} experienceParticipants={experienceParticipants}
    driverCount={driverCount} customerRigs={customerRigs}
  />
) : (
        /* =================================================
            STEPS 1 AND 2
        ================================================= */

        <main className="mx-auto max-w-7xl px-4 pb-32 pt-10">

          {/* Progress Indicator */}

          <div className="mb-10">

            <div className="flex items-center justify-between text-sm font-semibold">

              <span
                className={
                  step === 1
                    ? "text-orange-400"
                    : "text-neutral-400"
                }
              >
                1. Dates & Guests
              </span>

              <span
                className={
                  step === 2
                    ? "text-orange-400"
                    : "text-neutral-400"
                }
              >
                2. Adventure
              </span>

              <span className="text-neutral-400">
                3. Customize
              </span>

            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-800">

              <div
                className="h-full rounded-full bg-orange-500 transition-all duration-300"
                style={{
                  width: `${(step / 5) * 100}%`,
                }}
              />

            </div>

          </div>

          {/* =================================================
              STEP 1 — DATES & GUESTS
          ================================================= */}

          {step === 1 && (

            <div className="mx-auto max-w-4xl">

              <div className="mb-10 text-center">

                <div className="text-sm font-bold uppercase tracking-widest text-orange-400">
                  Step 1 — Your Alaska Vacation
                </div>

                <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">
                  When Are You Visiting Alaska?
                </h1>

                <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-300">
                  Tell us when you're coming and who's joining you.
                  We'll show you adventures available during your stay.
                </p>
                {requestedExperience && <p className="mx-auto mt-4 max-w-2xl rounded-xl border border-orange-400/40 bg-orange-500/10 p-3 text-sm text-orange-100">
                  Interested in: <strong>{requestedExperience.name}</strong>. {requestedExperienceHasPrice ? "This experience is already selected for your trip, subject to your travel dates and provider confirmation." : "Its price has not been finalized. You can plan your trip, but this activity cannot be charged until its price is approved."}
                </p>}

              </div>

              <div className="rounded-3xl border border-white/10 bg-neutral-900 p-6 md:p-10">

                <div className="grid gap-6 md:grid-cols-2">

                  <AvailabilityDatePicker label="Arrival Date" value={arrivalDate} minDate={today} today={today} blockedDates={blockedDates} loading={availabilityLoading} error={availabilityError} onSelect={(date)=>{setArrivalDate(date);setDepartureDate('');setDateRangeError('');}} />
                  <AvailabilityDatePicker label="Departure Date" value={departureDate} minDate={arrivalDate ? addDays(parseDate(arrivalDate),getOperatingSeason(arrivalDate)==='winter'?0:1).toISOString().slice(0,10) : today} today={today} blockedDates={blockedDates} loading={availabilityLoading} error={availabilityError} onSelect={(date)=>{
                    if (!arrivalDate) {setDateRangeError('Select an arrival date first.');return;}
                    if (rangeIncludesBlockedDay(arrivalDate,date,blockedDates)) {setDateRangeError('Your selected dates include a booked day. Choose a departure date before the booked day, or choose different arrival dates.');setDepartureDate('');return;}
                    setDateRangeError('');setDepartureDate(date);
                  }} />
                </div>

                {dateRangeError && <p role="alert" className="mt-4 text-sm text-red-300">{dateRangeError}</p>}
                {/* Guests */}

                <div className="mt-8">

                  <label className="mb-3 block font-semibold">
                    How Many Guests Are Traveling?
                  </label>

                  <div className="flex max-w-xs items-center gap-4">

                    <button
                      type="button"
                      onClick={() =>
                        setGuestCount((value) =>
                          Math.max(1, Number(value) - 1)
                        )
                      }
                      disabled={Number(guestCount) <= 1}
                      className="h-12 w-12 rounded-xl border border-white/20 bg-neutral-800 text-2xl font-bold hover:bg-neutral-700 disabled:opacity-40"
                    >
                      −
                    </button>

                    <div className="flex-1 text-center text-3xl font-bold">
                      {guestCount}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setGuestCount((value) =>
                          Math.min(30, Number(value) + 1)
                        )
                      }
                      disabled={Number(guestCount) >= 30}
                      className="h-12 w-12 rounded-xl border border-white/20 bg-neutral-800 text-2xl font-bold hover:bg-neutral-700 disabled:opacity-40"
                    >
                      +
                    </button>

                  </div>

                </div>
{/* SUMMER EXPEDITION VEHICLE SELECTION */}

{tripSeason === "summer" && (

  <section className="mt-8 rounded-3xl border border-white/10 bg-neutral-900 p-6">

    <div className="text-xs font-bold uppercase tracking-widest text-orange-400">
      Your Expedition Vehicle
    </div>

    <h2 className="mt-3 text-2xl font-bold">
      Drive One of Our Jeep Gladiators
    </h2>

    <p className="mt-3 text-neutral-300">
      Take the wheel of an expedition-equipped AOE Jeep Gladiator
      while following your experienced guide in a separate vehicle.
      Explore Alaska's backcountry with the freedom to drive,
      without having to bring your own off-road rig.
    </p>

    <button
      type="button"
      onClick={() => setExpeditionStyle("selfDrive")}
      className={`mt-6 w-full rounded-2xl border p-5 text-left transition ${
        expeditionStyle === "selfDrive"
          ? "border-orange-400 bg-orange-500/10"
          : "border-white/20 bg-neutral-800 hover:border-orange-400"
      }`}
    >
      <div className="flex items-center justify-between gap-4">

        <div>
          <div className="text-lg font-bold">
            Drive Our Jeep
          </div>

          <p className="mt-2 text-sm text-neutral-400">
            $1,250 per full expedition day.
            Additional guests are $200 per person, per day.
          </p>
        </div>

        <span className="shrink-0 font-bold text-orange-400">
          {expeditionStyle === "selfDrive" ? "✓ Selected" : "Select"}
        </span>

      </div>
    </button>

    {/* SECONDARY TAG-ALONG OPTION */}

    <div className="mt-6 border-t border-white/10 pt-6">

      <p className="text-sm text-neutral-400">
        Already have an off-road-capable vehicle?
      </p>

      <button
        type="button"
        onClick={() =>
          setExpeditionStyle(
            expeditionStyle === "tagAlong"
              ? "selfDrive"
              : "tagAlong"
          )
        }
        className="mt-2 text-sm font-bold text-orange-400 hover:text-orange-300"
      >
        {expeditionStyle === "tagAlong"
          ? "✓ Bringing My Own Rig — Change to AOE Jeep"
          : "Bringing My Own Rig? View Tag-Along Option →"}
      </button>

      {expeditionStyle === "tagAlong" && (

        <div className="mt-5 rounded-2xl border border-orange-400/30 bg-orange-500/10 p-5">

          <h3 className="text-lg font-bold">
            Guided Tag-Along Expedition
          </h3>

          <p className="mt-2 text-sm text-neutral-300">
            Bring your own capable off-road vehicle and follow
            your AOE guide through Alaska's backcountry.
          </p>

          <p className="mt-3 font-bold text-orange-300">
            $350 per rig, per guided expedition day.
          </p>

          <p className="mt-2 text-xs text-neutral-400">
            Passengers traveling in your own vehicle are included.
            Lodging and airport transportation are not included
            in the tag-along rate.
          </p>

        </div>

      )}

    </div>

  </section>

)}


{/* SUMMER JEEP OCCUPANTS */}

{tripSeason === "summer" && expeditionStyle === "selfDrive" && (

  <section className="mt-6 rounded-3xl border border-white/10 bg-neutral-900 p-6">

    <h3 className="text-xl font-bold">
      Drivers & Passengers
    </h3>

    <p className="mt-2 text-sm text-neutral-400">
      Your expedition includes one primary driver.
      Additional guests are $200 per person, per full expedition day.
    </p>

    <div className="mt-5 grid gap-4 sm:grid-cols-2">

      <div>
        <label className="mb-2 block font-semibold">
          Drivers
        </label>

        <select
          value={driverCount}
          onChange={(event) =>
            setDriverCount(Number(event.target.value))
          }
          className="w-full rounded-xl border border-white/20 bg-neutral-800 px-4 py-4"
        >
          <option value={1}>1 Driver</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block font-semibold">
          Additional Passengers
        </label>

        <div className="rounded-xl border border-white/20 bg-neutral-800 px-4 py-4">
          {Math.max(0, Number(guestCount) - 1)}
        </div>
      </div>

    </div>

  </section>

)}


                {/* Information */}

                <div className="mt-8 rounded-2xl border border-orange-400/20 bg-orange-500/10 p-5">

                  <p className="font-semibold text-orange-300">
                    Your vacation dates help us find the right adventures.
                  </p>

                  <p className="mt-2 text-sm leading-6 text-neutral-300">
                    Summer dates include guided expedition days automatically.
                    Choose optional partner experiences in Step 2.
                  </p>

                </div>

                {datesValid && guestsValid && (
                  <div className="mt-6 text-center text-sm text-neutral-300">

                    {formatDate(arrivalDate)}
                    {" — "}
                    {formatDate(departureDate)}
                    {" • "}
                    {nights} night{nights !== 1 ? "s" : ""}
                    {" • "}
                    {guestCount} guest
                    {Number(guestCount) !== 1 ? "s" : ""}

                  </div>
                )}

              </div>

            </div>
          )}

                    {/* =================================================
              Step 2 — Add Experiences to Your Expedition
          ================================================= */}

          {step === 2 && (

            <div>

              <div className="mb-10 text-center">

                <div className="text-sm font-bold uppercase tracking-widest text-orange-400">
                  Step 2 — Build Your Alaska Adventure
                </div>

                <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">
                 Build Your Expedition
                </h1>

                <p className="mx-auto mt-4 max-w-3xl text-lg text-neutral-300">
                  Your Alaska Off-Road Expedition comes first. Browse optional partner excursions below to add stops along the way. 
                </p>

                <p className="mt-4 text-sm font-semibold text-orange-300">
                  {formatDate(arrivalDate)}
                  {" — "}
                  {formatDate(departureDate)}
                  {" • "}
                  {guestCount} guest
                  {Number(guestCount) !== 1 ? "s" : ""}
                </p>

              </div>
              <section className="mb-10 rounded-3xl border border-orange-400/35 bg-neutral-900/40 p-4 sm:p-6" aria-label="Select your core expedition">
                <div className="mb-5 border-b border-white/15 pb-4">
                  <h2 className="text-2xl font-extrabold text-white sm:text-3xl">SELECT YOUR CORE EXPEDITION</h2>
                  <p className="mt-2 text-sm text-neutral-300">Your Alaska Off-Road Expedition is the main adventure. Choose your primary trip here; optional add-on excursions are below.</p>
                </div>
              {/* Seasonal expedition introduction within the core expedition selection. */}
              <section className="mb-5 overflow-hidden rounded-2xl border border-white/15 bg-neutral-900" aria-label="Your included Alaska off-road expedition">
                <img
                  src={tripSeason === "winter" ? "/images/expedition-winter-banner.png" : "/images/expedition-summer-banner.png"}
                  alt={tripSeason === "winter"
                    ? "Two Alaska Off-Road Expedition Jeeps at a winter campsite with a campfire and chairs in the snowy mountains"
                    : "Two Alaska Off-Road Expedition Jeeps beside a summer campsite with a campfire and chairs in the Alaska mountains"}
                  className="block h-auto w-full"
                  loading="eager"
                />
                <div className="border-t border-white/10 px-5 py-5 sm:px-7 sm:py-6">
                  <h3 className="text-lg font-extrabold text-white sm:text-xl">Your Alaska Off-Road Expedition</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-300 sm:text-base">
                    Guided off-road exploration and remote camping are part of your Alaska expedition.
                    The activities below are optional stops and adventures you can add along the way.
                    You don't have to select an add-on to enjoy the expedition.
                  </p>
                </div>
              </section>

              {tripSeason === "summer" && (
                <div className="mb-8 rounded-2xl border border-orange-400/40 bg-orange-500/10 p-5">
                  <div className="text-sm font-extrabold text-orange-300">✓ Summer Off-Road Expedition — Included</div>
                  <p className="mt-2 text-sm text-neutral-300">Your dates and expedition style already determine your primary trip price. You do not need to add it again.</p>
                </div>
              )}
              {tripSeason === "winter" && nights > 0 && (
                <div className="mb-8 rounded-2xl border border-orange-400/40 bg-orange-500/10 p-5">
                  <div className="text-sm font-extrabold text-orange-300">✓ Winter Off-Road Expedition — Included</div>
                  <p className="mt-2 text-sm text-neutral-300">Your multi-day winter vacation includes the primary AOE expedition. You can add the Knik Glacier experience below as a scheduled stop without paying for the included adventure twice.</p>
                </div>
              )}
              {primaryAOEExperiences.length > 0 && (
                <div className="mt-5" aria-label="AOE core expedition options">
                  <h3 className="mb-4 text-lg font-extrabold text-white">Available AOE Expeditions</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {primaryAOEExperiences.map((experience) => {
                      const selected = selectedExperiences.includes(experience.id);
                      const isFull = !selected && winterIsStandaloneDayTrip && usedAdventureDays >= availableAdventureDays;
                      return (
                        <button key={experience.id} type="button" onClick={() => toggleExperience(experience.id)} disabled={isFull} aria-pressed={selected}
                          className={`overflow-hidden rounded-xl border text-left transition disabled:opacity-40 ${selected ? "border-orange-400 bg-orange-500/10" : "border-white/20 bg-neutral-900 hover:border-orange-400/70"}`}>
                          <div className="aspect-video w-full bg-black">
                            <img src={experience.image || "/images/knik-winter-package.png"} alt={experience.name} className="h-full w-full object-contain" loading="lazy" />
                          </div>
                          <div className="p-4">
                            <h4 className="font-extrabold text-white">{getExperienceShortName(experience)}</h4>
                            <p className="mt-1 text-sm text-neutral-300">{getExperienceTeaser(experience)}</p>
                            <p className="mt-3 text-sm font-extrabold text-orange-300">{winterIsStandaloneDayTrip ? `From $${BOOKING_RATES.winterKnikPassenger}/passenger` : "Included with multi-day winter expedition"}</p>
                            <p className="mt-1 text-xs text-orange-200">{selected ? "✓ Added to your itinerary" : "Select this AOE experience →"}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              </section>
              {/* One divider above and below the adventure-day summary. */}
              <div className="my-7 h-px w-full bg-white/25" aria-hidden="true" />
              {/* AVAILABLE ADVENTURE DAYS: separates primary expedition from add-ons */}
<div className="rounded-2xl border border-white/10 bg-neutral-900 p-5">

  <div className="flex flex-wrap items-center justify-between gap-3">

    <div>
      <h3 className="text-lg font-bold">
        Available Adventure Days
      </h3>

      <p className="mt-1 text-sm text-neutral-400">
        Choose optional excursions for the adventure days available in your itinerary.
      </p>
    </div>

    <div className="text-right">
      <div className="text-2xl font-extrabold text-orange-400">
        {usedAdventureDays} / {availableAdventureDays}
      </div>

      <div className="text-xs text-neutral-400">
        Add-on days used
      </div>
    </div>

  </div>

  {usedAdventureDays >= availableAdventureDays &&
    availableAdventureDays > 0 && (

    <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-300">
      You've selected the maximum number of experiences
      for your vacation. Remove an experience or extend
      your stay to add another.
    </p>

  )}

</div>
              <div className="my-7 h-px w-full bg-white/25" aria-hidden="true" />
              <div className="mb-5">
                <h2 className="text-2xl font-extrabold text-white sm:text-3xl">SELECT YOUR ADD-ON EXCURSIONS</h2>
                <p className="mt-1 text-sm text-neutral-400">Optional stops and adventures offered by our Alaska partners. Open a category to see the excursions.</p>
              </div>
              {/* FULL-WIDTH EXPERIENCE CATALOG; shared estimate stays in the outer sidebar */}
<div className="min-w-0">
              {/* SHOP EXPERIENCES BY CATEGORY — COMPACT, EXPANDABLE GROUPS */}
              <div className="space-y-3">
                {categorizedExperiences.map((category) => {
                  const selectedInCategory = category.items.filter((item) =>
                    selectedExperiences.includes(item.id)
                  ).length;

                  return (
                    <details key={category.id} className="group min-w-0 overflow-hidden rounded-2xl border border-white/20 bg-neutral-900/70" open={category.id === categorizedExperiences[0]?.id ? true : undefined}>
                      <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3 px-3 py-3 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-400 sm:gap-4 sm:px-5 [&::-webkit-details-marker]:hidden">
                        <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg border border-white/20 bg-black sm:h-[72px] sm:w-24">
                          {(category.items[0]?.image || category.items[0]?.images?.[0]) ? (
                            <img
                              src={category.items[0].image || category.items[0].images[0]}
                              alt=""
                              loading="lazy"
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center p-2 text-center text-[10px] text-neutral-400">Photo coming soon</div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base font-extrabold text-white sm:text-xl">{category.title}</h3>
                          <p className="mt-1 hidden text-xs text-neutral-400 sm:block sm:text-sm">{category.description}</p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-3">
                          <span className="text-[10px] font-bold text-orange-300 sm:text-xs">{category.items.length} excursions{selectedInCategory ? ` · ${selectedInCategory} selected` : ""}</span>
                          <span className="inline-flex items-center gap-2 rounded-lg border border-orange-400/60 bg-orange-500/15 px-3 py-2 text-xs font-extrabold text-orange-200">
                            <span className="group-open:hidden">OPEN</span>
                            <span className="hidden group-open:inline">CLOSE</span>
                            <svg className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="m4 7 6 6 6-6" /></svg>
                          </span>
                        </div>
                      </summary>

                      <div className="grid grid-cols-2 gap-3 border-t border-white/15 p-3 md:grid-cols-3 xl:grid-cols-4 sm:p-4">
                        {category.items.map((experience) => {
                          const selected = selectedExperiences.includes(experience.id);
                          const isFull = !selected && usedAdventureDays >= availableAdventureDays;
                          let priceLabel = "Price on request";
                           const quote = experience.operator !== "AOE"
                             ? partnerQuote(experience, guestCount, experienceParticipants[experience.id]) : null;
                           if (quote) {
                             const unit = experience.publishedPriceUnit;
                             const unitLabel = unit === "perPerson" ? "/person" : unit === "perVehicle" ? "/vehicle" : unit === "perCharter" ? "/charter" : "/night";
                             priceLabel = `From $${getPartnerDisplayPrice(experience)?.toFixed(2)}${unitLabel} · estimated`;
                           } else if (experience.pricingType === "driverPassenger") {
                             priceLabel = winterIsStandaloneDayTrip
                               ? `From $${Number(experience.passengerPrice).toLocaleString()}/person`
                               : "Included with winter vacation";
                           }

                          return (
                            <button
                              key={experience.id}
                              type="button"
                              disabled={isFull}
                              onClick={() => toggleExperience(experience.id)}
                              aria-pressed={selected}
                              title={experience.name}
                              className={`group flex min-w-0 flex-col overflow-hidden rounded-xl border text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${selected ? "border-orange-400 bg-orange-500/10" : "border-white/15 bg-neutral-900 hover:border-orange-400/60 hover:bg-neutral-800"}`}
                            >
                              <div className="relative aspect-video w-full overflow-hidden bg-black">
                                {experience.image ? (
                                  <img src={experience.image} alt="" loading="lazy" className="h-full w-full object-contain" />
                                ) : (
                                  <div className="flex h-full items-center justify-center px-3 text-center text-xs text-neutral-500">Photo coming soon</div>
                                )}
                                <span className={`absolute right-2 top-2 rounded-full px-2 py-1 text-[10px] font-extrabold ${selected ? "bg-orange-500 text-black" : "bg-black/75 text-white"}`}>
                                  {selected ? "✓ ADDED" : "+ ADD"}
                                </span>
                              </div>
                              <div className="flex flex-1 flex-col p-3">
                                <p className="truncate text-[10px] font-bold uppercase tracking-wide text-orange-300" title={experience.operator}>
                                  {experience.operator === "AOE" ? "Alaska Off-Road Expedition" : experience.operator}
                                </p>
                                <h4 className="mt-1 min-h-[2.6rem] text-sm font-bold leading-snug text-white sm:text-base">
                                  {getExperienceShortName(experience)}
                                </h4>
                                <p className="mt-1 flex-1 text-xs leading-4 text-neutral-400" style={{display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>
                                  {getExperienceTeaser(experience)}
                                </p>
                                <div className="mt-3 border-t border-white/10 pt-2 text-xs font-bold text-white">
                                  {priceLabel}
                                </div>
                                <p className="mt-1 text-[11px] font-semibold text-orange-300">
                                  {selected ? "Selected — remove" : isFull ? "Trip is full" : "Add to trip"}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </details>
                  );
                })}
              </div>
            </div>

              {/* NO EXPERIENCES AVAILABLE */}

{visibleExperiences.length === 0 && (

                <div className="mt-8 rounded-2xl border border-white/10 bg-neutral-900 p-6 text-center">

                  <h3 className="text-xl font-bold">
                    No experiences available for these dates
                  </h3>

                  <p className="mt-3 text-neutral-300">
                    Try adjusting your travel dates or contact
                    your guide to discuss available options.
                  </p>

                  <a
                    href="/#contact"
                    className="mt-5 inline-block font-bold text-orange-400 hover:text-orange-300"
                  >
                    Talk to Your Guide →
                  </a>

                </div>

              )}

              <p className="mt-8 text-center text-sm text-neutral-400">
                Experiences are subject to seasonal availability.
                Partner activities are confirmed after reservation.
              </p>

            </div>

          )}

        </main>
      )}
        </div>

        {/* RIGHT — SHARED STICKY PRICING SUMMARY */}
        <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">

         <TripEstimateSidebar
  experiencePriceItems={experiencePriceItems}
  experienceSubtotal={experienceSubtotal}
  hasUnpricedExperiences={hasUnpricedExperiences}
  lodgingCharge={lodgingCharge}
  selectedAirbnbNights={tripSeason === "winter" ? selectedAirbnbNights : 0}
  winterNightlyRate={SEASONAL_RATES.winter.airbnbNight}
  transportationCharge={transportationCharge}
  jeepRentalTotal={jeepRentalTotal}
  billableJeepRentalDays={billableJeepRentalDays}
  winterJeepRentalRate={SEASONAL_RATES.winter.jeepRentalDay}
  totalTripEstimate={totalTripEstimate}
  aoeExtendedStayDiscount={aoeExtendedStayDiscount}
  estimatedDeposit={estimatedDeposit}
  estimatedBalance={estimatedBalance}
  isSummerExpedition={isSummerExpedition}
  summerExpeditionDays={summerExpeditionDays}
  summerArrivalTotal={summerArrivalTotal}
  summerGuidedDaysTotal={summerGuidedDaysTotal}
  summerDepartureTotal={summerDepartureTotal}
  summerAdditionalPassengers={summerAdditionalPassengers}
  summerPassengerTotal={summerPassengerTotal}
  expeditionStyle={expeditionStyle}
summerDailyRate={summerDailyRate}
summerIncludedArrival={summerIncludedArrival}
summerIncludedDeparture={summerIncludedDeparture}
guestCount={guestCount}
  winterExpeditionDays={winterExpeditionDays}
  winterBaseTotal={winterBaseTotal}
  winterExpeditionDailyRate={SEASONAL_RATES.winter.expeditionDay}
  winterAdditionalGuests={winterAdditionalGuests}
  winterAdditionalGuestTotal={winterAdditionalGuestTotal}

/>

        </aside>

      </div>
      {/* =================================================
          STICKY CONTINUE BUTTON — STEPS 1 & 2
      ================================================= */}

      {step < 3 && (

        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-neutral-950/95 px-4 py-4 backdrop-blur">

          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">

            <div>

              {step === 2 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className={secondaryButton}
                >
                  ← Back
                </button>
              )}

              {step === 1 && (
                <div className="text-sm text-neutral-400">
                  Step 1 of 5
                </div>
              )}

              {step === 2 && (
                <div className="mt-2 text-sm text-orange-300">
                  {selectedExperiences.length} experience
                  {selectedExperiences.length !== 1 ? "s" : ""} selected
                </div>
              )}

            </div>

            <button
              type="button"
              disabled={!canContinue}
              onClick={handleContinue}
              className={primaryButton}
            >
              {step === 1
                ? "See Available Adventures →"
                : "Continue to Build Itinerary →"}
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

/* =====================================================
   STEP 4 — TRIP REVIEW (NO DUPLICATE ADD-ON SELECTION)
===================================================== */
function StepTripReview({arrivalDate, departureDate, guestCount, tripSeason,
  expeditionStyle, experiencePriceItems, totalTripEstimate, estimatedDeposit,
  selectedAirbnbNights, lodgingCharge, transportationCharge,
  jeepRentalTotal, billableJeepRentalDays, winterExpeditionDays, winterBaseTotal, aoeExtendedStayDiscount, onBack, onContinue}) {
  return (
    <main className="w-full min-w-0 px-4 pb-32 pt-10">
      <div className="mb-8 text-center">
        <div className="text-sm font-bold uppercase tracking-widest text-orange-400">Step 4 — Review Your Vacation</div>
        <h1 className="mt-3 text-4xl font-extrabold">Your Alaska Adventure</h1>
        <p className="mt-3 text-neutral-400">Review what you've selected. AOE will arrange the daily itinerary.</p>
      </div>
      <div className="space-y-6">
        <section className="rounded-3xl border border-white/10 bg-neutral-900 p-6">
          <h2 className="text-2xl font-bold">Reservation Overview</h2>
          <div className="mt-4 space-y-2 text-neutral-300">
            <p>Arrival: {formatDate(arrivalDate)}</p>
            <p>Departure: {formatDate(departureDate)}</p>
            <p>Travelers: {guestCount}</p>
            <p>Booking type: {tripSeason === "summer" ? "Multi-day guided expedition" : "Winter adventures"}</p>
            {tripSeason === "summer" && <p>Vehicle: {expeditionStyle === "tagAlong" ? "Bring your own rig" : expeditionStyle === "rideAlong" ? "Ride with guide" : "Drive an AOE Jeep"}</p>}
          </div>
        </section>
        <section className="rounded-3xl border border-white/10 bg-neutral-900 p-6">
          <h2 className="text-2xl font-bold">Experiences & Services</h2>
          {experiencePriceItems.length === 0 ? <p className="mt-4 text-neutral-400">No additional experiences selected.</p> : (
            <div className="mt-4 space-y-3">
              {experiencePriceItems.map(item => (
                <div key={item.id} className="flex justify-between gap-4 border-b border-white/10 pb-3 text-sm">
                  <span>{item.name}<span className="block text-neutral-400">{item.label}</span></span>
                  <strong>{item.price > 0 ? `$${item.price.toLocaleString()}` : item.label.startsWith("Included") ? "Included" : "Quote required"}</strong>
                </div>
              ))}
            </div>
          )}
          {tripSeason === "summer" && <p className="mt-4 text-sm text-neutral-300">Expedition guiding and standard AOE lodging/camping are included with the full AOE Jeep expedition; tag-along lodging is not included.</p>}
          {tripSeason === "winter" && (
  <div className="mt-4 space-y-2 text-sm text-neutral-300">

    {winterBaseTotal > 0 && (
      <p>
        AOE Winter Expedition: {winterExpeditionDays} day(s) ×
        ($600 first guest + $300 per additional guest)
        = ${winterBaseTotal.toLocaleString()}
      </p>
    )}

    {winterBaseTotal > 0 && (
      <p>
        Jeep use, Airbnb lodging, and transportation are included
        in your winter expedition rate.
      </p>
    )}

    {transportationCharge > 0 && (
      <>
        <p>
          Round-Trip Partner Experience Transportation:
          ${transportationCharge.toLocaleString()}
        </p>

        <p className="text-xs text-neutral-400">
          Includes pickup, transportation to the partner experience,
          and return transportation. This $250 fee applies only to
          standalone partner excursions. It does not apply to
          Alaska Off-Road Expedition experiences, including Knik
          Glacier trips, or to multi-day expeditions.
        </p>
      </>
    )}

  </div>
)}
          <p className="mt-4 text-sm text-neutral-400">Partner activities are requested and confirmed with the individual providers. AOE will coordinate dates, driving time and logistics.</p>
        </section>
        <section className="rounded-3xl border border-orange-400/30 bg-orange-500/10 p-6">
          <h2 className="text-xl font-bold">Estimated Trip Cost</h2>
          <div className="mt-3 text-3xl font-extrabold text-orange-300">${totalTripEstimate.toLocaleString()}</div>
          <p className="mt-2 text-sm text-neutral-300">Estimated payment due now: ${estimatedDeposit.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
          <p className="mt-2 text-xs text-neutral-400">Quote includes the 5% partner markup and any extended-stay savings. Partner activities are subject to confirmation; a lower final price reduces the remaining balance.</p>
        </section>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-neutral-950/95 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <button type="button" onClick={onBack} className={secondaryButton}>← Back</button>
          <button type="button" onClick={onContinue} className={primaryButton}>Continue to Guest Details →</button>
        </div>
      </div>
    </main>
  );
}

/* =====================================================
   STEP 5 — GUEST INFORMATION
   Checkout held pending API and webhook verification.
===================================================== */
function StepGuestReview({arrivalDate, departureDate, guestCount, tripSeason,
  expeditionStyle, experiencePriceItems, totalTripEstimate, estimatedDeposit,
  estimatedBalance, lodgingCharge, selectedAirbnbNights,
  jeepRentalTotal, billableJeepRentalDays, winterExpeditionDays, winterBaseTotal,
  aoeExtendedStayDiscount, transportationCharge, guestInfo, setGuestInfo, onBack,
  selectedExperiences, experienceParticipants, driverCount, customerRigs}) {
  const [checkoutLoading,setCheckoutLoading] = useState(false);
  const [checkoutError,setCheckoutError] = useState("");
  async function handleCheckout() {
    setCheckoutError("");
    if (!contactValid) {
      setCheckoutError(`Missing guest information: ${missingGuestFields.join("; ")}`); return;
    }
    setCheckoutLoading(true);
    try {
      const response = await fetch("/api/create-checkout-session",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({bookingType:"unified",booking:{arrivalDate,departureDate,
          guestCount,expeditionStyle,driverCount,customerRigs,
          selectedExperiences,experienceParticipants,guestInfo}})
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Checkout could not be started.");
      if (!data.url) throw new Error("Missing Stripe checkout URL.");
      window.location.assign(data.url);
    } catch(error) { setCheckoutError(error.message || "Unable to start checkout.");setCheckoutLoading(false); }
  }
  const fieldStyle = "mt-2 w-full rounded-xl border border-white/20 bg-neutral-800 px-4 py-3 text-white outline-none focus:border-orange-400";
  const updateField = (field, value) => setGuestInfo(current => ({...current, [field]: value}));
  const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
  const extraGuests = Array.from({ length: Math.max(0, guestCount - 1) }, (_, i) => guestInfo.additionalGuests?.[i] || {});
  const setExtraGuest = (index, field, value) => setGuestInfo(current => {
    const additionalGuests = [...(current.additionalGuests || [])];
    additionalGuests[index] = { ...(additionalGuests[index] || {}), [field]: value };
    return { ...current, additionalGuests };
  });
  const missingGuestFields = [
    ...(!guestInfo.name?.trim() ? ["Primary guest: full name"] : []),
    ...(!validEmail(guestInfo.email) ? ["Primary guest: valid email address"] : []),
    ...(!guestInfo.phone?.trim() ? ["Primary guest: phone number"] : []),
    ...(!guestInfo.address?.trim() ? ["Primary guest: mailing address"] : []),
    ...(!guestInfo.shirtSize ? ["Primary guest: shirt size"] : []),
    ...extraGuests.flatMap((g, index) => [
      ...(!g.name?.trim() ? [`Additional guest ${index + 2}: full name`] : []),
      ...(!validEmail(g.email) ? [`Additional guest ${index + 2}: valid email address`] : []),
      ...(!g.phone?.trim() ? [`Additional guest ${index + 2}: phone number`] : []),
      ...(!g.shirtSize ? [`Additional guest ${index + 2}: shirt size`] : []),
    ]),
  ];
  const contactValid = missingGuestFields.length === 0;
  return (
    <main className="w-full min-w-0 px-4 pb-32 pt-10">
      <div className="mb-8 text-center">
        <div className="text-sm font-bold uppercase tracking-widest text-orange-400">Step 5 — Guest Details & Reservation</div>
        <h1 className="mt-3 text-4xl font-extrabold">Ready for Alaska?</h1>
        <p className="mt-3 text-neutral-300">Enter your contact information. Review your quoted price and reserve with a secure payment. Partner dates are confirmed after reservation.</p>
      </div>
      <div className="space-y-6">
        <section className="rounded-3xl border border-white/10 bg-neutral-900 p-6">
          <h2 className="text-2xl font-bold">Primary Guest</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-semibold">Full name<input type="text" autoComplete="name" value={guestInfo.name} onChange={e=>updateField("name",e.target.value)} className={fieldStyle}/></label>
            <label className="text-sm font-semibold">Email address<input type="email" autoComplete="email" value={guestInfo.email} onChange={e=>updateField("email",e.target.value)} className={fieldStyle}/></label>
            <label className="text-sm font-semibold">Phone number<input type="tel" autoComplete="tel" value={guestInfo.phone} onChange={e=>updateField("phone",e.target.value)} className={fieldStyle}/></label>
            <label className="text-sm font-semibold">Shirt size<select value={guestInfo.shirtSize || ""} onChange={e=>updateField("shirtSize",e.target.value)} className={fieldStyle}><option value="">Select shirt size</option>{["XS","S","M","L","XL","2XL","3XL","4XL"].map(x=><option key={x} value={x}>{x}</option>)}</select></label>
            <label className="text-sm font-semibold sm:col-span-2">Mailing address<input type="text" autoComplete="street-address" value={guestInfo.address || ""} onChange={e=>updateField("address",e.target.value)} className={fieldStyle} placeholder="Street, city, state, ZIP"/></label>
          </div>
        </section>
        {extraGuests.map((guest, index) => (
          <section key={index} className="rounded-3xl border border-white/10 bg-neutral-900 p-6">
            <h2 className="text-2xl font-bold">Additional Guest {index + 2}</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-semibold">Full name<input type="text" value={guest.name || ""} onChange={e=>setExtraGuest(index,"name",e.target.value)} className={fieldStyle}/></label>
              <label className="text-sm font-semibold">Email address<input type="email" value={guest.email || ""} onChange={e=>setExtraGuest(index,"email",e.target.value)} className={fieldStyle}/></label>
              <label className="text-sm font-semibold">Phone number<input type="tel" value={guest.phone || ""} onChange={e=>setExtraGuest(index,"phone",e.target.value)} className={fieldStyle}/></label>
              <label className="text-sm font-semibold">Shirt size<select value={guest.shirtSize || ""} onChange={e=>setExtraGuest(index,"shirtSize",e.target.value)} className={fieldStyle}><option value="">Select shirt size</option>{["XS","S","M","L","XL","2XL","3XL","4XL"].map(x=><option key={x} value={x}>{x}</option>)}</select></label>
            </div>
          </section>
        ))}
        <section className="rounded-3xl border border-white/10 bg-neutral-900 p-6">
          <label className="text-lg font-bold">Please leave any comments to make your expedition perfect.<textarea rows={4} value={guestInfo.notes || ""} onChange={e=>updateField("notes",e.target.value)} className={fieldStyle}/></label>
        </section>
        <section className="rounded-3xl border border-orange-400/30 bg-orange-500/10 p-6">
          <h2 className="text-xl font-bold">Reservation Summary</h2>
          <p className="mt-3 text-sm text-neutral-300">{formatDate(arrivalDate)} – {formatDate(departureDate)} · {guestCount} guest(s) · {tripSeason === "summer" ? "Summer expedition" : "Winter adventure"}</p>
          <div className="mt-4 space-y-2">{experiencePriceItems.map(item=><div key={item.id} className="flex justify-between gap-3 text-sm"><span>{item.name}</span><span>{item.price > 0 ? `$${item.price.toLocaleString()}` : item.label.startsWith("Included") ? "Included" : "Quote required"}</span></div>)}</div>
          {tripSeason === "winter" && (
            <div className="mt-4 space-y-2 text-sm text-neutral-300">
              {winterBaseTotal > 0 && <p>AOE winter: {winterExpeditionDays} day(s) × ($600 first guest + $300 per additional guest) = ${winterBaseTotal.toLocaleString()}</p>}
              <p>AOE Jeep + Airbnb lodging: included with multi-day winter expedition</p>
            </div>
          )}
          <div className="mt-4 border-t border-white/10 pt-4 text-2xl font-bold text-orange-300">Estimated total: ${totalTripEstimate.toLocaleString()}</div>
          <p className="mt-2 text-sm text-neutral-300">Estimated payment due now: ${estimatedDeposit.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
          <p className="mt-1 text-sm text-neutral-400">Estimated balance: ${estimatedBalance.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
        </section>
        <section className="rounded-3xl border border-amber-400/30 bg-amber-500/10 p-6">
          <h2 className="font-bold text-amber-300">Secure Reservation Checkout</h2>
          <p className="mt-2 text-sm text-neutral-300">Your final total will be recalculated by our server before Stripe checkout. Availability and partner schedules are subject to confirmation.</p>
          <button type="button" onClick={handleCheckout} disabled={checkoutLoading} className={`${primaryButton} mt-5 w-full`}>
            {checkoutLoading ? "Opening Secure Checkout..." : "Reserve Your Adventure →"}
          </button>
          {checkoutError && <p role="alert" className="mt-3 text-sm text-red-300">{checkoutError}</p>}
          {!contactValid && <div className="mt-3 rounded-xl border border-amber-400/30 bg-amber-500/10 p-3 text-sm text-amber-200" role="status">
            <p className="font-semibold">Complete these fields to continue:</p>
            <ul className="mt-2 list-inside list-disc">{missingGuestFields.map(field => <li key={field}>{field}</li>)}</ul>
          </div>}
        </section>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-neutral-950/95 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <button type="button" onClick={onBack} className={secondaryButton}>← Back</button>
          <span className="text-sm font-semibold text-orange-300">Step 5 of 5</span>
        </div>
      </div>
    </main>
  );
}
