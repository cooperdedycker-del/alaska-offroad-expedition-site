import Stripe from "stripe";
import { google } from "googleapis";

const ALASKA_TIME_ZONE = "America/Anchorage";

const PACKAGE_CONFIG = {
  "winter-knik-glacier": {
    name: "Winter Knik Glacier Experience",
    driverPrice: 695,
    passengerPrice: 395,
    maxDrivers: 2,
    maxPassengers: 11,
    availableMonths: [11, 12, 1, 2],
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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
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
        drivers *
        packageConfig.driverPrice;

      const passengerTotal =
        passengers *
        packageConfig.passengerPrice;

      totalEstimate =
        driverTotal + passengerTotal;

      amountDue =
        totalEstimate;

      balanceDue = 0;

      productName =
        packageConfig.name;
    }

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

        success_url:
          `${siteUrl}/reservation-confirmed?session_id={CHECKOUT_SESSION_ID}`,

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