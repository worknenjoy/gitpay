import Models from '../../../../models'
import { findPaymentRequestPayment } from '../../../../queries/payment-request/payment-request-payment'
import { debitRefundForPaymentRequest } from '../../../../services/payments/refunds/refundBalanceService'

const models = Models as any

export type ChargeRefundedPaymentRequestParams = {
  payment_intent_id: string
  /** This specific refund's own amount (not the charge's cumulative amount_refunded) */
  refund_amount: number | undefined
  refund_id: string | undefined
}

/**
 * Marks the PR payment refunded and delegates the balance clawback to the shared
 * refund service. Resolves the payment by source (PaymentRequestPayment.source =
 * payment_intent id), not by PaymentIntent metadata — this matches how the dispute
 * flow already resolves payments, and means it works even when metadata wasn't set.
 */
export const handleChargeRefundedPaymentRequest = async ({
  payment_intent_id,
  refund_amount,
  refund_id
}: ChargeRefundedPaymentRequestParams) => {
  const paymentRequestPayment = await findPaymentRequestPayment(payment_intent_id)
  if (!paymentRequestPayment) {
    return
  }

  await models.PaymentRequestPayment.update(
    { status: 'refunded' },
    { where: { id: paymentRequestPayment.id } }
  )

  if (!refund_id || refund_amount == null) {
    console.warn(
      `[refund] charge.refunded missing refund id/amount for payment_intent ${payment_intent_id}`
    )
    return
  }

  await debitRefundForPaymentRequest({
    refund_id,
    source_id: payment_intent_id,
    refunded_amount: refund_amount
  })
}
