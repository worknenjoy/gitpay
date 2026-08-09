import Models from '../../../models'

const models = Models as any

const paymentIncludes = [
  { model: models.PaymentRequestCustomer },
  { model: models.PaymentRequest },
  { model: models.User }
]

/**
 * Most recent PaymentRequestPayment for a payment request (any source).
 * Used for Whop dual-event idempotency (membership.activated + payment.succeeded).
 */
export const findPaymentRequestPaymentByPaymentRequestId = async (
  paymentRequestId: number | string
) => {
  return await models.PaymentRequestPayment.findOne({
    where: {
      paymentRequestId
    },
    order: [['id', 'DESC']],
    include: paymentIncludes
  })
}
