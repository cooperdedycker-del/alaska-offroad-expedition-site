import Stripe from "stripe";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { form, pricing } = req.body;

    if (!form?.contact?.name || !form?.contact?.email) {
      return res.status(400).json({ error: "Missing customer contact info" });
    }

    if (!form?.start || !form?.end) {
      return res.status(400).json({ error: "Missing trip dates" });
    }

    if (!pricing?.depositDue || pricing.depositDue <= 0) {
      return res.status(400).json({ error: "Invalid deposit amount" });
    }

    const siteUrl = process.env.SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: form.contact.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(pricing.depositDue * 100),
            product_data: {
              name: "Alaska Offroad Expedition 25% Deposit",
              description: `${form.start} to ${form.end} • Jeep Gladiator Expedition Rig`,
            },
          },
        },
      ],
     metadata: {
  customerName: form.contact.name,
  customerEmail: form.contact.email,
  customerPhone: form.contact.phone || "",

  tripStart: form.start,
  tripEnd: form.end,
  rig: "Jeep Gladiator Expedition Rig",

  drivers: String(form.drivers || 1),
  passengers: String(form.passengers || 0),
  totalGuests: String(pricing.totalGuests || 1),

  lodgingPreference: form.lodgingPreference || "",
  lodgingNotes: form.lodgingNotes || "",

  selectedExcursions:
    pricing.selectedExcursions
      ?.map((x) => x.name)
      .join(", ")
      .slice(0, 450) || "",

  totalEstimate: String(pricing.total || 0),
  depositPaid: String(pricing.depositDue || 0),
  balanceDue: String(pricing.balanceDue || 0),
},
      success_url: `${siteUrl}/?checkout=success&session_id={CHECKOUT_SESSION_ID}#trip-builder`,
      cancel_url: `${siteUrl}/?checkout=cancelled#trip-builder`,
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Create checkout session error:", error);
    return res.status(500).json({
      error: error.message || "Failed to create checkout session",
    });
  }
}