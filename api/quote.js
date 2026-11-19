// /api/quote.js
import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({
      ok: false,
      error: "Method Not Allowed",
    });
  }

  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY.");
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const raw = req.body || {};

    // Support both flat and nested form structures.
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

    const dates =
      form?.dates ??
      form?.tripDates ??
      raw?.dates ??
      "";

    const source =
      form?.source ??
      raw?.source ??
      "Website contact form";

    const subjectInternal =
      "New Contact Form Submission";

    const subjectCustomer =
      "Thanks for reaching out to Alaska Offroad Expedition";

    // ============================================================
    // EMAIL ADDRESSES
    // ============================================================

    const from =
      process.env.EMAIL_FROM ||
      "Alaska Offroad Expedition <noreply@alaskaoffroadexpedition.com>";

    const internalTo =
      process.env.SALES_INBOX_EMAIL ||
      "cooper@alaskaoffroadexpedition.com";

    // ============================================================
    // HELPERS
    // ============================================================

    const safe = (value) => {
      if (
        value === null ||
        value === undefined ||
        String(value).trim().length === 0
      ) {
        return "N/A";
      }

      return String(value).trim();
    };

    // Prevent customer-entered text from breaking HTML emails.
    const escapeHtml = (value) => {
      return safe(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    // Preserve line breaks in Outlook/Gmail without relying on
    // CSS white-space support.
    const formatMultiline = (value) => {
      return escapeHtml(value).replace(/\r?\n/g, "<br>");
    };

    const nameHtml = escapeHtml(contact.name);
    const emailHtml = escapeHtml(contact.email);
    const phoneHtml = escapeHtml(contact.phone);
    const sourceHtml = escapeHtml(source);
    const datesHtml = formatMultiline(dates);
    const messageHtml = formatMultiline(message);

    // ============================================================
    // INTERNAL EMAIL
    // Outlook-safe table layout
    // ============================================================

    const internalHtml = `
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #f3f4f6;
      font-family: Arial, Helvetica, sans-serif;
    "
  >
    <table
      role="presentation"
      width="100%"
      border="0"
      cellspacing="0"
      cellpadding="0"
      bgcolor="#f3f4f6"
      style="
        width: 100%;
        background-color: #f3f4f6;
        margin: 0;
        padding: 0;
      "
    >
      <tr>
        <td
          align="center"
          style="padding: 28px 12px;"
        >

          <table
            role="presentation"
            width="640"
            border="0"
            cellspacing="0"
            cellpadding="0"
            bgcolor="#020617"
            style="
              width: 100%;
              max-width: 640px;
              background-color: #020617;
              border: 1px solid #334155;
              border-radius: 16px;
            "
          >

            <!-- HEADER -->
            <tr>
              <td
                style="
                  padding: 24px 24px 8px 24px;
                  color: #f8fafc;
                  font-size: 22px;
                  font-weight: 700;
                  line-height: 28px;
                "
              >
                Alaska Offroad Expedition
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 0 24px 20px 24px;
                  color: #94a3b8;
                  font-size: 13px;
                  line-height: 20px;
                  border-bottom: 1px solid #334155;
                "
              >
                New contact form submission from your website.
              </td>
            </tr>

            <!-- CONTACT TITLE -->
            <tr>
              <td
                style="
                  padding: 22px 24px 8px 24px;
                  color: #f8fafc;
                  font-size: 16px;
                  font-weight: 700;
                  line-height: 22px;
                "
              >
                Contact Info
              </td>
            </tr>

            <!-- CONTACT BOX -->
            <tr>
              <td style="padding: 0 24px 18px 24px;">
                <table
                  role="presentation"
                  width="100%"
                  border="0"
                  cellspacing="0"
                  cellpadding="0"
                  bgcolor="#0f172a"
                  style="
                    width: 100%;
                    background-color: #0f172a;
                    border: 1px solid #334155;
                    border-radius: 10px;
                  "
                >
                  <tr>
                    <td
                      style="
                        padding: 14px 16px;
                        color: #e5e7eb;
                        font-size: 14px;
                        line-height: 22px;
                      "
                    >
                      <strong style="color: #ffffff;">Name:</strong>
                      ${nameHtml}
                      <br>

                      <strong style="color: #ffffff;">Email:</strong>
                      <a
                        href="mailto:${emailHtml}"
                        style="
                          color: #60a5fa;
                          text-decoration: underline;
                        "
                      >
                        ${emailHtml}
                      </a>
                      <br>

                      <strong style="color: #ffffff;">Phone:</strong>
                      ${phoneHtml}
                      <br>

                      <strong style="color: #ffffff;">Source:</strong>
                      ${sourceHtml}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- DATE TITLE -->
            <tr>
              <td
                style="
                  padding: 0 24px 8px 24px;
                  color: #f8fafc;
                  font-size: 16px;
                  font-weight: 700;
                  line-height: 22px;
                "
              >
                Trip / Date Info
              </td>
            </tr>

            <!-- DATE BOX -->
            <tr>
              <td style="padding: 0 24px 18px 24px;">
                <table
                  role="presentation"
                  width="100%"
                  border="0"
                  cellspacing="0"
                  cellpadding="0"
                  bgcolor="#0f172a"
                  style="
                    width: 100%;
                    background-color: #0f172a;
                    border: 1px solid #334155;
                    border-radius: 10px;
                  "
                >
                  <tr>
                    <td
                      style="
                        padding: 14px 16px;
                        color: #e5e7eb;
                        font-size: 14px;
                        line-height: 22px;
                      "
                    >
                      ${datesHtml}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- MESSAGE TITLE -->
            <tr>
              <td
                style="
                  padding: 0 24px 8px 24px;
                  color: #f8fafc;
                  font-size: 16px;
                  font-weight: 700;
                  line-height: 22px;
                "
              >
                Message
              </td>
            </tr>

            <!-- MESSAGE BOX -->
            <tr>
              <td style="padding: 0 24px 22px 24px;">
                <table
                  role="presentation"
                  width="100%"
                  border="0"
                  cellspacing="0"
                  cellpadding="0"
                  bgcolor="#0f172a"
                  style="
                    width: 100%;
                    background-color: #0f172a;
                    border: 1px solid #334155;
                    border-radius: 10px;
                  "
                >
                  <tr>
                    <td
                      style="
                        padding: 16px;
                        color: #e5e7eb;
                        font-size: 14px;
                        line-height: 22px;
                      "
                    >
                      ${messageHtml}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td
                style="
                  padding: 16px 24px 24px 24px;
                  color: #94a3b8;
                  font-size: 12px;
                  line-height: 18px;
                  border-top: 1px solid #334155;
                "
              >
                Questions? Call or text
                <a
                  href="tel:9074067901"
                  style="
                    color: #60a5fa;
                    text-decoration: underline;
                  "
                >
                  907-406-7901
                </a>
                <br>

                This email was generated from the Alaska Offroad Expedition
                website contact form.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </body>
</html>
    `.trim();

    const internalText = `
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

    // ============================================================
    // SEND INTERNAL NOTIFICATION
    // ============================================================

    const internalPayload = {
      from,
      to: internalTo,
      subject: subjectInternal,
      html: internalHtml,
      text: internalText,
    };

    // Clicking Reply on the internal notification replies
    // directly to the customer.
    if (contact.email) {
      internalPayload.replyTo = contact.email;
    }

    const internalResult =
      await resend.emails.send(internalPayload);

    if (internalResult?.error) {
      console.error(
        "RESEND contact (internal) error:",
        internalResult.error
      );

      return res.status(500).json({
        ok: false,
        error: "Failed to send internal email.",
      });
    }

    // ============================================================
    // CUSTOMER AUTO-RESPONSE
    // ============================================================

    let customerError = null;

    if (contact.email) {
      const customerHtml = `
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    >
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #f3f4f6;
      font-family: Arial, Helvetica, sans-serif;
    "
  >
    <table
      role="presentation"
      width="100%"
      border="0"
      cellspacing="0"
      cellpadding="0"
      bgcolor="#f3f4f6"
      style="
        width: 100%;
        background-color: #f3f4f6;
        margin: 0;
        padding: 0;
      "
    >
      <tr>
        <td
          align="center"
          style="padding: 28px 12px;"
        >

          <table
            role="presentation"
            width="640"
            border="0"
            cellspacing="0"
            cellpadding="0"
            bgcolor="#020617"
            style="
              width: 100%;
              max-width: 640px;
              background-color: #020617;
              border: 1px solid #334155;
              border-radius: 16px;
            "
          >

            <!-- HEADER -->
            <tr>
              <td
                style="
                  padding: 24px 24px 8px 24px;
                  color: #f8fafc;
                  font-size: 22px;
                  font-weight: 700;
                  line-height: 28px;
                "
              >
                Alaska Offroad Expedition
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 0 24px 20px 24px;
                  color: #94a3b8;
                  font-size: 13px;
                  line-height: 20px;
                  border-bottom: 1px solid #334155;
                "
              >
                Thanks for reaching out!
              </td>
            </tr>

            <!-- INTRO -->
            <tr>
              <td
                style="
                  padding: 22px 24px 8px 24px;
                  color: #e5e7eb;
                  font-size: 14px;
                  line-height: 22px;
                "
              >
                Hi ${nameHtml},
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 0 24px 20px 24px;
                  color: #e5e7eb;
                  font-size: 14px;
                  line-height: 22px;
                "
              >
                We’ve received your message and will get back to you
                as soon as possible about your Alaska off-road adventure.
              </td>
            </tr>

            <!-- DATES TITLE -->
            <tr>
              <td
                style="
                  padding: 0 24px 8px 24px;
                  color: #f8fafc;
                  font-size: 16px;
                  font-weight: 700;
                  line-height: 22px;
                "
              >
                Requested dates / trip info
              </td>
            </tr>

            <!-- DATES BOX -->
            <tr>
              <td style="padding: 0 24px 20px 24px;">
                <table
                  role="presentation"
                  width="100%"
                  border="0"
                  cellspacing="0"
                  cellpadding="0"
                  bgcolor="#0f172a"
                  style="
                    width: 100%;
                    background-color: #0f172a;
                    border: 1px solid #334155;
                    border-radius: 10px;
                  "
                >
                  <tr>
                    <td
                      style="
                        padding: 14px 16px;
                        color: #e5e7eb;
                        font-size: 14px;
                        line-height: 22px;
                      "
                    >
                      ${datesHtml}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- MESSAGE TITLE -->
            <tr>
              <td
                style="
                  padding: 0 24px 8px 24px;
                  color: #f8fafc;
                  font-size: 16px;
                  font-weight: 700;
                  line-height: 22px;
                "
              >
                What you sent
              </td>
            </tr>

            <!-- MESSAGE BOX -->
            <tr>
              <td style="padding: 0 24px 22px 24px;">
                <table
                  role="presentation"
                  width="100%"
                  border="0"
                  cellspacing="0"
                  cellpadding="0"
                  bgcolor="#0f172a"
                  style="
                    width: 100%;
                    background-color: #0f172a;
                    border: 1px solid #334155;
                    border-radius: 10px;
                  "
                >
                  <tr>
                    <td
                      style="
                        padding: 16px;
                        color: #e5e7eb;
                        font-size: 14px;
                        line-height: 22px;
                      "
                    >
                      ${messageHtml}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td
                style="
                  padding: 16px 24px 24px 24px;
                  color: #94a3b8;
                  font-size: 12px;
                  line-height: 18px;
                  border-top: 1px solid #334155;
                "
              >
                If you need to reach us sooner, call or text
                <a
                  href="tel:9074067901"
                  style="
                    color: #60a5fa;
                    text-decoration: underline;
                  "
                >
                  907-406-7901
                </a>.
                <br>

                We’re excited to help plan your Alaska adventure.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </body>
</html>
      `.trim();

      const customerText = `
Hi ${safe(contact.name)},

We’ve received your message and will get back to you as soon as possible about your Alaska off-road adventure.

Requested dates / trip info
---------------------------
${safe(dates)}

What you sent
-------------
${safe(message)}

If you need to reach us sooner, call or text 907-406-7901.

We’re excited to help plan your Alaska adventure.

Alaska Offroad Expedition
      `.trim();

      const customerResult =
        await resend.emails.send({
          from,
          to: contact.email,

          // If the customer hits Reply, it comes to you
          // instead of the noreply address.
          replyTo: internalTo,

          subject: subjectCustomer,
          html: customerHtml,
          text: customerText,
        });

      if (customerResult?.error) {
        customerError = customerResult.error;

        console.error(
          "RESEND contact (customer) error:",
          customerError
        );
      }
    }

    // ============================================================
    // SUCCESS
    // ============================================================

    return res.status(200).json({
      ok: true,
      customerEmailSent: !customerError,
    });
  } catch (err) {
    console.error(
      "QUOTE / CONTACT API ERROR:",
      err
    );

    return res.status(500).json({
      ok: false,
      error: "Internal Server Error",
    });
  }
}