import Models from '../../../models'
import { findPaymentRequestPayment } from '../../../queries/payment-request/payment-request-payment'
import { findOrCreatePaymentRequestBalance } from '../../../queries/payment-request/payment-request-balance'
import PaymentRequestMail from '../../../mail/paymentRequest'
import { calculateAmountWithPercent } from '../../../utils'

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
 * Debit PR balance for a refund (cents): 8% of the actually-refunded amount.
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

  const feeToDeduct = calculateAmountWithPercent(refunded_amount, 8, 'centavos').centavosFee

  const paymentRequestBalanceTransactionForRefund =
    await models.PaymentRequestBalanceTransaction.create({
      sourceId: refund_id,
      paymentRequestBalanceId: paymentRequestBalance.id,
      amount: -feeToDeduct,
      type: 'DEBIT',
      reason: 'REFUND',
      reason_details: 'refund_payment_request_requested_by_customer',
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
