// /api/lionsclub-join.js
import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Parse body
    const {
      name = "",
      email = "",
      phone = "",
      city = "",
      involvement = [],
      message = "",
      honeypot = "",
    } = req.body || {};

    // Basic bot/validation checks
    if (honeypot) return res.status(200).json({ ok: true }); // silently ignore bots
    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({ ok: false, error: "Name and email are required." });
    }

    // ---- CONFIGURE THESE ADDRESSES ----
    // Use a verified sender in Resend. For production, use your domain.
    // If your domain isn't verified yet, temporarily use "onboarding@resend.dev".
    const FROM = "Lions Club <noreply@alaskaoffroadexpedition.com>"; // or "onboarding@resend.dev"
    const ADMIN_TO = "Cooper <cooper@alaskaoffroadexpedition.com>"; // where YOU get the notification

    const subjectAdmin = `New Lions Club membership interest — ${name}`;
    const subjectUser  = "Thanks for your interest — Southcentral Outdoor & Off-Road Lions Club";

    const safe = (x) => (Array.isArray(x) ? x.join(", ") : String(x || "").trim());

    // Admin notification (to you)
    const adminHtml = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.5">
        <h2>New Membership Interest</h2>
        <ul>
          <li><strong>Name:</strong> ${safe(name)}</li>
          <li><strong>Email:</strong> ${safe(email)}</li>
          <li><strong>Phone:</strong> ${safe(phone)}</li>
          <li><strong>City/Region:</strong> ${safe(city)}</li>
          <li><strong>Involvement:</strong> ${safe(involvement)}</li>
        </ul>
        ${message ? `<p><strong>Message:</strong><br>${safe(message)}</p>` : ""}
        <hr>
        <p>Submitted: ${new Date().toLocaleString()}</p>
      </div>
    `;

    // Confirmation to the member
    const userHtml = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.6">
        <h2>Thanks, ${safe(name)}!</h2>
        <p>
          We received your interest form for the <strong>Southcentral Outdoor & Off-Road Lions Club</strong>.
          We’ll follow up with details on the charter meeting, membership setup ($100/month), and upcoming
          events (free training, group off-road runs, camping, trail cleanups, and more).
        </p>
        <p>
          If you have any immediate questions, reply to this email or reach us at
          <a href="mailto:cooper@alaskaoffroadexpedition.com">cooper@alaskaoffroadexpedition.com</a>.
        </p>
        <p>— Alaska Offroad Expedition</p>
      </div>
    `;

    // Send both emails (in parallel)
    await Promise.all([
      resend.emails.send({
        from: FROM,
        to: ADMIN_TO,
        reply_to: email, // handy for quick replies
        subject: subjectAdmin,
        html: adminHtml,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nCity: ${city}\nInvolvement: ${safe(involvement)}\n\nMessage:\n${message || "-"}`,
      }),
      resend.emails.send({
        from: FROM,
        to: email,
        subject: subjectUser,
        html: userHtml,
        text:
          `Thanks, ${name}!\n\nWe received your interest form for the Southcentral Outdoor & Off-Road Lions Club.\n` +
          `We’ll be in touch with charter meeting details and membership setup.\n\n— Alaska Offroad Expedition`,
      }),
    ]);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("LIONSCLUB-JOIN ERROR:", err);
    const msg = err?.message || "Unknown error";
    return res.status(500).json({ ok: false, error: msg });
  }
}
