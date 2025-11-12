// pages/api/lionsclub-join.js
import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const {
      name = "",
      email = "",
      phone = "",
      city = "",
      involvement = [],
      message = "",
      honeypot = "",
    } = req.body || {};

    if (honeypot) return res.status(200).json({ ok: true }); // silently ignore bots
    if (!email || !name) {
      return res.status(400).json({ ok: false, error: "Name and email are required." });
    }

    const toAddress = "cooper@alaskasoffroadexpedition.com"; // per your preference
    const subject = "New Lions Club Membership Interest";

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#111">
        <h2 style="margin:0 0 10px 0">New Membership Interest</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>City/Region:</strong> ${escapeHtml(city)}</p>
        <p><strong>Involvement:</strong> ${involvement.map(escapeHtml).join(", ") || "—"}</p>
        <p><strong>Message:</strong><br>${escapeHtml(message).replace(/\n/g, "<br>") || "—"}</p>
      </div>
    `;

    await resend.emails.send({
      from: "Lions Club <noreply@alaskaoffroadexpedition.com>",
      to: [toAddress],
      subject,
      html,
      reply_to: email,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("lionsclub-join error:", err);
    return res.status(500).json({ ok: false, error: "Internal Server Error" });
  }
}

// Basic HTML escaping to avoid broken markup
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
