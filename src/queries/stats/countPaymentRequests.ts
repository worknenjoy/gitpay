import Models from '../../models'

const models = Models as any

export const countPaymentRequests = async (): Promise<number> => {
  return models.PaymentRequest.count()
}
