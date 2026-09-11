import Stripe from "stripe";
import { google } from "googleapis";
import { Resend } from "resend";
import crypto from "crypto";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ALASKA_TIME_ZONE = "America/Anchorage";

/*
 * Stripe requires the ORIGINAL raw request body
 * for webhook signature verification.
 */
async function buffer(readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(
      typeof chunk === "string"
        ? Buffer.from(chunk)
        : chunk
    );
  }

  return Buffer.concat(chunks);
}

function money(value) {
  const number = Number(value || 0);

  return `$${number.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function addOneDay(dateString) {
  const date = new Date(
    `${dateString}T00:00:00Z`
  );

  date.setUTCDate(
    date.getUTCDate() + 1
  );

  return date
    .toISOString()
    .slice(0, 10);
}

/*
 * Participants may have been split across several
 * Stripe metadata fields because of metadata limits.
 */
function getParticipantJson(metadata) {
  const chunks = [];

  for (let index = 1; index <= 20; index++) {
    const key =
      index === 1
        ? "participants"
        : `participants${index}`;

    if (metadata[key]) {
      chunks.push(metadata[key]);
    }
  }

  return chunks.join("");
}

function formatParticipants(metadata) {
  try {
    const raw =
      getParticipantJson(metadata);

    const participants =
      JSON.parse(raw || "[]");

    if (!participants.length) {
      return "No participant details provided.";
    }

    return participants
      .map((participant, index) => {
        return `${index + 1}. ${
          participant.name || "N/A"
        } — Age: ${
          participant.age || "N/A"
        } — Shirt: ${
          participant.shirtSize || "N/A"
        }`;
      })
      .join("\n");
  } catch (error) {
    console.error(
      "Participant formatting error:",
      error
    );

    return "Participant information could not be formatted.";
  }
}

function isPackageBooking(metadata) {
  return metadata.bookingType === "package";
}

/*
 * Create a deterministic Google Calendar event ID
 * from the Stripe Checkout Session ID.
 *
 * This prevents duplicate calendar events if Stripe
 * retries the webhook.
 */
function createCalendarEventId(sessionId) {
  const hash = crypto
    .createHash("sha256")
    .update(sessionId)
    .digest("hex")
    .slice(0, 40);

  return `aoe${hash}`;
}

/*
 * GOOGLE CALENDAR
 */
async function createCalendarReservation(
  metadata,
  session
) {
  const clientEmail =
    process.env.GOOGLE_CLIENT_EMAIL;

  const privateKey =
    process.env.GOOGLE_PRIVATE_KEY?.replace(
      /\\n/g,
      "\n"
    );

  const calendarId =
    process.env.GOOGLE_CALENDAR_ID;

  if (
    !clientEmail ||
    !privateKey ||
    !calendarId
  ) {
    throw new Error(
      "Missing Google Calendar environment variables."
    );
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,

    scopes: [
      "https://www.googleapis.com/auth/calendar",
    ],
  });

  await auth.authorize();

  const calendar = google.calendar({
    version: "v3",
    auth,
  });

  const packageBooking =
    isPackageBooking(metadata);

  const packageName =
    metadata.packageName ||
    "Alaska Offroad Expedition";

  const summary = packageBooking
    ? `PAID PACKAGE - ${packageName} - ${metadata.customerName}`
    : `PAID RESERVATION - ${metadata.customerName}`;

  /*
   * Package is one day.
   *
   * Trip Builder blocks every selected day,
   * including the final day.
   *
   * Google all-day event end dates are EXCLUSIVE,
   * hence addOneDay().
   */
  const calendarStart =
    metadata.tripStart;

  const calendarEnd =
    packageBooking
      ? addOneDay(metadata.tripStart)
      : addOneDay(metadata.tripEnd);

  const amountCharged =
    Number(session.amount_total || 0) / 100;

  const discountAmount =
    Number(
      session.total_details?.amount_discount || 0
    ) / 100;

  const packagePayment = packageBooking
    ? `
Package:
${packageName}

Payment:
Package Total: ${money(
        metadata.totalEstimate
      )}
Discount: ${money(discountAmount)}
Amount Paid: ${money(amountCharged)}
Balance Due: $0.00
`
    : `
Pricing:
Total Estimate: ${money(
        metadata.totalEstimate
      )}
Amount Paid Today: ${money(amountCharged)}
Remaining Balance: ${money(
        metadata.balanceDue
      )}
`;

  const description = `
Alaska Offroad Expedition Reservation

Booking Type:
${
  packageBooking
    ? "Ready-To-Book Package"
    : "Custom Trip Builder"
}

Customer:
${metadata.customerName}
${metadata.customerEmail}
${metadata.customerPhone || ""}

Trip:
${metadata.tripStart}${
    metadata.tripEnd &&
    metadata.tripEnd !== metadata.tripStart
      ? ` to ${metadata.tripEnd}`
      : ""
  }

Rig:
${metadata.rig || "Alaska Offroad Expedition"}

Drivers:
${metadata.drivers || "0"}

Passengers:
${metadata.passengers || "0"}

Total Guests:
${metadata.totalGuests || "0"}

Participants:
${formatParticipants(metadata)}

${
  !packageBooking
    ? `Lodging:
${metadata.lodgingPreference || ""}
${metadata.lodgingNotes || ""}

Excursions:
${metadata.selectedExcursions || "None selected"}

`
    : ""
}${packagePayment}

${
  packageBooking
    ? `Cancellation Policy:
Full refund if canceled before the day of the expedition.
Same-day cancellations receive a 50% refund.`
    : ""
}

Stripe Checkout Session:
${session.id}
  `.trim();

  const eventId =
    createCalendarEventId(session.id);

  try {
    await calendar.events.insert({
      calendarId,

      requestBody: {
        id: eventId,

        summary,

        description,

        start: {
          date: calendarStart,
        },

        end: {
          date: calendarEnd,
        },

        extendedProperties: {
          private: {
            stripeSessionId:
              session.id,

            bookingType:
              metadata.bookingType ||
              "trip-builder",
          },
        },
      },
    });

    console.log(
      `Calendar reservation created: ${eventId}`
    );
  } catch (error) {
    /*
     * If Stripe retries this webhook after the
     * calendar event was already created, Google
     * returns 409. That means we're already good.
     */
    if (
      error?.code === 409 ||
      error?.response?.status === 409
    ) {
      console.log(
        `Calendar reservation already exists: ${eventId}`
      );

      return;
    }

    throw error;
  }
}

/*
 * RESEND EMAIL HELPER
 *
 * Throws if Resend returns an error.
 */
async function sendEmailOrThrow(
  resend,
  payload,
  idempotencyKey
) {
  const result =
    await resend.emails.send(
      payload,
      {
        idempotencyKey,
      }
    );

  if (result?.error) {
    throw new Error(
      result.error.message ||
      "Resend email failed."
    );
  }

  return result;
}

/*
 * CONFIRMATION EMAILS
 */
async function sendReservationEmails(
  metadata,
  session
) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error(
      "Missing RESEND_API_KEY."
    );
  }

  const resend =
    new Resend(
      process.env.RESEND_API_KEY
    );

  const from =
    process.env.EMAIL_FROM ||
    "Alaska Offroad Expedition <noreply@alaskaoffroadexpedition.com>";

  const adminTo =
    process.env.SALES_INBOX_EMAIL ||
    "cooper@alaskaoffroadexpedition.com";

  const customerEmail =
    metadata.customerEmail ||
    session.customer_details?.email ||
    session.customer_email;

  if (!customerEmail) {
    throw new Error(
      "Reservation has no customer email address."
    );
  }

  const packageBooking =
    isPackageBooking(metadata);

  const packageName =
    metadata.packageName ||
    "Alaska Offroad Expedition";

  const amountCharged =
    Number(session.amount_total || 0) / 100;

  const discountAmount =
    Number(
      session.total_details?.amount_discount || 0
    ) / 100;

  const contactBlock = `
Questions or changes?

Email:
cooper@alaskaoffroadexpedition.com

Call or Text:
907-406-7901
  `.trim();

  /*
   * CUSTOMER EMAIL
   */
  const customerSubject =
    packageBooking
      ? `${packageName} Reservation Confirmed`
      : "Your Alaska Offroad Expedition Reservation Is Confirmed";

  const customerText =
    packageBooking
      ? `
Hi ${metadata.customerName},

Your ${packageName} reservation is confirmed.

EXPEDITION DATE
${metadata.tripStart}

GUESTS
Drivers: ${metadata.drivers || "0"}
Passengers: ${metadata.passengers || "0"}
Total Guests: ${metadata.totalGuests || "0"}

PARTICIPANTS
${formatParticipants(metadata)}

PAYMENT
Package Total: ${money(
          metadata.totalEstimate
        )}
Discount: ${money(discountAmount)}
Amount Paid: ${money(amountCharged)}
Balance Due: $0.00

Your expedition date is now reserved.

We'll follow up with your waiver, winter preparation information, meeting location, arrival time, and any additional details you need for your Knik Glacier experience.

CANCELLATION POLICY

Cancel before the day of your expedition and receive a full refund.

Same-day cancellations are eligible for a 50% refund.

${contactBlock}
      `.trim()
      : `
Hi ${metadata.customerName},

Your Alaska Offroad Expedition reservation is confirmed.

TRIP DATES
${metadata.tripStart} to ${metadata.tripEnd}

PARTICIPANTS
${formatParticipants(metadata)}

PAYMENT
Amount Paid Today: ${money(
          amountCharged
        )}

Estimated Remaining Balance:
${money(metadata.balanceDue)}

Selected Excursions:
${metadata.selectedExcursions || "None selected"}

Your dates are now reserved.

We'll follow up with your waiver, packing information, remaining balance details, and final itinerary planning.

${contactBlock}
      `.trim();

  /*
   * ADMIN EMAIL
   */
  const adminSubject =
    packageBooking
      ? `PAID PACKAGE - ${packageName} - ${metadata.customerName} - ${metadata.tripStart}`
      : `PAID RESERVATION - ${metadata.customerName} - ${metadata.tripStart}`;

  const adminText = `
NEW PAID ${
    packageBooking
      ? "PACKAGE RESERVATION"
      : "RESERVATION"
  }

Booking Type:
${
  packageBooking
    ? "Ready-To-Book Package"
    : "Custom Trip Builder"
}

${
  packageBooking
    ? `Package:
${packageName}

`
    : ""
}CUSTOMER

${metadata.customerName}
${customerEmail}
${metadata.customerPhone || ""}

TRIP

Start:
${metadata.tripStart}

End:
${metadata.tripEnd}

Rig:
${metadata.rig || ""}

Drivers:
${metadata.drivers || "0"}

Passengers:
${metadata.passengers || "0"}

Total Guests:
${metadata.totalGuests || "0"}

PARTICIPANTS

${formatParticipants(metadata)}

${
  !packageBooking
    ? `LODGING

${metadata.lodgingPreference || ""}
${metadata.lodgingNotes || ""}

EXCURSIONS

${metadata.selectedExcursions || "None selected"}

`
    : ""
}PAYMENT

Total:
${money(metadata.totalEstimate)}

Discount:
${money(discountAmount)}

Amount Paid:
${money(amountCharged)}

Balance Due:
${money(metadata.balanceDue)}

Stripe Session:
${session.id}

${contactBlock}
  `.trim();

  /*
   * Customer + admin are attempted independently.
   *
   * One failing does not prevent the other from
   * being attempted.
   */
  const emailResults =
    await Promise.allSettled([
      sendEmailOrThrow(
        resend,

        {
          from,
          to: customerEmail,

          reply_to:
            "cooper@alaskaoffroadexpedition.com",

          subject:
            customerSubject,

          text:
            customerText,
        },

        `aoe-customer-${session.id}`
      ),

      sendEmailOrThrow(
        resend,

        {
          from,
          to: adminTo,

          reply_to:
            customerEmail,

          subject:
            adminSubject,

          text:
            adminText,
        },

        `aoe-admin-${session.id}`
      ),
    ]);

  const customerResult =
    emailResults[0];

  const adminResult =
    emailResults[1];

  if (
    customerResult.status ===
    "rejected"
  ) {
    console.error(
      "Customer confirmation email failed:",
      customerResult.reason
    );
  } else {
    console.log(
      "Customer confirmation email sent."
    );
  }

  if (
    adminResult.status ===
    "rejected"
  ) {
    console.error(
      "Admin confirmation email failed:",
      adminResult.reason
    );
  } else {
    console.log(
      "Admin confirmation email sent."
    );
  }

  /*
   * If either email failed, throw AFTER BOTH were
   * attempted. Stripe will retry the webhook.
   */
  if (
    customerResult.status === "rejected" ||
    adminResult.status === "rejected"
  ) {
    throw new Error(
      "One or more reservation confirmation emails failed."
    );
  }
}

/*
 * WEBHOOK
 */
export default async function handler(
  req,
  res
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  const stripe =
    new Stripe(
      process.env.STRIPE_SECRET_KEY
    );

  const signature =
    req.headers["stripe-signature"];

  let event;

  /*
   * VERIFY STRIPE WEBHOOK SIGNATURE
   */
  try {
    const rawBody =
      await buffer(req);

    event =
      stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env
          .STRIPE_WEBHOOK_SECRET
      );
  } catch (error) {
    console.error(
      "Stripe webhook signature error:",
      error.message
    );

    return res.status(400).json({
      error:
        `Webhook signature verification failed: ${error.message}`,
    });
  }

  /*
   * We only process completed Checkout Sessions.
   */
  if (
    event.type !==
    "checkout.session.completed"
  ) {
    return res.status(200).json({
      received: true,
      ignored: true,
    });
  }

  const session =
    event.data.object;

  if (
    session.payment_status !==
    "paid"
  ) {
    return res.status(200).json({
      received: true,
      ignored:
        "Checkout session is not paid.",
    });
  }

  const metadata =
    session.metadata || {};

  /*
   * Validate metadata generated by BOTH:
   *
   * - Trip Builder
   * - Package booking system
   */
  if (
    !metadata.customerName ||
    !metadata.customerEmail ||
    !metadata.tripStart
  ) {
    console.error(
      "Stripe session missing reservation metadata:",
      metadata
    );

    return res.status(400).json({
      error:
        "Stripe session is missing reservation metadata.",
    });
  }

  /*
   * IMPORTANT:
   *
   * Calendar and email are independent.
   *
   * They BOTH get attempted even if one fails.
   */
  const results =
    await Promise.allSettled([
      sendReservationEmails(
        metadata,
        session
      ),

      createCalendarReservation(
        metadata,
        session
      ),
    ]);

  const emailResult =
    results[0];

  const calendarResult =
    results[1];

  if (
    emailResult.status ===
    "rejected"
  ) {
    console.error(
      "Reservation email processing failed:",
      emailResult.reason
    );
  }

  if (
    calendarResult.status ===
    "rejected"
  ) {
    console.error(
      "Calendar reservation failed:",
      calendarResult.reason
    );
  }

  /*
   * If EITHER failed, return 500.
   *
   * Stripe will retry the webhook.
   *
   * - Resend idempotency keys help prevent
   *   duplicate confirmation emails.
   *
   * - Deterministic Google Calendar IDs help
   *   prevent duplicate calendar reservations.
   */
  if (
    emailResult.status === "rejected" ||
    calendarResult.status === "rejected"
  ) {
    return res.status(500).json({
      error:
        "Reservation processing incomplete. Stripe should retry.",
      email:
        emailResult.status,
      calendar:
        calendarResult.status,
    });
  }

  return res.status(200).json({
    received: true,
    reservationProcessed: true,
  });
}