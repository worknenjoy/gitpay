import Models from '../../../models'

const models = Models as any

export const findPaymentRequest = async (paymentRequestId: number) => {
  return models.PaymentRequest.findByPk(paymentRequestId, {
    include: [
      {
        model: models.User
      }
    ]
  })
}
