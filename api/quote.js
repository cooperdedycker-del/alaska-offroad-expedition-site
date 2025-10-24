import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

const INBOX = process.env.BOOKING_INBOX || 'cooperdedycker@gmail.com';
const FROM  = process.env.BOOKING_FROM  || 'Expeditions <bookings@alaskaoffroadexpedition.com>';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { form, nights, price } = req.body || {};
    if (!form?.contact?.email) return res.status(400).json({ error: 'Invalid payload' });

    const subject = `New Expedition Request — ${form.contact.name || 'Guest'} (${form.start} → ${form.end})`;
    const html = `<h2>New Expedition Request</h2>
      <p><strong>Name:</strong> ${form.contact.name || ''}<br/>
      <strong>Email:</strong> ${form.contact.email || ''}<br/>
      <strong>Phone:</strong> ${form.contact.phone || ''}</p>
      <p><strong>Dates:</strong> ${form.start || '—'} → ${form.end || '—'} (${nights} night${nights!==1?'s':''})<br/>
      <strong>Party:</strong> ${form.party}<br/>
      <strong>Rig:</strong> ${form.rig}<br/>
      <strong>Guided Day:</strong> ${form.guideDay ? 'Yes' : 'No'}<br/>
      <strong>Extra Guided Overnights:</strong> ${form.overnights}</p>
      <p><strong>Add-ons:</strong> ${
        Object.entries(form.addOns||{}).filter(([k,v])=>k!=='lodgeNights' && v===true).map(([k])=>k).join(', ') || 'None'
      }<br/><strong>Lodge nights:</strong> ${form.addOns?.lodgeNights || 0}</p>
      <p><strong>Vehicle:</strong> $${(price?.rentalTotal||0).toLocaleString()}<br/>
      ${price?.guideTotal ? `Guided day: $${price.guideTotal.toLocaleString()}<br/>` : ''}
      ${price?.overnightAdd ? `Extra guided overnights: $${price.overnightAdd.toLocaleString()}<br/>` : ''}
      ${price?.addOnSum ? `Add-ons: $${price.addOnSum.toLocaleString()}<br/>` : ''}
      ${price?.lodgeCost ? `Lodge: $${price.lodgeCost.toLocaleString()}<br/>` : ''}
      <strong>Subtotal (est.):</strong> $${(price?.total||0).toLocaleString()}<br/>
      <strong>Deposit (25%):</strong> $${(price?.deposit||0).toLocaleString()}</p>`;

    await resend.emails.send({ from: FROM, to: INBOX, reply_to: form.contact.email, subject, html });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Email failed' });
  }
}
