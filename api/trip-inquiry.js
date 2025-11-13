// pages/api/trip-inquiry.js
import { Resend } from "resend";

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { form = {}, pricing = {} } = req.body || {};

    // Normalize contact info so it works with old + new form shapes
    const contact = {
      name: form?.contact?.name ?? form?.name ?? "",
      email: form?.contact?.email ?? form?.email ?? "",
      phone: form?.contact?.phone ?? form?.phone ?? "",
    };

    if (!contact.name || !contact.email) {
      return res
        .status(400)
        .json({ ok: false, error: "Missing contact name or email" });
    }

    // Trip details (fallbacks so we don't crash if fields are missing)
    const trip = {
      startDate: form?.trip?.startDate ?? form?.startDate ?? "",
      endDate: form?.trip?.endDate ?? form?.endDate ?? "",
      guideDays: form?.trip?.guideDays ?? form?.guideDays ?? "",
      guests: form?.trip?.guests ?? form?.guests ?? "",
      notes: form?.trip?.notes ?? form?.notes ?? "",
      destination: form?.trip?.destination ?? form?.destination ?? "",
    };

    // Add-ons: support both pricing.selectedAddOns and form.addOns/addons
    let addOns = [];

    if (Array.isArray(pricing?.selectedAddOns)) {
      addOns = pricing.selectedAddOns;
    } else if (Array.isArray(form?.addOns)) {
      addOns = form.addOns;
    } else if (Array.isArray(form?.addons)) {
      addOns = form.addons;
    }

    const addOnList =
      addOns.length > 0 ? addOns.map((a) => `• ${a}`).join("<br/>") : "None selected";

    // Basic price summary if present
    const priceSummary = {
      basePrice: pricing?.basePrice ?? "",
      addOnTotal: pricing?.addOnTotal ?? "",
      totalPrice: pricing?.totalPrice ?? "",
    };

    // Subject + from address (your requested values)
    const subject = "Alaska Offroad Expedition itinerary";

    const from =
      'Alaska Offroad Expedition <cooper@alaskaoffroadexpedition.com>';

    // Send to you + the customer
    const to = [
      "cooper@alaskaoffroadexpedition.com",
      contact.email,
    ];

    const html = `
      <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height:1.5;">
        <h1>New Trip Inquiry</h1>
        <h2>Contact Info</h2>
        <p>
          <strong>Name:</strong> ${contact.name}<br/>
          <strong>Email:</strong> ${contact.email}<br/>
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
Name: ${contact.name}
Email: ${contact.email}
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
