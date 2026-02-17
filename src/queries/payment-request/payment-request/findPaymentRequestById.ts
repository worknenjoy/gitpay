import Models from '../../../models'

const models = Models as any

export const findPaymentRequestById = async (paymentRequestId: number | string, options: any = {}) => {
  return models.PaymentRequest.findByPk(paymentRequestId, options)
}
