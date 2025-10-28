// api/trip-inquiry.js
import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    // --- Parse and normalize payload ---------------------------------------
    const { form = {}, pricing } = req.body || {};

    // Temporary diagnostics (safe to keep while verifying prod)
    console.log("TRIP-INQUIRY BODY KEYS:", Object.keys(form || {}));
    if (form?.contact) console.log("CONTACT KEYS:", Object.keys(form.contact));

    // Accept both nested and flat contact shapes
    const contactName  = form?.contact?.name  ?? form?.contactName  ?? form?.name  ?? "";
    const contactEmail = form?.contact?.email ?? form?.contactEmail ?? form?.email ?? "";
    const contactPhone = form?.contact?.phone ?? form?.contactPhone ?? form?.phone ?? "";

    if (!contactName || !contactEmail) {
      return res.status(400).json({ ok: false, error: "Missing name/email" });
    }

    // Pull the rest with sane defaults
    const start     = form?.start ?? null;
    const end       = form?.end ?? null;
    const party     = form?.party ?? null;
    const rig       = form?.rig ?? null;
    const guideDay  = !!form?.guideDay;
    const overnight = form?.overnight ?? 0;
    const notes     = form?.notes ?? "";
    const addOnsRaw = form?.addOns;

    const addOns =
      addOnsRaw && typeof addOnsRaw === "object" ? addOnsRaw : {};

    const addOnList = Object.entries(addOns)
      .map(([k, v]) => `${k}: ${typeof v === "boolean" ? (v ? "Yes" : "No") : v}`)
      .join(", ");

    const totalStr =
      typeof pricing?.total === "number"
        ? `$${pricing.total.toLocaleString()}`
        : pricing?.total ?? "N/A";

    const contact = { name: contactName, email: contactEmail, phone: contactPhone };

    // --- Build email --------------------------------------------------------
    const subject = `New Trip Inquiry: ${contact.name} • ${start || "TBD"} → ${end || "TBD"}`;

    const html = `
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; line-height: 1.5;">
        <h2>New Trip Inquiry</h2>
        <table style="width:100%; border-collapse: collapse;">
          <tr><td><strong>Name</strong></td><td>${escapeHtml(contact.name)}</td></tr>
          <tr><td><strong>Email</strong></td><td>${escapeHtml(contact.email)}</td></tr>
          <tr><td><strong>Phone</strong></td><td>${escapeHtml(contact.phone || "")}</td></tr>
          <tr><td><strong>Dates</strong></td><td>${escapeHtml(start || "TBD")} → ${escapeHtml(end || "TBD")}</td></tr>
          <tr><td><strong>Party Size</strong></td><td>${escapeHtml(String(party ?? ""))}</td></tr>
          <tr><td><strong>Rig</strong></td><td>${escapeHtml(String(rig ?? ""))}</td></tr>
          <tr><td><strong>Guide for Day</strong></td><td>${guideDay ? "Yes" : "No"}</td></tr>
          <tr><td><strong>Overnights</strong></td><td>${escapeHtml(String(overnight ?? 0))}</td></tr>
          <tr><td><strong>Add-Ons</strong></td><td>${escapeHtml(addOnList || "None")}</td></tr>
          <tr><td><strong>Quoted Total</strong></td><td>${escapeHtml(totalStr)}</td></tr>
        </table>
        ${notes ? `<p><strong>Notes:</strong><br/>${escapeHtml(notes)}</p>` : ""}
        <hr/>
        <p style="font-size:12px;color:#666;">Submitted from the website Trip Builder.</p>
      </div>
    `;

    // --- Env + send ---------------------------------------------------------
    const fromEmail = process.env.EMAIL_FROM || "bookings@alaskaoffroadexpedition.com";
    const toEmail   = process.env.SALES_INBOX_EMAIL || "cooper@alaskaoffroadexpedition.com";

    console.log("SENDING FROM:", fromEmail);
    console.log("SENDING TO:", toEmail);

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
