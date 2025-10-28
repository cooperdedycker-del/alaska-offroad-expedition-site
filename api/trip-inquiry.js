console.log("Resend key prefix:", process.env.RESEND_API_KEY?.slice(0, 6));

// api/trip-inquiry.js
import { Resend } from "resend";

export default async function handler(req, res) {


  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { form, pricing } = req.body || {};

    if (!form?.contact?.email || !form?.contact?.name) {
      return res.status(400).json({ ok: false, error: "Missing name/email" });
    }

    const {
      start,
      end,
      party,
      rig,
      guideDay,
      overnight,
      addOns = {},
      contact,
      notes,
    } = form;

    const addOnList = Object.entries(addOns)
      .map(
        ([k, v]) =>
          `${k}: ${typeof v === "boolean" ? (v ? "Yes" : "No") : v}`
      )
      .join(", ");

    const totalStr =
      typeof pricing?.total === "number"
        ? `$${pricing.total.toLocaleString()}`
        : pricing?.total ?? "N/A";

    const subject = `New Trip Inquiry: ${contact.name} • ${
      start || "TBD"
    } → ${end || "TBD"}`;

    const html = `
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; line-height: 1.5;">
        <h2>New Trip Inquiry</h2>
        <table style="width:100%; border-collapse: collapse;">
          <tr><td><strong>Name</strong></td><td>${escapeHtml(contact.name)}</td></tr>
          <tr><td><strong>Email</strong></td><td>${escapeHtml(contact.email)}</td></tr>
          <tr><td><strong>Phone</strong></td><td>${escapeHtml(contact.phone || "")}</td></tr>
          <tr><td><strong>Dates</strong></td><td>${escapeHtml(
            start || "TBD"
          )} → ${escapeHtml(end || "TBD")}</td></tr>
          <tr><td><strong>Party Size</strong></td><td>${escapeHtml(
            String(party ?? "")
          )}</td></tr>
          <tr><td><strong>Rig</strong></td><td>${escapeHtml(
            String(rig ?? "")
          )}</td></tr>
          <tr><td><strong>Guide for Day</strong></td><td>${
            guideDay ? "Yes" : "No"
          }</td></tr>
          <tr><td><strong>Overnights</strong></td><td>${escapeHtml(
            String(overnight ?? 0)
          )}</td></tr>
          <tr><td><strong>Add-Ons</strong></td><td>${escapeHtml(
            addOnList || "None"
          )}</td></tr>
          <tr><td><strong>Quoted Total</strong></td><td>${escapeHtml(
            totalStr
          )}</td></tr>
        </table>
        ${
          notes
            ? `<p><strong>Notes:</strong><br/>${escapeHtml(notes)}</p>`
            : ""
        }
        <hr/>
        <p style="font-size:12px;color:#666;">Submitted from the website Trip Builder.</p>
      </div>
    `;

    // Match your Vercel environment variable names
    const fromEmail =
      process.env.EMAIL_FROM || "bookings@alaskaoffroadexpedition.com";
    const toEmail =
      process.env.SALES_INBOX_EMAIL || "cooper@alaskaoffroadexpedition.com";

      console.log("SENDING FROM:", process.env.EMAIL_FROM);
console.log("SENDING TO:", process.env.SALES_INBOX_EMAIL || "cooper@alaskaoffroadexpedition.com");

    const { data, error } = await resend.emails.send({
      from: `Alaska Offroad Expedition <${fromEmail}>`,
      to: [toEmail],
      subject,
      html,
      replyTo: contact.email,
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(500).json({ ok: false, error: "Email failed to send" });
    }

    return res.status(200).json({ ok: true, id: data?.id || null });
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}

// Escape HTML to prevent injection
function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
