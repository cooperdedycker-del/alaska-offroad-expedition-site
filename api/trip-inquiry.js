// /api/trip-inquiry.js
import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { form = {}, pricing = {} } = req.body || {};

    // Normalize shape (handles flat and nested contact fields)
    const contact = {
      name: form?.contact?.name ?? form?.name ?? "",
      email: form?.contact?.email ?? form?.email ?? "",
      phone: form?.contact?.phone ?? form?.phone ?? "",
    };

    // Optional fields
    const start = form?.start || "";
    const end = form?.end || "";
    const party = form?.party ?? "";
    const rig = form?.rig || "";
    const addOns = form?.addOns || {};
    const guideDay = !!form?.guideDay;
    const overnight = form?.overnight ?? 0;

    const subject = `AOE Trip Inquiry — ${contact.name || "No Name"} — ${start || "?"} → ${end || "?"}`;

    // ---------- ADMIN EMAIL (full details restored) ----------
    const adminHtml = `
  <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color:#222;">
    <h2 style="margin-bottom:8px;">Alaska Offroad Expedition — Trip Inquiry</h2>
    <table style="border-collapse:collapse;width:100%;max-width:600px;">
      <tr><td style="padding:4px 8px;"><strong>Name:</strong></td><td>${escapeHtml(contact.name || "N/A")}</td></tr>
      <tr><td style="padding:4px 8px;"><strong>Email:</strong></td><td>${escapeHtml(contact.email || "N/A")}</td></tr>
      <tr><td style="padding:4px 8px;"><strong>Phone:</strong></td><td>${escapeHtml(contact.phone || "N/A")}</td></tr>
      <tr><td style="padding:4px 8px;"><strong>Dates:</strong></td><td>${escapeHtml(start || "N/A")} → ${escapeHtml(end || "N/A")}</td></tr>
      <tr><td style="padding:4px 8px;"><strong>Party Size:</strong></td><td>${escapeHtml(String(party || "N/A"))}</td></tr>
      <tr><td style="padding:4px 8px;"><strong>Rig:</strong></td><td>${escapeHtml(rig || "N/A")}</td></tr>
      <tr><td style="padding:4px 8px;"><strong>Guide Day:</strong></td><td>${guideDay ? "Yes" : "No"}</td></tr>
      <tr><td style="padding:4px 8px;"><strong>Overnights:</strong></td><td>${escapeHtml(String(overnight || 0))}</td></tr>
    </table>

    <h3 style="margin-top:20px;">Add-Ons</h3>
    <ul style="margin:0;padding-left:20px;">
      ${Object.entries(addOns)
        .filter(([_, val]) => val && val !== 0)
        .map(([key, val]) => `<li><strong>${escapeHtml(key)}</strong>${typeof val === "number" ? ` × ${val}` : ""}</li>`)
        .join("") || "<li>None selected</li>"}
    </ul>

    <h3 style="margin-top:20px;">Pricing Summary</h3>
    <table style="border-collapse:collapse;width:100%;max-width:400px;">
      <tr><td style="padding:4px 8px;">Rental:</td><td>$${pricing?.rentalTotal?.toLocaleString?.() || 0}</td></tr>
      <tr><td style="padding:4px 8px;">Guide:</td><td>$${pricing?.guideTotal?.toLocaleString?.() || 0}</td></tr>
      <tr><td style="padding:4px 8px;">Overnights:</td><td>$${pricing?.overnightAdd?.toLocaleString?.() || 0}</td></tr>
      <tr><td style="padding:4px 8px;">Add-Ons:</td><td>$${pricing?.addOnSum?.toLocaleString?.() || 0}</td></tr>
      <tr><td style="padding:4px 8px;">Lodge:</td><td>$${pricing?.lodgeCost?.toLocaleString?.() || 0}</td></tr>
      <tr style="border-top:1px solid #ccc;font-weight:bold;"><td style="padding:4px 8px;">Total:</td><td>$${pricing?.total?.toLocaleString?.() || 0}</td></tr>
    </table>

    <p style="margin-top:16px;font-size:13px;color:#666;">
      Submitted from the <strong>Trip Builder</strong> form on the website.
    </p>
  </div>
`;

    const adminMessage = {
      from: "Alaska Offroad Expedition <cooper@alaskaoffroadexpedition.com>", // updated sender
      to: process.env.SALES_INBOX_EMAIL,
      subject,
      html: adminHtml,
    };
    if (contact.email) adminMessage.reply_to = contact.email;

    const { data: adminData, error: adminError } = await resend.emails.send(adminMessage);
    if (adminError) {
      console.error("RESEND ADMIN ERROR:", adminError);
      return res.status(500).json({ ok: false, error: adminError.message || "Admin email send failed" });
    }

    // ---------- CUSTOMER CONFIRMATION (kept concise; adds add-ons list) ----------
    let customerId = null;
    if (contact.email) {
      try {
        const customerAddOns = Object.entries(addOns)
          .filter(([_, val]) => val && val !== 0)
          .map(([key, val]) => `${escapeHtml(key)}${typeof val === "number" ? ` × ${val}` : ""}`)
          .join(", ") || "None";

        const customerHtml = `
        <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height:1.6; color:#222;">
          <h2 style="margin:0 0 8px;">Thanks ${escapeHtml(contact.name || "there")} — we received your request!</h2>
          <p>Your itinerary request has been successfully received by the <strong>Alaska Offroad Expedition</strong> team.</p>
          <p>We’ll review your trip details and contact you within 24 hours to finalize your itinerary and confirm your reservation.</p>

          <h3 style="margin:16px 0 8px;">Your Request Summary</h3>
          <ul style="margin:0 0 12px 18px;">
            <li><strong>Dates:</strong> ${escapeHtml(start || "TBD")} → ${escapeHtml(end || "TBD")}</li>
            <li><strong>Party Size:</strong> ${escapeHtml(String(party || "TBD"))}</li>
            <li><strong>Rig:</strong> ${escapeHtml(rig || "TBD")}</li>
            <li><strong>Guide Day:</strong> ${guideDay ? "Yes" : "No"}</li>
            <li><strong>Overnights:</strong> ${escapeHtml(String(overnight || 0))}</li>
            <li><strong>Add-Ons:</strong> ${customerAddOns}</li>
          </ul>

          <p style="margin:0 0 12px;">If you need to make any changes, simply reply to this email or call us at <strong>(907) 406-7901</strong>.</p>
          <p style="margin:0;">— The Alaska Offroad Expedition Team<br/>Phone: (907) 406-7901</p>
          <hr style="margin:16px 0;border:none;border-top:1px solid #eee;">
          <p style="font-size:12px;color:#777;">Sent from AlaskaOffroadExpedition.com</p>
        </div>
        `;

        const { data: custData, error: custError } = await resend.emails.send({
          from: "Alaska Offroad Expedition <cooper@alaskaoffroadexpedition.com>", // updated sender
          to: contact.email,
          subject: "Alaska Offroad Expedition Itinerary", // updated subject
          html: customerHtml,
        });

        if (custError) console.error("RESEND CUSTOMER ERROR:", custError);
        else customerId = custData?.id || null;
      } catch (custSendErr) {
        console.error("CUSTOMER SEND TRY/CATCH ERROR:", custSendErr);
      }
    }

    return res.status(200).json({ ok: true, adminId: adminData?.id || null, customerId });
  } catch (err) {
    console.error("TRIP-INQUIRY ERROR:", err);
    return res.status(500).json({ ok: false, error: "Unexpected server error" });
  }
}

/** Basic HTML escaper to avoid weird characters in the email body */
function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
