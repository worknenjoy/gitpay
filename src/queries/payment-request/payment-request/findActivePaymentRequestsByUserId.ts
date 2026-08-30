import Models from '../../../models'

const models = Models as any

export const findActivePaymentRequestsByUserId = async (userId: number | string) => {
  return models.PaymentRequest.findAll({
    where: { userId, active: true },
    order: [['createdAt', 'DESC']]
  })
}
