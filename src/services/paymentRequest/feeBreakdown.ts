import { calculateAmountWithPercent } from '../../utils'
import { getPlatformFeePercent } from './platformFee'
import { computeSellerNetAmount } from './sellerNetAmount'

/**
 * Display breakdown of one payment-request payment, in major currency units:
 *
 *   gross − processingFee − platformFee = net
 *
 * Any part that isn't known yet is null (e.g. Whop hasn't reported amount_after_fees).
 * Single source for the payout emails and the payment details drawer, so both always
 * show the same rows.
 */
export type PaymentFeeBreakdown = {
  gross: number
  /** Payment processor's own cut (Whop processing). null when unknown or zero. */
  processingFee: number | null
  /** Gitpay's platform fee. null when it can't be isolated yet. */
  platformFee: number | null
  /** Rate snapshotted on the payment request. */
  platformFeePercent: number
  /** What the seller receives. null while still unknown (direct charge awaiting Whop's net). */
  net: number | null
  directCharge: boolean
}

type BreakdownParams = {
  paymentRequestPayment: {
    amount: string | number
    amount_after_fees?: string | number | null
    provider_fee_amount?: string | number | null
    destination_account_id?: string | null
  }
  paymentRequest: {
    amount: string | number
    custom_amount: boolean
    provider?: string | null
    platform_fee_percent?: number | string | null
  }
  currency: string
}

const knownNumber = (value: unknown): number | null => {
  if (value == null || value === '') return null
  const n = Number(value)
  return Number.isFinite(n) && n >= 0 ? n : null
}

export function computePaymentFeeBreakdown(params: BreakdownParams): PaymentFeeBreakdown {
  const { paymentRequestPayment, paymentRequest, currency } = params
  const round = (value: number) => calculateAmountWithPercent(value, 0, 'decimal', currency).decimal
  const positiveOrNull = (value: number | null) =>
    value != null && round(value) > 0 ? round(value) : null

  const platformFeePercent = getPlatformFeePercent(paymentRequest)
  const gross = round(Number(paymentRequestPayment.amount) || 0)
  const directCharge = Boolean(paymentRequestPayment.destination_account_id)

  if (directCharge) {
    // Gitpay's fee was collected inside the charge (application_fee_amount, reported back
    // as provider_fee_amount), and amount_after_fees is already net of both cuts.
    const net = knownNumber(paymentRequestPayment.amount_after_fees)
    const reportedPlatformFee = knownNumber(paymentRequestPayment.provider_fee_amount)
    const platformFee =
      reportedPlatformFee ??
      calculateAmountWithPercent(gross, platformFeePercent, 'decimal', currency).decimalFee
    return {
      gross,
      processingFee: net != null ? positiveOrNull(gross - net - platformFee) : null,
      platformFee: round(platformFee),
      platformFeePercent,
      net: net != null ? round(net) : null,
      directCharge
    }
  }

  // Platform flow: Gitpay receives the payment (net of the processor's cut when Whop
  // reports it) and takes its fee on that base before paying the seller out.
  const sellerNet = computeSellerNetAmount(params)
  return {
    gross,
    processingFee: positiveOrNull(gross - sellerNet.feeBaseDecimal),
    platformFee: round(sellerNet.feeBaseDecimal - sellerNet.netAmountDecimal),
    platformFeePercent,
    net: sellerNet.netAmountDecimal,
    directCharge
  }
}
