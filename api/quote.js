// /api/quote.js
import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const raw = req.body || {};

    // Support both flat and nested shapes:
    // { name, email, phone, dates, message }
    // { contact: { name, email, phone }, message, dates }
    // { form: { ... } }
    const form = raw.form || raw;

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

    const message =
      form?.message ??
      form?.notes ??
      form?.details ??
      form?.comment ??
      raw?.message ??
      "";

    // ✅ NEW: capture requested dates
    const dates =
      form?.dates ??
      form?.tripDates ??
      raw?.dates ??
      "";

    const source =
      form?.source ??
      raw?.source ??
      "Website contact form (bottom of page)";

    const subjectInternal = "New Contact Form Submission";
    const subjectCustomer =
      "Thanks for reaching out to Alaska Offroad Expedition";

    const from =
      "Alaska Offroad Expedition <cooper@alaskaoffroadexpedition.com>";

    const safe = (v) => (v && String(v).trim().length > 0 ? v : "N/A");

    const html = `
      <div style="
        max-width: 640px;
        margin: 0 auto;
        background: #020617;
        color: #e5e7eb;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        padding: 24px;
        border-radius: 16px;
        border: 1px solid rgba(148,163,184,0.35);
      ">
        <div style="border-bottom: 1px solid rgba(148,163,184,0.35); padding-bottom: 16px; margin-bottom: 20px;">
          <h1 style="font-size: 20px; margin: 0 0 4px 0;">Alaska Offroad Expedition</h1>
          <p style="margin: 0; font-size: 13px; color: #9ca3af;">
            New contact form submission from your website.
          </p>
        </div>

        <h2 style="font-size: 16px; margin: 0 0 8px 0;">Contact Info</h2>
        <div style="
          background: rgba(15,23,42,0.9);
          border-radius: 12px;
          padding: 12px 14px;
          border: 1px solid rgba(148,163,184,0.35);
          margin-bottom: 16px;
          font-size: 13px;
        ">
          <div><strong>Name:</strong> ${safe(contact.name)}</div>
          <div><strong>Email:</strong> ${safe(contact.email)}</div>
          <div><strong>Phone:</strong> ${safe(contact.phone)}</div>
          <div><strong>Source:</strong> ${safe(source)}</div>
        </div>

        <h2 style="font-size: 16px; margin: 0 0 8px 0;">Trip / Date Info</h2>
        <div style="
          background: rgba(15,23,42,0.9);
          border-radius: 12px;
          padding: 12px 14px;
          border: 1px solid rgba(148,163,184,0.35);
          margin-bottom: 16px;
          font-size: 13px;
        ">
          ${safe(dates)}
        </div>

        <h2 style="font-size: 16px; margin: 0 0 8px 0;">Message</h2>
        <div style="
          background: rgba(15,23,42,0.9);
          border-radius: 12px;
          padding: 12px 14px;
          border: 1px solid rgba(148,163,184,0.35);
          margin-bottom: 16px;
          font-size: 13px;
          white-space: pre-wrap;
        ">
          ${safe(message)}
        </div>

        <div style="font-size: 12px; color: #9ca3af; margin-top: 16px; border-top: 1px solid rgba(148,163,184,0.35); padding-top: 10px;">
          Questions? Call or text <strong>907-406-7901</strong><br/>
          This email was generated from the Alaska Offroad Expedition website contact form.
        </div>
      </div>
    `;

    const text = `
Alaska Offroad Expedition - Contact Form

Contact Info
------------
Name: ${safe(contact.name)}
Email: ${safe(contact.email)}
Phone: ${safe(contact.phone)}
Source: ${safe(source)}

Trip / Date Info
----------------
${safe(dates)}

Message
-------
${safe(message)}

Questions? Call or text 907-406-7901.
    `.trim();

    // 1) Internal email to you
    const internalResult = await resend.emails.send({
      from,
      to: "cooper@alaskaoffroadexpedition.com",
      subject: subjectInternal,
      html,
      text,
    });

    if (internalResult?.error) {
      console.error("RESEND contact (internal) error:", internalResult.error);
      return res
        .status(500)
        .json({ ok: false, error: "Failed to send internal email." });
    }

    // 2) Auto-response to customer (if email present)
    let customerError = null;
    if (contact.email) {
      const customerHtml = `
        <div style="
          max-width: 640px;
          margin: 0 auto;
          background: #020617;
          color: #e5e7eb;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          padding: 24px;
          border-radius: 16px;
          border: 1px solid rgba(148,163,184,0.35);
        ">
          <div style="border-bottom: 1px solid rgba(148,163,184,0.35); padding-bottom: 16px; margin-bottom: 20px;">
            <h1 style="font-size: 20px; margin: 0 0 4px 0;">Alaska Offroad Expedition</h1>
            <p style="margin: 0; font-size: 13px; color: #9ca3af;">
              Thanks for reaching out!
            </p>
          </div>

          <p style="font-size: 14px; margin-bottom: 12px;">
            Hi ${safe(contact.name)},
          </p>
          <p style="font-size: 14px; margin-bottom: 12px;">
            We’ve received your message and will get back to you as soon as possible
            about your Alaska off-road adventure.
          </p>

          <h2 style="font-size: 15px; margin: 16px 0 8px 0;">Requested dates / trip info</h2>
          <div style="
            background: rgba(15,23,42,0.9);
            border-radius: 12px;
            padding: 12px 14px;
            border: 1px solid rgba(148,163,184,0.35);
            margin-bottom: 16px;
            font-size: 13px;
          ">
            ${safe(dates)}
          </div>

          <h2 style="font-size: 15px; margin: 16px 0 8px 0;">What you sent</h2>
          <div style="
            background: rgba(15,23,42,0.9);
            border-radius: 12px;
            padding: 12px 14px;
            border: 1px solid rgba(148,163,184,0.35);
            margin-bottom: 16px;
            font-size: 13px;
            white-space: pre-wrap;
          ">
            ${safe(message)}
          </div>

          <div style="font-size: 12px; color: #9ca3af; margin-top: 16px; border-top: 1px solid rgba(148,163,184,0.35); padding-top: 10px;">
            If you need to reach us sooner, you can call or text <strong>907-406-7901</strong>.<br/>
            We’re excited to help plan your Alaska adventure.
          </div>
        </div>
      `;

      const customerText = `
Hi ${safe(contact.name)},

We’ve received your message and will get back to you as soon as possible about your Alaska off-road adventure.

Requested dates / trip info
---------------------------
${safe(dates)}

What you sent
-------------
${safe(message)}

If you need to reach us sooner, you can call or text 907-406-7901.

Alaska Offroad Expedition
      `.trim();

      const customerResult = await resend.emails.send({
        from,
        to: contact.email,
        subject: subjectCustomer,
        html: customerHtml,
        text: customerText,
      });

      if (customerResult?.error) {
        customerError = customerResult.error;
        console.error("RESEND contact (customer) error:", customerError);
      }
    }

    return res.status(200).json({
      ok: true,
      customerEmailSent: !customerError,
    });
  } catch (err) {
    console.error("QUOTE / CONTACT API ERROR:", err);
    return res
      .status(500)
      .json({ ok: false, error: "Internal Server Error" });
  }
}
