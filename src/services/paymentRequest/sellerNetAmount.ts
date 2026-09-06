import { calculateAmountWithPercent } from '../../utils'
import { getPaymentProvider } from '../../providers'

export type SellerNetAmountResult = {
  /** Fee base before Gitpay's 8% cut: Whop's amount_after_fees when known, else gross. */
  feeBaseDecimal: number
  /** feeBaseDecimal, kept as a decimal for display use (transfer-initiated email, etc). */
  originalAmountDecimal: number
  /** What the seller actually receives (or would receive): feeBaseDecimal minus Gitpay's 8%. */
  netAmountDecimal: number
  netAmountCents: number
}

/**
 * What the seller receives (or would receive) for a payment-request payment, after:
 * - Whop's own processing fee (via amount_after_fees, when known — real per-transaction
 *   deduction reported by Whop at payment time, not a flat estimate)
 * - Gitpay's 8% platform commission
 *
 * Shared by the transfer calculation (executePaymentRequestTransfer.ts) and the refund
 * amount calculation (paymentRequestPaymentRefund.ts) so the two can't drift apart —
 * "what the seller gets paid" and "what a refund excludes" must be the same number.
 */
export function computeSellerNetAmount(params: {
  paymentRequestPayment: {
    amount: string | number
    amount_after_fees?: string | number | null
  }
  paymentRequest: {
    amount: string | number
    custom_amount: boolean
    provider?: string | null
  }
  currency: string
}): SellerNetAmountResult {
  const { paymentRequestPayment, paymentRequest, currency } = params
  const paymentProviderName = paymentRequest.provider || getPaymentProvider().name

  let feeBaseDecimal: number
  const whopNet = paymentRequestPayment.amount_after_fees
  if (
    paymentProviderName === 'whop' &&
    whopNet != null &&
    Number.isFinite(Number(whopNet)) &&
    Number(whopNet) >= 0
  ) {
    feeBaseDecimal = Number(whopNet)
  } else if (paymentRequest.custom_amount) {
    feeBaseDecimal = Number(paymentRequestPayment.amount)
  } else {
    feeBaseDecimal = Number(paymentRequest.amount)
  }

  const originalAmount = calculateAmountWithPercent(feeBaseDecimal, 0, 'decimal', currency)
  const amountAfterFee = calculateAmountWithPercent(feeBaseDecimal, 8, 'decimal', currency)

  return {
    feeBaseDecimal,
    originalAmountDecimal: originalAmount.decimal,
    netAmountDecimal: amountAfterFee.decimal,
    netAmountCents: amountAfterFee.centavos
  }
}

/**
 * How much to claw back from the seller's balance for a reported refund, in cents.
 *
 * `refundedAmountCents` can mean two different things depending on who initiated the
 * refund, and this reconciles both without needing to know which:
 * - Gitpay-initiated (via paymentRequestPaymentRefund.ts, post fee-exclusion fix): the
 *   webhook reports exactly what the seller received/would receive — computeSellerNetAmount's
 *   own netAmountCents. Clawing back all of it is exactly correct, no further scaling.
 * - Externally-initiated (seller refunds directly on the provider dashboard, or a Whop
 *   auto-refund): the webhook reports a gross, customer-facing amount — which may be the
 *   full charge or a smaller partial. That gross figure is scaled down by the same
 *   amount_after_fees / amount ratio (a no-op when unknown, e.g. Stripe) to find the
 *   seller's corresponding net share.
 *
 * Either way, the result is capped at the seller's full net take for this payment — never
 * claw back more than they could have received in the first place.
 */
export function sellerClawbackCentsForRefund(
  refundedAmountCents: number,
  params: {
    paymentRequestPayment: {
      amount: string | number
      amount_after_fees?: string | number | null
    }
    paymentRequest: {
      amount: string | number
      custom_amount: boolean
      provider?: string | null
    }
    currency: string
  }
): number {
  const { paymentRequestPayment, currency } = params
  const fullNetCents = computeSellerNetAmount(params).netAmountCents

  // Already at or beyond the seller's full net take (Gitpay-initiated exact match, or an
  // externally-initiated full/over refund) — cap there, don't try to scale it further.
  if (refundedAmountCents >= fullNetCents) {
    return fullNetCents
  }

  // Smaller than the seller's net take: treat as a gross, externally-initiated partial
  // and scale it down to the seller's corresponding net share.
  const fullGrossCents = calculateAmountWithPercent(
    Number(paymentRequestPayment.amount),
    0,
    'decimal',
    currency
  ).centavos
  if (!Number.isFinite(fullGrossCents) || fullGrossCents <= 0) {
    return refundedAmountCents
  }
  const ratio = fullNetCents / fullGrossCents
  return Math.round(refundedAmountCents * ratio)
}
