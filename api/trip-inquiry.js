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

    // ----- NIGHTS -----
    let nights = 0;
    if (form.start && form.end) {
      const s = new Date(form.start);
      const e = new Date(form.end);
      nights = Math.max(
        0,
        Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24))
      );
    }

    // Day trip guard (end may be blank)
    const isDayTrip = ["knik-glacier-winter", "offroad-day-levels"].includes(
      form.packageId
    );
    if (isDayTrip) nights = 0;

    // ----- CAMP / LODGING -----
    const campNightsRaw = Number(form.campNights ?? 0);
    const campNights = Number.isFinite(campNightsRaw) ? campNightsRaw : 0;

    const lodgingOnly = !!form.lodgingOnly;

    const lodgingNights = lodgingOnly
      ? nights
      : Math.max(0, nights - Math.max(0, Math.min(nights, campNights)));

    // ----- PACKAGE NAME MAP -----
    const packageNameMap = {
      "ultimate-multiweek": "Ultimate Alaska Expedition (Multi-Week)",
      "guided-week": "7-Day Guided Expedition (All-In)",
      "remote-3day": "3-Day Remote Adventure",
      "overnight-2day": "Overnight Remote Camp (2-Day)",
      "knik-glacier-winter": "Knik Glacier Winter Day Tour (1-Day)",
      "offroad-day-levels": "1-Day Off-Road Experience (Choose Your Level)",
    };

    // ----- TRIP DETAILS (NEW MODEL) -----
    const trip = {
      packageId: form.packageId || "",
      packageName: packageNameMap[form.packageId] || form.packageId || "N/A",
      start: form.start || "",
      end: form.end || "",
      nights,
      drivers: Number(form.drivers ?? 1),
      passengers: Number(form.passengers ?? 0),
      dayLevel: form.dayLevel || "",
      rig: form.rig || "",
      expeditionType: form.expeditionType || "guided", // "guided" | "selfGuided"
      campNights,
      lodgingNights,
      lodgingOnly,
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
      mine: "Historic Mine / Glacier Tunnel Tour",
      dirtBikes: "Dirt Bike Rental Tour",
    };

    const addOnLines = selectedAddOns.map(
      (key) => `• ${addOnLabels[key] || key}`
    );

    const addOnHtml =
      addOnLines.length > 0 ? addOnLines.join("<br/>") : "None selected";

    const addOnText = addOnLines.length > 0 ? addOnLines.join("\n") : "None selected";

    // ----- PRICING (Estimate) -----
    // IMPORTANT POLICY: Self-guided is NOT discounted. Pricing does not change.
    const price = {
      packageBase: pricing?.packageBase ?? "",
      rentalTotal: pricing?.rentalTotal ?? "",
      guideTotal: pricing?.guideTotal ?? "",
      overnightAdd: pricing?.overnightAdd ?? "",
      addOnSum: pricing?.addOnSum ?? "",
      lodgeCost: pricing?.lodgeCost ?? "",
      total: pricing?.total ?? "",
      isDayTrip: pricing?.isDayTrip ?? isDayTrip,
    };

    const money = (v) =>
      typeof v === "number" && !Number.isNaN(v) ? `$${v.toLocaleString()}` : "N/A";

    // ----- FAQ / EXPECTATIONS / GEAR -----
    const faqUrl = "https://www.alaskaoffroadexpedition.com/#faq";

    const gearBring = [
      "Weather-appropriate layers (base layer, insulating layer, outer shell)",
      "Waterproof jacket and rain pants",
      "Sturdy footwear (hiking boots or trail shoes)",
      "Personal medications and essentials",
      "Sunglasses and sunscreen",
      "Small daypack",
      "Personal toiletries",
      "Phone/camera chargers and power cables",
    ];

    const gearProvide = [
      "Expedition-built off-road vehicle (rig selected)",
      "Navigation and communication equipment",
      "Recovery, safety, and emergency gear",
      "Camping equipment when camping is selected (camp system varies by package/season)",
      "Camp kitchen support and meals when applicable",
      "Route planning and logistics coordination",
      "Guide support for guided expeditions (and approved itineraries for returning self-guided guests)",
    ];

    const gearBringHtml = gearBring.map((x) => seeBulletHtml(x)).join("");
    const gearProvideHtml = gearProvide.map((x) => seeBulletHtml(x)).join("");

    function seeBulletHtml(text) {
      return `<div style="display:flex; gap:8px; margin: 2px 0;"><span style="color:#9ca3af;">•</span><span>${escapeHtml(
        text
      )}</span></div>`;
    }

    function escapeHtml(str) {
      return String(str || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    // ----- SUBJECTS -----
    const subjectCustomer = "We received your Alaska Offroad Expedition request";
    const subjectInternal = `New Trip Inquiry: ${trip.packageName} (${trip.start || "No date"}${
      trip.end ? ` → ${trip.end}` : ""
    })`;

    const from = "Alaska Offroad Expedition <cooper@alaskaoffroadexpedition.com>";

    // ----- INTERNAL EMAIL (OPS) -----
    const internalHtml = `
      <div style="
        max-width: 720px;
        margin: 0 auto;
        background: #020617;
        color: #e5e7eb;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        padding: 24px;
        border-radius: 16px;
        border: 1px solid rgba(148,163,184,0.35);
      ">
        <div style="border-bottom: 1px solid rgba(148,163,184,0.35); padding-bottom: 16px; margin-bottom: 20px;">
          <h1 style="font-size: 18px; margin: 0 0 4px 0;">New Trip Builder Submission</h1>
          <p style="margin: 0; font-size: 13px; color: #9ca3af;">
            Alaska Offroad Expedition – Internal Notification
          </p>
        </div>

        <h2 style="font-size: 15px; margin: 0 0 8px 0;">Contact</h2>
        <div style="background: rgba(15,23,42,0.9); border-radius: 12px; padding: 12px 14px; border: 1px solid rgba(148,163,184,0.35); margin-bottom: 16px; font-size: 13px;">
          <div><strong>Name:</strong> ${escapeHtml(contact.name || "N/A")}</div>
          <div><strong>Email:</strong> ${escapeHtml(contact.email || "N/A")}</div>
          <div><strong>Phone:</strong> ${escapeHtml(contact.phone || "N/A")}</div>
        </div>

        <h2 style="font-size: 15px; margin: 0 0 8px 0;">Trip Details</h2>
        <div style="background: radial-gradient(circle at top left, rgba(56,189,248,0.15), rgba(15,23,42,0.95));
          border-radius: 12px; padding: 12px 14px; border: 1px solid rgba(56,189,248,0.4); margin-bottom: 16px; font-size: 13px;">
          <div><strong>Package:</strong> ${escapeHtml(trip.packageName)}</div>
          <div><strong>Dates:</strong> ${escapeHtml(trip.start || "N/A")} ${trip.end ? `→ ${escapeHtml(trip.end)}` : ""}</div>
          <div><strong>Nights:</strong> ${typeof trip.nights === "number" ? trip.nights : "N/A"}</div>
          <div><strong>Drivers / Passengers:</strong> ${trip.drivers} / ${trip.passengers}</div>
          ${trip.packageId === "offroad-day-levels" ? `<div><strong>Difficulty level:</strong> ${escapeHtml(trip.dayLevel || "N/A")}</div>` : ""}
          <div><strong>Rig:</strong> ${escapeHtml(trip.rig ? trip.rig.replaceAll("-", " ") : "N/A")}</div>
          <div><strong>Expedition type:</strong> ${trip.expeditionType === "selfGuided" ? "Self-guided (returning guests only)" : "Guided"}</div>
          <div><strong>Camping nights:</strong> ${trip.campNights}</div>
          <div><strong>Lodging nights:</strong> ${trip.lodgingNights}</div>
          <div><strong>Lodging-only:</strong> ${trip.lodgingOnly ? "Yes" : "No"}</div>
        </div>

        <h2 style="font-size: 15px; margin: 0 0 8px 0;">Add-ons</h2>
        <div style="background: rgba(15,23,42,0.9); border-radius: 12px; padding: 12px 14px; border: 1px solid rgba(148,163,184,0.35); margin-bottom: 16px; font-size: 13px;">
          ${addOnHtml}
        </div>

        <h2 style="font-size: 15px; margin: 0 0 8px 0;">Pricing (Estimate)</h2>
        <div style="background: rgba(15,23,42,0.9); border-radius: 12px; padding: 12px 14px; border: 1px solid rgba(148,163,184,0.35); margin-bottom: 16px; font-size: 13px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tbody>
              <tr><td style="padding:2px 0;">Package Base</td><td style="padding:2px 0; text-align:right;">${money(price.packageBase)}</td></tr>
              <tr><td style="padding:2px 0;">Rental</td><td style="padding:2px 0; text-align:right;">${money(price.rentalTotal)}</td></tr>
              <tr><td style="padding:2px 0;">Add-ons</td><td style="padding:2px 0; text-align:right;">${price.addOnSum ? money(price.addOnSum) : "$0"}</td></tr>
              <tr><td colspan="2" style="padding-top:6px;"><hr style="border:none; border-top:1px solid rgba(148,163,184,0.4);" /></td></tr>
              <tr><td style="padding:4px 0; font-weight:600;">Total (est.)</td><td style="padding:4px 0; text-align:right; font-weight:600;">${money(price.total)}</td></tr>
            </tbody>
          </table>
          <div style="margin-top:4px; font-size: 11px; color:#9ca3af;">
            IMPORTANT: Self-guided is not discounted. Pricing does not change with guide selection.
          </div>
        </div>

        <div style="font-size: 12px; color: #9ca3af; margin-top: 16px; border-top: 1px solid rgba(148,163,184,0.35); padding-top: 10px;">
          Follow-up target: within 24–72 hours depending on complexity and partner availability.<br/>
          If self-guided is selected, verify the guest is a returning customer before approval.
        </div>
      </div>
    `;

    const internalText = `
New Trip Builder Submission (Internal)

CONTACT
Name: ${contact.name || "N/A"}
Email: ${contact.email || "N/A"}
Phone: ${contact.phone || "N/A"}

TRIP DETAILS
Package: ${trip.packageName}
Dates: ${trip.start || "N/A"}${trip.end ? ` → ${trip.end}` : ""}
Nights: ${typeof trip.nights === "number" ? trip.nights : "N/A"}
Drivers/Passengers: ${trip.drivers}/${trip.passengers}
${trip.packageId === "offroad-day-levels" ? `Difficulty: ${trip.dayLevel || "N/A"}\n` : ""}Rig: ${trip.rig || "N/A"}
Expedition type: ${trip.expeditionType === "selfGuided" ? "Self-guided (returning guests only)" : "Guided"}
Camping nights: ${trip.campNights}
Lodging nights: ${trip.lodgingNights}
Lodging-only: ${trip.lodgingOnly ? "Yes" : "No"}

ADD-ONS
${addOnText}

PRICING (EST.)
Package Base: ${money(price.packageBase)}
Rental: ${money(price.rentalTotal)}
Add-ons: ${price.addOnSum ? money(price.addOnSum) : "$0"}
Total (est.): ${money(price.total)}

NOTES
- Self-guided is NOT discounted. Pricing does not change.
- If self-guided selected, verify returning guest eligibility.
- Follow-up within 24–72 hours.
    `.trim();

    // ----- CUSTOMER EMAIL -----
    const customerHtml = `
      <div style="
        max-width: 720px;
        margin: 0 auto;
        background: #020617;
        color: #e5e7eb;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        padding: 24px;
        border-radius: 16px;
        border: 1px solid rgba(148,163,184,0.35);
      ">
        <div style="border-bottom: 1px solid rgba(148,163,184,0.35); padding-bottom: 16px; margin-bottom: 20px;">
          <h1 style="font-size: 18px; margin: 0 0 4px 0;">We received your request</h1>
          <p style="margin: 0; font-size: 13px; color: #9ca3af;">
            Alaska Offroad Expedition – Trip Builder Confirmation
          </p>
        </div>

        <p style="margin: 0 0 12px 0; font-size: 14px; color: #e5e7eb;">
          Hi ${escapeHtml(contact.name ? contact.name.split(" ")[0] : "there")},
        </p>

        <p style="margin: 0 0 14px 0; font-size: 13px; color: #d1d5db;">
          Thank you for submitting your Alaska Offroad Expedition request. We’re reviewing availability, route conditions,
          permits, lodging, and partner schedules to build your custom itinerary.
        </p>

        <h2 style="font-size: 15px; margin: 0 0 8px 0;">Your Trip Summary</h2>
        <div style="background: rgba(15,23,42,0.9); border-radius: 12px; padding: 12px 14px; border: 1px solid rgba(148,163,184,0.35); margin-bottom: 16px; font-size: 13px;">
          <div><strong>Package:</strong> ${escapeHtml(trip.packageName)}</div>
          <div><strong>Dates:</strong> ${escapeHtml(trip.start || "N/A")} ${trip.end ? `→ ${escapeHtml(trip.end)}` : ""}</div>
          <div><strong>Rig:</strong> ${escapeHtml(trip.rig ? trip.rig.replaceAll("-", " ") : "N/A")}</div>
          <div><strong>Expedition type:</strong> ${trip.expeditionType === "selfGuided" ? "Self-guided (returning guests only)" : "Guided"}</div>
          ${trip.nights > 0 ? `<div><strong>Camping nights:</strong> ${trip.campNights} &nbsp;&nbsp; <strong>Lodging nights:</strong> ${trip.lodgingNights}</div>` : ""}
          <div style="margin-top:8px;"><strong>Add-ons:</strong><br/>${addOnHtml}</div>
        </div>

        <h2 style="font-size: 15px; margin: 0 0 8px 0;">What to Expect Next</h2>
        <div style="background: radial-gradient(circle at top left, rgba(34,197,94,0.12), rgba(15,23,42,0.95));
          border-radius: 12px; padding: 12px 14px; border: 1px solid rgba(34,197,94,0.35); margin-bottom: 16px; font-size: 13px;">
          <div style="margin: 2px 0;">• We’ll review your requested dates, rig, and selected experiences</div>
          <div style="margin: 2px 0;">• We’ll confirm availability with lodging and excursion partners</div>
          <div style="margin: 2px 0;">• You’ll receive a follow-up email with your itinerary, final pricing confirmation, deposit link, and e-signature waiver</div>
          <div style="margin: 10px 0 0 0; font-size: 12px; color:#9ca3af;">
            Typical turnaround: 24–72 hours depending on trip complexity and partner availability.
          </div>
        </div>

        <h2 style="font-size: 15px; margin: 0 0 8px 0;">FAQ / Prep Info</h2>
        <div style="background: rgba(15,23,42,0.9); border-radius: 12px; padding: 12px 14px; border: 1px solid rgba(148,163,184,0.35); margin-bottom: 16px; font-size: 13px;">
          For trip details, weather, and what to expect on-route, review our FAQ here:<br/>
          <a href="${faqUrl}" style="color:#38bdf8; text-decoration: underline;" target="_blank" rel="noopener noreferrer">${faqUrl}</a>
        </div>

        <h2 style="font-size: 15px; margin: 0 0 8px 0;">Gear You Need to Bring</h2>
        <div style="background: rgba(15,23,42,0.9); border-radius: 12px; padding: 12px 14px; border: 1px solid rgba(148,163,184,0.35); margin-bottom: 16px; font-size: 13px;">
          ${gearBringHtml}
        </div>

        <h2 style="font-size: 15px; margin: 0 0 8px 0;">Gear We Provide</h2>
        <div style="background: rgba(15,23,42,0.9); border-radius: 12px; padding: 12px 14px; border: 1px solid rgba(148,163,184,0.35); margin-bottom: 16px; font-size: 13px;">
          ${gearProvideHtml}
        </div>

        <div style="font-size: 12px; color: #9ca3af; margin-top: 16px; border-top: 1px solid rgba(148,163,184,0.35); padding-top: 10px;">
          Questions? Call or text <strong>907-406-7901</strong><br/>
          Alaska Offroad Expedition — <a href="https://www.alaskaoffroadexpedition.com" style="color:#9ca3af;" target="_blank" rel="noopener noreferrer">alaskaoffroadexpedition.com</a>
        </div>
      </div>
    `;

    const customerText = `
Hi ${contact.name ? contact.name.split(" ")[0] : "there"},

Thank you for submitting your Alaska Offroad Expedition request.

YOUR TRIP SUMMARY
Package: ${trip.packageName}
Dates: ${trip.start || "N/A"}${trip.end ? ` → ${trip.end}` : ""}
Rig: ${trip.rig || "N/A"}
Expedition type: ${trip.expeditionType === "selfGuided" ? "Self-guided (returning guests only)" : "Guided"}
${trip.nights > 0 ? `Camping nights: ${trip.campNights} | Lodging nights: ${trip.lodgingNights}\n` : ""}

Add-ons:
${addOnText}

WHAT TO EXPECT NEXT
- We’ll review your requested dates, rig, and selected experiences
- We’ll confirm availability with lodging and excursion partners
- You’ll receive a follow-up email with your itinerary, final pricing confirmation, deposit link, and e-signature waiver
Typical turnaround: 24–72 hours depending on trip complexity and partner availability.

FAQ / PREP INFO
${faqUrl}

GEAR YOU NEED TO BRING
${gearBring.map((x) => `- ${x}`).join("\n")}

GEAR WE PROVIDE
${gearProvide.map((x) => `- ${x}`).join("\n")}

Questions? Call or text 907-406-7901
    `.trim();

    // ----- SEND EMAILS -----

    // 1) Internal email to you
    const internalResult = await resend.emails.send({
      from,
      to: "cooper@alaskaoffroadexpedition.com",
      subject: subjectInternal,
      html: internalHtml,
      text: internalText,
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
        html: customerHtml,
        text: customerText,
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
