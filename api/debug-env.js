export default async function handler(req, res) {
  return res.status(200).json({
    stripeKeyPrefix: process.env.STRIPE_SECRET_KEY
      ? process.env.STRIPE_SECRET_KEY.substring(0, 8)
      : "missing",
    siteUrl: process.env.SITE_URL || "missing",
  });
}