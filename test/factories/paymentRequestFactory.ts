import Models from '../../src/models'

const models = Models as any

export const PaymentRequestFactory = async (paramsOverwrite: any = {}) => {
  const defaultParams = {
    active: true,
    deactivate_after_payment: false,
    currency: 'usd',
    amount: 5000,
    custom_amount: false,
    title: 'Test Payment Request',
    description: 'A test payment request',
    status: 'open',
    transfer_status: 'pending_payment',
    userId: 1
  }
  const paymentRequest = await models.PaymentRequest.create({ ...defaultParams, ...paramsOverwrite })
  return paymentRequest
}
