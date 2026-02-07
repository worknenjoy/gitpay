import Models from '../../src/models'

const models = Models as any

export const PaymentRequestPaymentFactory = async (paramsOverwrite: any = {}) => {
  const defaultParams = {
    amount: 5000,
    currency: 'usd',
    status: 'succeeded',
    paymentRequestId: 1,
    paymentRequestCustomerId: 1
  }
  const paymentRequestPayment = await models.PaymentRequestPayment.create({
    ...defaultParams,
    ...paramsOverwrite
  })
  return paymentRequestPayment
}
