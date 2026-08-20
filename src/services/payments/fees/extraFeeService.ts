import Models from '../../../models'
import { findPaymentRequestPayment } from '../../../queries/payment-request/payment-request-payment'
import { findOrCreatePaymentRequestBalance } from '../../../queries/payment-request/payment-request-balance'
import PaymentRequestMail from '../../../mail/paymentRequest'

const models = Models as any

/**
 * Whop's Early Dispute Alerts fee, charged per-alert independently of what happens
 * next (auto-refund, formal dispute, or nothing). Whop does not expose this amount
 * anywhere in the dispute/dispute-alert API or webhook payloads (unlike Stripe's
 * balance_transactions[0].fee), so this is a plain constant, not env-configurable.
 * Sourced from third-party research, not Whop's own pricing docs — verify against a
 * real Whop invoice and adjust here directly if the real number differs.
 */
export const WHOP_DISPUTE_ALERT_FEE_CENTS = 2900

export type ExtraFeeDebitParams = {
  /** The unique id of the fee-triggering event (e.g. the dispute alert's own id) — idempotency key */
  source_id: string
  /** Underlying payment id (Whop payment.id) — used to resolve the PaymentRequestPayment */
  payment_source_id: string
  /** Fee amount, in cents */
  amount: number
  reason_details: string
  closedAt?: Date
}

/**
 * Debit PR balance for an extra platform fee (cents) unrelated to a dispute or refund
 * amount itself — currently used for Whop's per-alert Early Dispute Alerts fee.
 * Idempotent per source_id. No-op if payment_source_id doesn't resolve to a
 * PaymentRequestPayment.
 */
export const debitExtraFeeForPaymentRequest = async ({
  source_id,
  payment_source_id,
  amount,
  reason_details,
  closedAt
}: ExtraFeeDebitParams) => {
  const paymentRequestPayment = await findPaymentRequestPayment(payment_source_id)
  if (!paymentRequestPayment) {
    console.log(
      `[extra-fee] not a payment-request payment, skipping balance debit: ${payment_source_id}`
    )
    return {}
  }

  const paymentRequestUser = paymentRequestPayment.User
  const paymentRequestBalance = await findOrCreatePaymentRequestBalance(paymentRequestUser.id)

  const existingDebit = await models.PaymentRequestBalanceTransaction.findOne({
    where: {
      sourceId: source_id,
      reason: 'EXTRA_FEE',
      type: 'DEBIT'
    }
  })
  if (existingDebit) {
    console.log(
      `Skipping duplicate EXTRA_FEE DEBIT for source ${source_id} (existing tx ${existingDebit.id})`
    )
    return existingDebit
  }

  const paymentRequestBalanceTransactionForFee =
    await models.PaymentRequestBalanceTransaction.create({
      sourceId: source_id,
      paymentRequestBalanceId: paymentRequestBalance.id,
      amount: -amount,
      type: 'DEBIT',
      reason: 'EXTRA_FEE',
      reason_details: reason_details,
      status: 'completed',
      openedAt: closedAt || new Date(),
      closedAt: closedAt || new Date()
    })

  const balanceTransactionUpdated = await models.PaymentRequestBalanceTransaction.findOne({
    where: { id: paymentRequestBalanceTransactionForFee.id },
    include: [{ model: models.PaymentRequestBalance }]
  })

  PaymentRequestMail.newBalanceTransactionForPaymentRequest(
    paymentRequestUser,
    paymentRequestPayment,
    balanceTransactionUpdated
  ).catch((mailError: any) => {
    console.error(`Failed to send email for extra fee, source: ${source_id}`, mailError)
  })

  return paymentRequestBalanceTransactionForFee
}
