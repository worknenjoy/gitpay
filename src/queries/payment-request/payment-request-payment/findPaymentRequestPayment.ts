import Models from '../../../models'

const models = Models as any

export const findPaymentRequestPayment = async (sourceId: string) => {
  return await models.PaymentRequestPayment.findOne({
    where: {
      source: sourceId
    },
    include: [
      {
        model: models.PaymentRequestCustomer
      },
      {
        model: models.PaymentRequest
      },
      {
        model: models.User
      }
    ]
  })
}
