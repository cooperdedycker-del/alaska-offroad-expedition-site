import Stripe from "stripe";
import { google } from "googleapis";
import { Resend } from "resend";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

function money(value) {
  const n = Number(value || 0);
  return `$${n.toLocaleString()}`;
}

async function createCalendarReservation(metadata) {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (!clientEmail || !privateKey || !calendarId) {
    throw new Error("Missing Google Calendar env variables.");
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  await auth.authorize();

  const calendar = google.calendar({ version: "v3", auth });

  const startDate = metadata.tripStart;
  const endDate = metadata.tripEnd;

  await calendar.events.insert({
    calendarId,
    requestBody: {
      summary: `PAID Reservation - ${metadata.customerName}`,
      description: `
Alaska Offroad Expedition Paid Reservation

Customer:
${metadata.customerName}
${metadata.customerEmail}
${metadata.customerPhone || ""}

Trip:
${metadata.tripStart} to ${metadata.tripEnd}
Rig: ${metadata.rig}
Drivers: ${metadata.drivers}
Passengers: ${metadata.passengers}
Total Guests: ${metadata.totalGuests}

Lodging:
${metadata.lodgingPreference}
${metadata.lodgingNotes || ""}

Excursions:
${metadata.selectedExcursions || "None selected"}

Pricing:
Total Estimate: ${money(metadata.totalEstimate)}
Deposit Paid: ${money(metadata.depositPaid)}
Balance Due: ${money(metadata.balanceDue)}

Stripe payment confirmed.
      `.trim(),
      start: {
        date: startDate,
      },
      end: {
        date: endDate,
      },
    },
  });
}

async function sendReservationEmails(metadata) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const from =
    process.env.EMAIL_FROM ||
    "Alaska Offroad Expedition <bookings@alaskaoffroadexpedition.com>";

  const adminTo =
    process.env.SALES_INBOX_EMAIL || "cooper@alaskaoffroadexpedition.com";

  const subjectAdmin = `PAID Reservation - ${metadata.customerName} - ${metadata.tripStart}`;
  const subjectCustomer = "Your Alaska Offroad Expedition reservation is confirmed";

  const text = `
Alaska Offroad Expedition Reservation Confirmed

Customer:
${metadata.customerName}
${metadata.customerEmail}
${metadata.customerPhone || ""}

Trip:
${metadata.tripStart} to ${metadata.tripEnd}
Rig: ${metadata.rig}
Drivers: ${metadata.drivers}
Passengers: ${metadata.passengers}
Total Guests: ${metadata.totalGuests}

Lodging:
${metadata.lodgingPreference}
${metadata.lodgingNotes || ""}

Excursions:
${metadata.selectedExcursions || "None selected"}

Pricing:
Total Estimate: ${money(metadata.totalEstimate)}
Deposit Paid: ${money(metadata.depositPaid)}
Balance Due: ${money(metadata.balanceDue)}

Your dates are now reserved.
  `.trim();

  await Promise.all([
    resend.emails.send({
      from,
      to: adminTo,
      reply_to: metadata.customerEmail,
      subject: subjectAdmin,
      text,
    }),

    resend.emails.send({
      from,
      to: metadata.customerEmail,
      subject: subjectCustomer,
      text: `
Hi ${metadata.customerName},

Your Alaska Offroad Expedition reservation is confirmed.

Trip Dates:
${metadata.tripStart} to ${metadata.tripEnd}

Deposit Paid:
${money(metadata.depositPaid)}

Estimated Remaining Balance:
${money(metadata.balanceDue)}

Selected Excursions:
${metadata.selectedExcursions || "None selected"}

Your dates are now reserved. We’ll follow up with next steps, waiver, packing details, and final itinerary planning.

Alaska Offroad Expedition
907-406-7901
      `.trim(),
    }),
  ]);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    const rawBody = await buffer(req);

    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook signature error:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      if (session.payment_status === "paid") {
        const metadata = session.metadata || {};

        await createCalendarReservation(metadata);
        await sendReservationEmails(metadata);
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Stripe webhook processing error:", error);
    return res.status(500).json({
      error: error.message || "Webhook processing failed",
    });
  }
}