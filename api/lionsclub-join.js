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
    const FROM = "Lions Club <noreply@alaskaoffroadexpedition.com>";
    const ADMIN_TO = "Cooper <cooper@alaskaoffroadexpedition.com>";

    const subjectAdmin = `New Lions Club membership interest — ${name}`;
    const subjectUser  = "Thanks for your interest — Southcentral Offroad & Outdoor Lions Club";

    const safe = (x) => (Array.isArray(x) ? x.join(", ") : String(x || "").trim());

    // Admin notification (to you) – styled card
    const adminHtml = `
      <div style="background:#f3f4f6;padding:24px 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;line-height:1.6;">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;box-shadow:0 18px 45px rgba(15,23,42,0.18);">
          <div style="background:#111827;color:#f9fafb;padding:16px 24px;border-bottom:1px solid rgba(255,255,255,0.08);">
            <h1 style="margin:0;font-size:20px;font-weight:700;">New Lions Club Membership Interest</h1>
            <p style="margin:4px 0 0;font-size:13px;color:#9ca3af;">
              Southcentral Offroad &amp; Outdoor Lions Club • Alaska Offroad Expedition
            </p>
          </div>
          <div style="padding:20px 24px 8px;">
            <h2 style="margin:0 0 12px;font-size:16px;font-weight:600;">Contact Details</h2>
            <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:12px;">
              <tbody>
                <tr>
                  <td style="padding:4px 0;width:120px;color:#6b7280;font-weight:500;">Name</td>
                  <td style="padding:4px 0;color:#111827;">${safe(name)}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;color:#6b7280;font-weight:500;">Email</td>
                  <td style="padding:4px 0;">
                    <a href="mailto:${safe(email)}" style="color:#2563eb;text-decoration:none;">${safe(email)}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px 0;color:#6b7280;font-weight:500;">Phone</td>
                  <td style="padding:4px 0;color:#111827;">${safe(phone) || "-"}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;color:#6b7280;font-weight:500;">City / Region</td>
                  <td style="padding:4px 0;color:#111827;">${safe(city) || "-"}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;color:#6b7280;font-weight:500;">Involvement</td>
                  <td style="padding:4px 0;color:#111827;">${safe(involvement) || "-"}</td>
                </tr>
              </tbody>
            </table>

            ${
              message
                ? `
            <div style="margin-top:10px;padding-top:10px;border-top:1px solid #e5e7eb;">
              <h3 style="margin:0 0 6px;font-size:14px;font-weight:600;color:#111827;">Message</h3>
              <p style="margin:0;font-size:14px;color:#374151;white-space:pre-line;">${safe(message)}</p>
            </div>
            `
                : ""
            }
          </div>
          <div style="padding:12px 24px 16px;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;display:flex;justify-content:space-between;align-items:center;">
            <span>Submitted: ${new Date().toLocaleString()}</span>
            <span>Southcentral Offroad &amp; Outdoor Lions Club</span>
          </div>
        </div>
      </div>
    `;

    // Confirmation to the member – styled welcome email
    const userHtml = `
      <div style="background:#f3f4f6;padding:24px 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;line-height:1.6;">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;box-shadow:0 18px 45px rgba(15,23,42,0.18);">
          <!-- Header -->
          <div style="background:#111827;color:#f9fafb;padding:18px 24px;border-bottom:1px solid rgba(255,255,255,0.08);">
            <h1 style="margin:0;font-size:20px;font-weight:700;">Thanks for reaching out, ${safe(name)}!</h1>
            <p style="margin:4px 0 0;font-size:13px;color:#9ca3af;">
              Southcentral Offroad &amp; Outdoor Lions Club • Adventure with purpose
            </p>
          </div>

          <!-- Body -->
          <div style="padding:20px 24px 8px;font-size:14px;color:#111827;">
            <p style="margin:0 0 12px;">
              We’ve received your interest form for the
              <strong>Southcentral Offroad &amp; Outdoor Lions Club</strong>.
              We’re building a service-focused off-road and outdoor club supporting
              veterans, special needs participants, and our Alaska communities.
            </p>

            <p style="margin:0 0 12px;">
              Over the coming weeks, we’ll be confirming our
              <strong>charter meeting date, bylaws, and membership structure</strong>.
              At that time, we’ll walk through how dues work (currently planned at an
              accessible annual rate) and how members can plug into:
            </p>

            <ul style="margin:0 0 12px 18px;padding:0;color:#374151;">
              <li>Free or hosted trail rides, camping trips, and outdoor days</li>
              <li>Survival, recovery, and safety training opportunities</li>
              <li>Trail cleanup and stewardship projects</li>
              <li>Veteran and special needs–focused events and outings</li>
              <li>Community-building off-road runs and meetups</li>
            </ul>

            <p style="margin:0 0 12px;">
              You’ll receive another email from us with
              <strong>charter details and next steps</strong> as we finalize our first
              round of founding members.
            </p>

            <p style="margin:0 0 6px;">
              If you have questions in the meantime, you can contact us at
              <a href="mailto:cooper@alaskaoffroadexpedition.com" style="color:#2563eb;text-decoration:none;">
                cooper@alaskaoffroadexpedition.com
              </a>.
            </p>

            <p style="margin:16px 0 0;">
              See you on the trail,<br/>
              <strong>Alaska Offroad Expedition &amp; Southcentral Offroad &amp; Outdoor Lions Club</strong>
            </p>
          </div>

          <!-- Footer -->
          <div style="padding:12px 24px 16px;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;">
            This email confirms that we received your Lions Club interest form from the Alaska Offroad Expedition website.
          </div>
        </div>
      </div>
    `;

    // Send both emails (in parallel)
    await Promise.all([
      resend.emails.send({
        from: FROM,
        to: ADMIN_TO,
        reply_to: email,
        subject: subjectAdmin,
        html: adminHtml,
        text: `Name: ${name}
Email: ${email}
Phone: ${phone}
City: ${city}
Involvement: ${safe(involvement)}

Message:
${message || "-"}`,
      }),
      resend.emails.send({
        from: FROM,
        to: email,
        subject: subjectUser,
        html: userHtml,
        text:
          `Thanks, ${name}!\n\n` +
          `We received your interest form for the Southcentral Offroad & Outdoor Lions Club.\n` +
          `We’ll follow up with charter meeting details, membership structure, and upcoming events.\n\n` +
          `If you have questions, reply to this email or contact cooper@alaskaoffroadexpedition.com.\n\n` +
          `— Alaska Offroad Expedition`,
      }),
    ]);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("LIONSCLUB-JOIN ERROR:", err);
    const msg = err?.message || "Unknown error";
    return res.status(500).json({ ok: false, error: msg });
  }
}
