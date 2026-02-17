import Models from '../../../models'

const models = Models as any

export const findPaymentRequestByPaymentLinkId = async (paymentLinkId: string, options: any = {}) => {
  return models.PaymentRequest.findOne({
    where: {
      payment_link_id: paymentLinkId
    },
    include: [
      {
        model: models.User
      }
    ],
    ...options
  })
}
