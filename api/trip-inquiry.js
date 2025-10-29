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
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5">
        <h2>Alaska Offroad Expedition — Trip Inquiry</h2>
        <p><strong>Name:</strong> ${escapeHtml(contact.name || "N/A")}<br/>
           <strong>Email:</strong> ${escapeHtml(contact.email || "N/A")}<br/>
           <strong>Phone:</strong> ${escapeHtml(contact.phone || "N/A")}</p>

        <p><strong>Dates:</strong> ${escapeHtml(start || "N/A")} → ${escapeHtml(end || "N/A")}<br/>
           <strong>Party Size:</strong> ${escapeHtml(String(party || "N/A"))}<br/>
           <strong>Rig:</strong> ${escapeHtml(rig || "N/A")}<br/>
           <strong>Guide Day:</strong> ${guideDay ? "Yes" : "No"}<br/>
           <strong>Overnights:</strong> ${escapeHtml(String(overnight || 0))}</p>

        <h3>Add-Ons</h3>
        <pre style="white-space:pre-wrap;background:#f6f6f6;padding:10px;border-radius:8px">
${escapeHtml(JSON.stringify(addOns, null, 2))}
        </pre>

        <h3>Pricing (raw)</h3>
        <pre style="white-space:pre-wrap;background:#f6f6f6;padding:10px;border-radius:8px">
${escapeHtml(JSON.stringify(pricing, null, 2))}
        </pre>
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
