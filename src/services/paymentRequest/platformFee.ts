/**
 * Gitpay's platform fee on payment-request payments, as a percent of the gross charge.
 *
 * Kept in its own leaf module (no imports) so both sellerNetAmount.ts and
 * WhopPaymentProvider.ts can import it without creating a cycle through src/providers.
 *
 * The rate is snapshotted onto each PaymentRequest (platform_fee_percent) at creation:
 * a fixed-amount Whop direct-charge plan bakes its application_fee_amount in at that
 * point, and emails/refunds/disputes must use the rate that was actually charged — so
 * always read the rate from the row via getPlatformFeePercent, never from the constants.
 */

/** Gitpay is merchant of record: holds the funds and manages disputes/refunds. */
export const PLATFORM_FEE_PERCENT = 8

/**
 * Whop direct charge: the sale settles on the seller's connected company (seller handles
 * disputes) and Gitpay's cut is collected in the same charge via application_fee_amount.
 */
export const DIRECT_CHARGE_FEE_PERCENT = 5

/** Rate to snapshot onto a NEW payment request. */
export const feePercentForNewPaymentRequest = (directCharge: boolean): number =>
  directCharge ? DIRECT_CHARGE_FEE_PERCENT : PLATFORM_FEE_PERCENT

/**
 * Rate snapshotted on the payment request (what was actually charged). Falls back to
 * PLATFORM_FEE_PERCENT only for objects that don't carry the column (e.g. partial
 * fixtures) — every persisted row has it (NOT NULL, backfilled to 8).
 */
export const getPlatformFeePercent = (
  paymentRequest?: { platform_fee_percent?: number | string | null } | null
): number => {
  const value = Number(paymentRequest?.platform_fee_percent)
  return paymentRequest?.platform_fee_percent != null && Number.isFinite(value)
    ? value
    : PLATFORM_FEE_PERCENT
}

/** Display label, e.g. "Platform Fee (5%)". */
export const platformFeeLabel = (percent: number, label = 'Platform Fee'): string =>
  `${label} (${percent}%)`
