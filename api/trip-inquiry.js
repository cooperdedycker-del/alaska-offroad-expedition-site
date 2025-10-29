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

    // Helpful diagnostics in Vercel -> Functions -> trip-inquiry -> Logs
    try {
      console.log("TRIP-INQUIRY BODY KEYS:", Object.keys(req.body || {}));
      console.log("CONTACT KEYS:", Object.keys(form?.contact || {}));
    } catch {}

    // Normalize shape (handles flat and nested contact fields)
    const contact = {
      name: form?.contact?.name ?? form?.name ?? "",
      email: form?.contact?.email ?? form?.email ?? "",
      phone: form?.contact?.phone ?? form?.phone ?? "",
    };

    // Optional fields that might not exist yet (don't 400 on these)
    const start = form?.start || "";
    const end = form?.end || "";
    const party = form?.party ?? "";
    const rig = form?.rig || "";
    const addOns = form?.addOns || {};
    const guideDay = !!form?.guideDay;
    const overnight = form?.overnight ?? 0;

    const subject = `AOE Trip Inquiry — ${contact.name || "No Name"} — ${start || "?"} → ${end || "?"}`;

    const html = `
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
        .filter(([key, val]) => val && val !== 0)
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


    // Build message (only set reply_to if we have an email)
    const message = {
      from: process.env.EMAIL_FROM,           // e.g., "AOE <no-reply@yourdomain.com>"
      to: process.env.SALES_INBOX_EMAIL,      // e.g., "sales@yourdomain.com"
      subject,
      html,
    };
    if (contact.email) message.reply_to = contact.email; // Resend supports `reply_to`

    const { data, error } = await resend.emails.send(message);

    if (error) {
      console.error("RESEND ERROR:", error);
      return res.status(500).json({ ok: false, error: error.message || "Email send failed" });
    }

    console.log("RESEND OK:", data);
        const { data, error } = await resend.emails.send(message);

    if (error) {
      console.error("RESEND ERROR:", error);
      return res.status(500).json({ ok: false, error: error.message || "Email send failed" });
    }

    console.log("RESEND OK:", data);

    // ---- Customer confirmation (best-effort; doesn't fail the whole request) ----
    try {
      // simple email sanity check
      const validCustomerEmail = contact.email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact.email);
      if (validCustomerEmail) {
        const customerSubject = "We received your Alaska Offroad Expedition request";
        const customerHtml = `
          <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.6;color:#222;">
            <h2 style="margin:0 0 6px;">Thanks, ${escapeHtml(contact.name || "there")}!</h2>
            <p>We received your itinerary request and will review availability, permits, and vendors. We’ll follow up shortly with next steps.</p>

            <h3 style="margin:16px 0 8px;">Your Request</h3>
            <table style="border-collapse:collapse;width:100%;max-width:600px;">
              <tr><td style="padding:4px 8px;"><strong>Dates:</strong></td><td>${escapeHtml(start || "TBD")} → ${escapeHtml(end || "TBD")}</td></tr>
              <tr><td style="padding:4px 8px;"><strong>Party Size:</strong></td><td>${escapeHtml(String(party || "N/A"))}</td></tr>
              <tr><td style="padding:4px 8px;"><strong>Rig:</strong></td><td>${escapeHtml(rig || "N/A")}</td></tr>
              <tr><td style="padding:4px 8px;"><strong>Guided Day:</strong></td><td>${guideDay ? "Yes" : "No"}</td></tr>
              <tr><td style="padding:4px 8px;"><strong>Overnights:</strong></td><td>${escapeHtml(String(overnight || 0))}</td></tr>
            </table>

            <h4 style="margin:16px 0 8px;">Add-ons</h4>
            <ul style="margin:0;padding-left:20px;">
              ${
                Object.entries(addOns)
                  .filter(([k,v]) => v && v !== 0)
                  .map(([k,v]) => `<li><strong>${escapeHtml(k)}</strong>${typeof v==="number" ? ` × ${v}` : ""}</li>`)
                  .join("") || "<li>None selected</li>"
              }
            </ul>

            <h3 style="margin:18px 0 8px;">Estimated Pricing</h3>
            <table style="border-collapse:collapse;width:100%;max-width:420px;">
              <tr><td style="padding:4px 8px;">Rental</td><td>$${pricing?.rentalTotal?.toLocaleString?.() || 0}</td></tr>
              <tr><td style="padding:4px 8px;">Guide</td><td>$${pricing?.guideTotal?.toLocaleString?.() || 0}</td></tr>
              <tr><td style="padding:4px 8px;">Overnights</td><td>$${pricing?.overnightAdd?.toLocaleString?.() || 0}</td></tr>
              <tr><td style="padding:4px 8px;">Add-ons</td><td>$${pricing?.addOnSum?.toLocaleString?.() || 0}</td></tr>
              <tr><td style="padding:4px 8px;">Lodge</td><td>$${pricing?.lodgeCost?.toLocaleString?.() || 0}</td></tr>
              <tr style="border-top:1px solid #ccc;font-weight:bold;"><td style="padding:4px 8px;">Total (est.)</td><td>$${pricing?.total?.toLocaleString?.() || 0}</td></tr>
            </table>

            <p style="margin-top:16px;">Need to make a change? Just <strong>reply to this email</strong>.</p>
            <p style="font-size:13px;color:#666;margin-top:6px;">Alaska Offroad Expedition • ${escapeHtml(process.env.SALES_INBOX_EMAIL || "")}</p>
          </div>
        `;

        // Send confirmation to the customer; their reply should go to your sales inbox
        const confirm = {
          from: process.env.EMAIL_FROM,           // same verified sender
          to: contact.email,                      // customer
          subject: customerSubject,
          html: customerHtml,
          reply_to: process.env.SALES_INBOX_EMAIL // customer replies route to you
        };

        const { data: cData, error: cError } = await resend.emails.send(confirm);
        if (cError) console.warn("CONFIRMATION ERROR:", cError);
        else console.log("CONFIRMATION OK:", cData);
      } else {
        console.log("No valid customer email; skipping confirmation.");
      }
    } catch (e) {
      console.warn("Confirmation send exception:", e);
    }
    // ------------------------------------------------------------------------

    return res.status(200).json({ ok: true, id: data?.id || null });

    return res.status(200).json({ ok: true, id: data?.id || null });
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
