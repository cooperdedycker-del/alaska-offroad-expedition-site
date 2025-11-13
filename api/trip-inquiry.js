// /api/trip-inquiry.js
import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const raw = req.body || {};

    // TripBuilder sends: { form, pricing }
    const form = raw.form || raw;
    const pricing = raw.pricing || form.pricing || {};

    // ----- CONTACT -----
    const contact = {
      name:
        form?.contact?.name ??
        form?.name ??
        raw?.contact?.name ??
        raw?.name ??
        "",
      email:
        form?.contact?.email ??
        form?.email ??
        raw?.contact?.email ??
        raw?.email ??
        "",
      phone:
        form?.contact?.phone ??
        form?.phone ??
        raw?.contact?.phone ??
        raw?.phone ??
        "",
    };

    // ----- TRIP DETAILS (aligned with TripBuilder state) -----
    // TripBuilder form has: start, end, party, rig, guideDay, overnight, addOns.lodgeNights
    let nights = 0;
    if (form.start && form.end) {
      const s = new Date(form.start);
      const e = new Date(form.end);
      nights = Math.max(
        0,
        Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24))
      );
    }

    const trip = {
      start: form.start || "",
      end: form.end || "",
      nights,
      party: form.party || "",
      rig: form.rig || "",
      guideDay: !!form.guideDay,
      overnight: form.overnight || 0,
      lodgeNights: form?.addOns?.lodgeNights || 0,
    };

    // ----- ADD-ONS LIST -----
    const addOns = form.addOns || {};
    const selectedAddOns = Object.entries(addOns)
      .filter(([key, value]) => typeof value === "boolean" && value)
      .map(([key]) => key);

    const addOnLabels = {
      glacier: "Glacier Hike",
      helicopter: "Helicopter Flight",
      bushplane: "Bush Plane Segment",
      zipline: "Zipline",
      mine: "Historic Mine/Glacier Tunnel Tour",
    };

    const addOnLines = selectedAddOns.map(
      (key) => `• ${addOnLabels[key] || key}`
    );

    if (trip.lodgeNights > 0) {
      addOnLines.push(`• Lodge nights × ${trip.lodgeNights}`);
    }

    const addOnHtml =
      addOnLines.length > 0
        ? addOnLines.join("<br/>")
        : "None selected";

    const addOnText =
      addOnLines.length > 0
        ? addOnLines.join("\n")
        : "None selected";

    // ----- PRICING (aligned with TripBuilder "price") -----
    const price = {
      rentalTotal: pricing?.rentalTotal ?? "",
      guideTotal: pricing?.guideTotal ?? "",
      overnightAdd: pricing?.overnightAdd ?? "",
      addOnSum: pricing?.addOnSum ?? "",
      lodgeCost: pricing?.lodgeCost ?? "",
      total: pricing?.total ?? "",
    };

    // Format helpers
    const money = (v) =>
      typeof v === "number" && !Number.isNaN(v)
        ? `$${v.toLocaleString()}`
        : "N/A";

    // ----- STYLED HTML EMAIL -----
    const subjectCustomer = "Alaska Offroad Expedition itinerary";
    const subjectInternal = "New Trip Inquiry from Website";

    const from =
      "Alaska Offroad Expedition <cooper@alaskaoffroadexpedition.com>";

    const baseHtml = `
      <div style="
        max-width: 640px;
        margin: 0 auto;
        background: #020617;
        color: #e5e7eb;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        padding: 24px;
        border-radius: 16px;
        border: 1px solid rgba(148,163,184,0.35);
      ">
        <div style="border-bottom: 1px solid rgba(148,163,184,0.35); padding-bottom: 16px; margin-bottom: 20px;">
          <h1 style="font-size: 20px; margin: 0 0 4px 0;">Alaska Offroad Expedition</h1>
          <p style="margin: 0; font-size: 13px; color: #9ca3af;">
            Where roads end, adventure begins.
          </p>
        </div>

        <h2 style="font-size: 16px; margin: 0 0 8px 0;">Contact Info</h2>
        <div style="
          background: rgba(15,23,42,0.9);
          border-radius: 12px;
          padding: 12px 14px;
          border: 1px solid rgba(148,163,184,0.35);
          margin-bottom: 16px;
          font-size: 13px;
        ">
          <div><strong>Name:</strong> ${contact.name || "N/A"}</div>
          <div><strong>Email:</strong> ${contact.email || "N/A"}</div>
          <div><strong>Phone:</strong> ${contact.phone || "N/A"}</div>
        </div>

        <h2 style="font-size: 16px; margin: 0 0 8px 0;">Trip Details</h2>
        <div style="
          background: radial-gradient(circle at top left, rgba(56,189,248,0.15), rgba(15,23,42,0.95));
          border-radius: 12px;
          padding: 12px 14px;
          border: 1px solid rgba(56,189,248,0.4);
          margin-bottom: 16px;
          font-size: 13px;
        ">
          <div><strong>Dates:</strong> ${trip.start || "N/A"} → ${
      trip.end || "N/A"
    }</div>
          <div><strong>Nights:</strong> ${
            typeof trip.nights === "number" ? trip.nights : "N/A"
          }</div>
          <div><strong>Party size:</strong> ${trip.party || "N/A"}</div>
          <div><strong>Rig:</strong> ${
            trip.rig ? trip.rig.replace("-", " ") : "N/A"
          }</div>
          <div><strong>Guided day:</strong> ${
            trip.guideDay ? "Yes" : "No"
          }</div>
          <div><strong>Overnights:</strong> ${
            typeof trip.overnight === "number" ? trip.overnight : "N/A"
          }</div>
          <div><strong>Lodge nights:</strong> ${
            typeof trip.lodgeNights === "number" ? trip.lodgeNights : "N/A"
          }</div>
        </div>

        <h2 style="font-size: 16px; margin: 0 0 8px 0;">Add-ons</h2>
        <div style="
          background: rgba(15,23,42,0.9);
          border-radius: 12px;
          padding: 12px 14px;
          border: 1px solid rgba(148,163,184,0.35);
          margin-bottom: 16px;
          font-size: 13px;
        ">
          ${addOnHtml}
        </div>

        <h2 style="font-size: 16px; margin: 0 0 8px 0;">Pricing (Estimate)</h2>
        <div style="
          background: rgba(15,23,42,0.9);
          border-radius: 12px;
          padding: 12px 14px;
          border: 1px solid rgba(148,163,184,0.35);
          margin-bottom: 16px;
          font-size: 13px;
        ">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tbody>
              <tr>
                <td style="padding: 2px 0;">Rental</td>
                <td style="padding: 2px 0; text-align: right;">${money(
                  price.rentalTotal
                )}</td>
              </tr>
              <tr>
                <td style="padding: 2px 0;">Guided day</td>
                <td style="padding: 2px 0; text-align: right;">${
                  price.guideTotal ? money(price.guideTotal) : "$0"
                }</td>
              </tr>
              <tr>
                <td style="padding: 2px 0;">Overnights</td>
                <td style="padding: 2px 0; text-align: right;">${
                  price.overnightAdd ? money(price.overnightAdd) : "$0"
                }</td>
              </tr>
              <tr>
                <td style="padding: 2px 0;">Add-ons</td>
                <td style="padding: 2px 0; text-align: right;">${
                  price.addOnSum ? money(price.addOnSum) : "$0"
                }</td>
              </tr>
              <tr>
                <td style="padding: 2px 0;">Lodge</td>
                <td style="padding: 2px 0; text-align: right;">${
                  price.lodgeCost ? money(price.lodgeCost) : "$0"
                }</td>
              </tr>
              <tr>
                <td colspan="2" style="padding-top: 6px;">
                  <hr style="border: none; border-top: 1px solid rgba(148,163,184,0.4);" />
                </td>
              </tr>
              <tr>
                <td style="padding: 4px 0; font-weight: 600;">Total (est.)</td>
                <td style="padding: 4px 0; text-align: right; font-weight: 600;">
                  ${money(price.total)}
                </td>
              </tr>
            </tbody>
          </table>
          <div style="margin-top: 4px; font-size: 11px; color: #9ca3af;">
            Final price confirmed after permits & vendor availability.
          </div>
        </div>

        <div style="font-size: 12px; color: #9ca3af; margin-top: 16px; border-top: 1px solid rgba(148,163,184,0.35); padding-top: 10px;">
          Questions? Call or text <strong>907-406-7901</strong><br/>
          Thank you for planning your Alaska adventure with us.
        </div>
      </div>
    `;

    const baseText = `
Alaska Offroad Expedition - Trip Inquiry

Contact Info
------------
Name: ${contact.name || "N/A"}
Email: ${contact.email || "N/A"}
Phone: ${contact.phone || "N/A"}

Trip Details
------------
Dates: ${trip.start || "N/A"} → ${trip.end || "N/A"}
Nights: ${
      typeof trip.nights === "number" ? trip.nights : "N/A"
    }
Party size: ${trip.party || "N/A"}
Rig: ${trip.rig || "N/A"}
Guided day: ${trip.guideDay ? "Yes" : "No"}
Overnights: ${
      typeof trip.overnight === "number" ? trip.overnight : "N/A"
    }
Lodge nights: ${
      typeof trip.lodgeNights === "number" ? trip.lodgeNights : "N/A"
    }

Add-ons
-------
${addOnText}

Pricing (Estimate)
------------------
Rental: ${money(price.rentalTotal)}
Guided day: ${price.guideTotal ? money(price.guideTotal) : "$0"}
Overnights: ${price.overnightAdd ? money(price.overnightAdd) : "$0"}
Add-ons: ${price.addOnSum ? money(price.addOnSum) : "$0"}
Lodge: ${price.lodgeCost ? money(price.lodgeCost) : "$0"}

Total (est.): ${money(price.total)}
Final price confirmed after permits & vendor availability.

Questions? Call or text 907-406-7901.
    `.trim();

    // ----- SEND EMAILS -----

    // 1) Internal email to you
    const internalResult = await resend.emails.send({
      from,
      to: "cooper@alaskaoffroadexpedition.com",
      subject: subjectInternal,
      html: baseHtml,
      text: baseText,
    });

    if (internalResult?.error) {
      console.error("RESEND internal trip-inquiry error:", internalResult.error);
      return res
        .status(500)
        .json({ ok: false, error: "Failed to send internal email." });
    }

    // 2) Customer confirmation (if we have email)
    let customerError = null;
    if (contact.email) {
      const customerResult = await resend.emails.send({
        from,
        to: contact.email,
        subject: subjectCustomer,
        html: baseHtml,
        text: baseText,
      });

      if (customerResult?.error) {
        customerError = customerResult.error;
        console.error("RESEND customer confirmation error:", customerError);
      }
    }

    return res.status(200).json({
      ok: true,
      customerEmailSent: !customerError,
    });
  } catch (err) {
    console.error("TRIP-INQUIRY API ERROR:", err);
    return res.status(500).json({ ok: false, error: "Internal Server Error" });
  }
}
