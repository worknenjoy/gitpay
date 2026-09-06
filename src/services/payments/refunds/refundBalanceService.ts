import Models from '../../../models'
import { findPaymentRequestPayment } from '../../../queries/payment-request/payment-request-payment'
import { findOrCreatePaymentRequestBalance } from '../../../queries/payment-request/payment-request-balance'
import PaymentRequestMail from '../../../mail/paymentRequest'
import { calculateAmountWithPercent } from '../../../utils'
import { sellerClawbackCentsForRefund } from '../../paymentRequest/sellerNetAmount'
import { PaymentRequestTransferStatus } from '../../paymentRequest/paymentRequestTransferStatuses'

const models = Models as any

export type RefundDebitParams = {
  /** The refund's own id (Stripe re_xxx / Whop refund id) — idempotency key */
  refund_id: string
  /** Underlying payment id (Stripe payment_intent id / Whop payment.id) */
  source_id: string
  /** Amount actually refunded, in cents */
  refunded_amount: number
  closedAt?: Date
}

/**
 * Debit PR balance for a refund (cents).
 *
 * Transfer-status-aware:
 * - If the seller already received the money (transfer INITIATED), the full seller-net
 *   portion of the refunded amount is clawed back (not just Gitpay's 8%) — platform
 *   policy is that the seller keeps nothing for a refunded service, regardless of who
 *   initiated the refund (Gitpay's own partial-refund action, an external dashboard
 *   refund, or a Whop auto-refund). See sellerClawbackCentsForRefund for how gross vs.
 *   already-net reported amounts are reconciled.
 * - If the seller was never paid (transfer not yet INITIATED — still settling, or
 *   already blocked by the payment_refunded guard in executePaymentRequestTransfer.ts),
 *   there's nothing of theirs to claw back, but the platform can still have a real,
 *   unrecoverable loss: Whop/Stripe don't return their own processing fee on a refund,
 *   so if refunded_amount exceeds amount_after_fees (the real net the platform actually
 *   received at payment time), that excess is a cost this seller's transaction caused
 *   and is debited from them — even though they were never paid. When amount_after_fees
 *   isn't known (Stripe, or an older Whop row), that loss can't be quantified, so the
 *   debit is 0 — but a record is still created so the seller is notified either way.
 *
 * Idempotent per refund_id (a payment can have multiple distinct refunds, so the
 * refund's own id is the dedupe key — not the payment id).
 * No-op if source_id doesn't resolve to a PaymentRequestPayment (bounty orders, etc).
 */
export const debitRefundForPaymentRequest = async ({
  refund_id,
  source_id,
  refunded_amount,
  closedAt
}: RefundDebitParams) => {
  const paymentRequestPayment = await findPaymentRequestPayment(source_id)
  if (!paymentRequestPayment) {
    console.log(`[refund] not a payment-request payment, skipping balance debit: ${source_id}`)
    return {}
  }

  const paymentRequestUser = paymentRequestPayment.User
  const paymentRequest = paymentRequestPayment.PaymentRequest
  const paymentRequestBalance = await findOrCreatePaymentRequestBalance(paymentRequestUser.id)

  const existingDebit = await models.PaymentRequestBalanceTransaction.findOne({
    where: {
      sourceId: refund_id,
      reason: 'REFUND',
      type: 'DEBIT'
    }
  })
  if (existingDebit) {
    console.log(
      `Skipping duplicate REFUND DEBIT for refund ${refund_id} (existing tx ${existingDebit.id})`
    )
    return existingDebit
  }

  const currency = paymentRequest?.currency || paymentRequestPayment.currency || 'usd'
  const wasTransferred =
    paymentRequestPayment.transferStatus === PaymentRequestTransferStatus.INITIATED

  let clawbackAmount = 0
  let reasonDetails: string

  if (wasTransferred) {
    reasonDetails = 'refund_payment_request_requested_by_customer'
    clawbackAmount = paymentRequest
      ? sellerClawbackCentsForRefund(refunded_amount, {
          paymentRequestPayment,
          paymentRequest,
          currency
        })
      : refunded_amount
  } else {
    reasonDetails = 'refund_before_transfer_processor_fee_not_returned'
    const netAmount = paymentRequestPayment.amount_after_fees
    if (netAmount != null && Number.isFinite(Number(netAmount))) {
      const netAmountCents = calculateAmountWithPercent(
        Number(netAmount),
        0,
        'decimal',
        currency
      ).centavos
      clawbackAmount = Math.max(0, refunded_amount - netAmountCents)
    }
    // else: amount_after_fees unknown — can't quantify a loss, clawbackAmount stays 0,
    // but the transaction record below is still created so the seller is notified.
  }

  const paymentRequestBalanceTransactionForRefund =
    await models.PaymentRequestBalanceTransaction.create({
      sourceId: refund_id,
      paymentRequestBalanceId: paymentRequestBalance.id,
      amount: clawbackAmount > 0 ? -clawbackAmount : 0,
      type: 'DEBIT',
      reason: 'REFUND',
      reason_details: reasonDetails,
      status: 'completed',
      openedAt: closedAt || new Date(),
      closedAt: closedAt || new Date()
    })

  const balanceTransactionUpdated = await models.PaymentRequestBalanceTransaction.findOne({
    where: { id: paymentRequestBalanceTransactionForRefund.id },
    include: [{ model: models.PaymentRequestBalance }]
  })

  PaymentRequestMail.newBalanceTransactionForPaymentRequest(
    paymentRequestUser,
    paymentRequestPayment,
    balanceTransactionUpdated
  ).catch((mailError: any) => {
    console.error(`Failed to send email for Refund ID: ${refund_id}`, mailError)
  })

  return paymentRequestBalanceTransactionForRefund
}
