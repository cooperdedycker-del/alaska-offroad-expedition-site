// /api/contact-planner.js
import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Be tolerant of different shapes coming from the form
    const body = req.body || {};
    const name   = body.name?.trim?.() || body.contact?.name?.trim?.() || "Visitor";
    const email  = body.email?.trim?.() || body.contact?.email?.trim?.() || "";
    const phone  = body.phone?.trim?.() || body.contact?.phone?.trim?.() || "";
    const message = body.message?.toString?.().trim?.() || "";
    const sourceUrl = body.sourceUrl || body.url || "";

    if (!message) {
      return res.status(400).json({ ok: false, error: "Message is required" });
    }

    // Where the message is going (same as Trip Builder)
    const toAddress = process.env.SALES_INBOX_EMAIL;
    if (!toAddress) {
      return res.status(500).json({ ok: false, error: "SALES_INBOX_EMAIL not configured" });
    }
    const fromAddress = process.env.EMAIL_FROM || `no-reply@${new URL(sourceUrl || "https://example.com").hostname}`;

    const subject = `Talk to a Planner (${name})`;

    const html = `
      <div style="font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5">
        <h2 style="margin:0 0 12px">New “Talk to a Planner” inquiry</h2>
        <table style="border-collapse:collapse">
          <tr><td style="padding:4px 8px"><strong>Name</strong></td><td style="padding:4px 8px">${name}</td></tr>
          <tr><td style="padding:4px 8px"><strong>Email</strong></td><td style="padding:4px 8px">${email || "—"}</td></tr>
          <tr><td style="padding:4px 8px"><strong>Phone</strong></td><td style="padding:4px 8px">${phone || "—"}</td></tr>
          <tr><td style="padding:4px 8px;vertical-align:top"><strong>Message</strong></td><td style="padding:4px 8px;white-space:pre-wrap">${message}</td></tr>
          ${sourceUrl ? `<tr><td style="padding:4px 8px"><strong>From URL</strong></td><td style="padding:4px 8px">${sourceUrl}</td></tr>` : ""}
        </table>
      </div>
    `;

    // Send to the sales inbox; set reply-to so you can reply straight to the guest
    await resend.emails.send({
      from: fromAddress,
      to: toAddress,
      subject,
      html,
      reply_to: email || undefined,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("contact-planner error:", err);
    return res.status(500).json({ ok: false, error: "Internal error" });
  }
}
