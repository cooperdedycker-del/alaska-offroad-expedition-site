// /api/trip-inquiry.js
import { Resend } from "resend";

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Be very flexible with shapes from the frontend
    const raw = req.body || {};

    // If there's a .form, use it, otherwise treat the whole body as "form"
    const form = raw.form || raw;

    // Pricing can be at body.pricing or form.pricing
    const pricing = raw.pricing || form.pricing || {};

    // Normalize contact info from multiple possible shapes
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

    // Log to Vercel if we didn't get expected contact info (for debugging, but don't break)
    if (!contact.name && !contact.email) {
      console.warn("Trip inquiry missing contact info. raw body:", raw);
    }

    // Trip details from several possible locations
    const trip = {
      startDate:
        form?.trip?.startDate ??
        form?.startDate ??
        raw?.trip?.startDate ??
        "",
      endDate:
        form?.trip?.endDate ??
        form?.endDate ??
        raw?.trip?.endDate ??
        "",
      guideDays:
        form?.trip?.guideDays ??
        form?.guideDays ??
        raw?.trip?.guideDays ??
        "",
      guests:
        form?.trip?.guests ??
        form?.guests ??
        raw?.trip?.guests ??
        "",
      notes:
        form?.trip?.notes ??
        form?.notes ??
        raw?.trip?.notes ??
        "",
      destination:
        form?.trip?.destination ??
        form?.destination ??
        raw?.trip?.destination ??
        "",
    };

    // Add-ons: support multiple possible shapes
    let addOns = [];

    if (Array.isArray(pricing?.selectedAddOns)) {
      addOns = pricing.selectedAddOns;
    } else if (Array.isArray(form?.addOns)) {
      addOns = form.addOns;
    } else if (Array.isArray(form?.addons)) {
      addOns = form.addons;
    } else if (Array.isArray(raw?.addOns)) {
      addOns = raw.addOns;
    } else if (Array.isArray(raw?.addons)) {
      addOns = raw.addons;
    }

    const addOnList =
      addOns.length > 0
        ? addOns.map((a) => `• ${a}`).join("<br/>")
        : "None selected";

    const priceSummary = {
      basePrice:
        pricing?.basePrice ??
        form?.basePrice ??
        raw?.basePrice ??
        "",
      addOnTotal:
        pricing?.addOnTotal ??
        form?.addOnTotal ??
        raw?.addOnTotal ??
        "",
      totalPrice:
        pricing?.totalPrice ??
        form?.totalPrice ??
        raw?.totalPrice ??
        "",
    };

    const subject = "Alaska Offroad Expedition itinerary";

    const from =
      "Alaska Offroad Expedition <cooper@alaskaoffroadexpedition.com>";

    // Always send at least to YOU; include customer if we have their email
    const to = ["cooper@alaskaoffroadexpedition.com"];
    if (contact.email) {
      to.push(contact.email);
    }

    const html = `
      <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height:1.5;">
        <h1>New Trip Inquiry</h1>
        <h2>Contact Info</h2>
        <p>
          <strong>Name:</strong> ${contact.name || "N/A"}<br/>
          <strong>Email:</strong> ${contact.email || "N/A"}<br/>
          <strong>Phone:</strong> ${contact.phone || "N/A"}
        </p>

        <h2>Trip Details</h2>
        <p>
          <strong>Destination:</strong> ${trip.destination || "N/A"}<br/>
          <strong>Start Date:</strong> ${trip.startDate || "N/A"}<br/>
          <strong>End Date:</strong> ${trip.endDate || "N/A"}<br/>
          <strong>Guide Days:</strong> ${trip.guideDays || "N/A"}<br/>
          <strong>Guests:</strong> ${trip.guests || "N/A"}
        </p>

        <h2>Add-ons</h2>
        <p>${addOnList}</p>

        <h2>Pricing Summary</h2>
        <p>
          <strong>Base Price:</strong> ${priceSummary.basePrice || "N/A"}<br/>
          <strong>Add-on Total:</strong> ${priceSummary.addOnTotal || "N/A"}<br/>
          <strong>Total Price:</strong> ${priceSummary.totalPrice || "N/A"}
        </p>

        <h2>Notes</h2>
        <p>${trip.notes || "No additional notes provided."}</p>

        <hr/>
        <p>Phone: 907-406-7901</p>
      </div>
    `;

    const text = `
New Trip Inquiry

Contact Info
------------
Name: ${contact.name || "N/A"}
Email: ${contact.email || "N/A"}
Phone: ${contact.phone || "N/A"}

Trip Details
------------
Destination: ${trip.destination || "N/A"}
Start Date: ${trip.startDate || "N/A"}
End Date: ${trip.endDate || "N/A"}
Guide Days: ${trip.guideDays || "N/A"}
Guests: ${trip.guests || "N/A"}

Add-ons
-------
${
  addOns.length > 0
    ? addOns.map((a) => `- ${a}`).join("\n")
    : "None selected"
}

Pricing Summary
---------------
Base Price: ${priceSummary.basePrice || "N/A"}
Add-on Total: ${priceSummary.addOnTotal || "N/A"}
Total Price: ${priceSummary.totalPrice || "N/A"}

Notes
-----
${trip.notes || "No additional notes provided."}

Phone: 907-406-7901
    `.trim();

    const { error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
    });

    if (error) {
      console.error("RESEND trip-inquiry error:", error);
      return res
        .status(500)
        .json({ ok: false, error: "Failed to send email." });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("TRIP-INQUIRY API ERROR:", err);
    return res.status(500).json({ ok: false, error: "Internal Server Error" });
  }
}
