// /api/trip-inquiry.js
import { Resend } from 'resend';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const {
      name = '',
      email = '',
      phone = '',
      tripDates = '',
      partySize = '',
      interests = '',
      message = '',
    } = body || {};

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const adminHtml = `
      <h2>New Trip Inquiry</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Trip Dates:</strong> ${escapeHtml(tripDates)}</p>
      <p><strong>Party Size:</strong> ${escapeHtml(partySize)}</p>
      <p><strong>Interests:</strong> ${escapeHtml(interests)}</p>
      <p><strong>Message:</strong><br/>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>
    `;

    const guestHtml = `
      <h2>We got your inquiry, ${escapeHtml(name)}!</h2>
      <p>Thanks for reaching out to <strong>Alaska Offroad Expedition</strong>. We’ll review and reply shortly.</p>
      <hr/>
      <p><strong>Your details</strong></p>
      <ul>
        <li><strong>Trip Dates:</strong> ${escapeHtml(tripDates)}</li>
        <li><strong>Party Size:</strong> ${escapeHtml(partySize)}</li>
        <li><strong>Interests:</strong> ${escapeHtml(interests)}</li>
      </ul>
      <p>If anything changes, just reply to this email.</p>
    `;

    // send to you
    await resend.emails.send({
      from: 'Alaska Offroad Expedition <trips@alaskaoffroadexpedition.com>',
      to: [process.env.BOOKING_NOTIFY_EMAIL],
      subject: `New Trip Inquiry — ${name}`,
      html: adminHtml,
      cc: process.env.BOOKING_CC_EMAIL ? [process.env.BOOKING_CC_EMAIL] : undefined,
      reply_to: email,
    });

    // confirmation to guest
    await resend.emails.send({
      from: 'Alaska Offroad Expedition <trips@alaskaoffroadexpedition.com>',
      to: [email],
      subject: 'We received your trip request!',
      html: guestHtml,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to send emails.' });
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
