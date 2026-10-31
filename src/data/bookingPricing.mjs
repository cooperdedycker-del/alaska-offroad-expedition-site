/**
 * AOE shared pricing rules (draft, not connected to checkout yet).
 * All money is calculated in integer cents.
 * Never accept calculated prices from the browser when charging Stripe.
 */
export const PARTNER_MARKUP_RATE = 0.05;
export const DEPOSIT_RATE = 0.25;

export function centsFromDollars(amount) {
  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount < 0) {
    throw new Error('Invalid monetary amount');
  }
  return Math.round(amount * 100);
}

export function partnerMarkedUpUnitCents(providerUnitPriceDollars) {
  const baseCents = centsFromDollars(providerUnitPriceDollars);
  return Math.ceil(baseCents * (1 + PARTNER_MARKUP_RATE) - 1e-8);
}

export function partnerExperienceTotalCents({ providerUnitPriceDollars, quantity }) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
    throw new Error('Invalid experience quantity');
  }
  // 5% is applied to the complete experience price; round up once, not per guest.
  const providerTotalCents = centsFromDollars(providerUnitPriceDollars) * quantity;
  return Math.ceil(providerTotalCents * (1 + PARTNER_MARKUP_RATE) - 1e-8);
}

export function extendedStayDiscountRate(expeditionDays) {
  if (!Number.isInteger(expeditionDays) || expeditionDays < 0) {
    throw new Error('Invalid expedition days');
  }
  return expeditionDays >= 7 ? 0.10 : expeditionDays >= 4 ? 0.05 : 0;
}

export function quotedBookingAmounts({ aoeExpeditionCents, expeditionDays, partnerExperienceCents = 0, otherCents = 0, fullPaymentRequired = false }) {
  for (const value of [aoeExpeditionCents, partnerExperienceCents, otherCents]) {
    if (!Number.isSafeInteger(value) || value < 0) throw new Error('Invalid booking subtotal');
  }
  const discountCents = Math.round(aoeExpeditionCents * extendedStayDiscountRate(expeditionDays));
  const totalCents = aoeExpeditionCents - discountCents + partnerExperienceCents + otherCents;
  if (totalCents <= 0 || !Number.isSafeInteger(totalCents)) throw new Error('Invalid booking total');
  const dueNowCents = fullPaymentRequired ? totalCents : Math.round(totalCents * DEPOSIT_RATE);
  return { discountCents, partnerExperienceCents, totalCents, dueNowCents, balanceDueCents: totalCents - dueNowCents };
}

/**
 * Owner reconciles verified partner cost/availability after deposit.
 * The customer-facing quote is a ceiling for the agreed itinerary.
 * A lower confirmed total lowers the remaining balance; if below paid deposit,
 * a manual refund/credit is required. No automatic extra charge occurs.
 */
export function reconcileBalance({ quotedTotalCents, confirmedTotalCents, depositPaidCents }) {
  for (const v of [quotedTotalCents, confirmedTotalCents, depositPaidCents]) {
    if (!Number.isSafeInteger(v) || v < 0) throw new Error('Invalid reconciliation amount');
  }
  const customerTotalCents = Math.min(quotedTotalCents, confirmedTotalCents);
  return {
    customerTotalCents,
    balanceDueCents: Math.max(0, customerTotalCents - depositPaidCents),
    manualRefundReviewCents: Math.max(0, depositPaidCents - customerTotalCents),
  };
}
