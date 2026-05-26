import Models from '../../models'

const models = Models as any

export const countPaymentRequestPayments = async (): Promise<number> => {
  return models.PaymentRequestPayment.count()
}
