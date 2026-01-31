import Models from '../../src/models'

const models = Models as any

export const PaymentRequestTransferFactory = async (paramsOverwrite: any = {}) => {
  const randomId = Math.random().toString(36).substring(7)
  const defaultParams = {
    transfer_id: `tr_test_${randomId}`,
    transfer_method: 'stripe',
    amount: 5000,
    currency: 'usd',
    status: 'pending',
    paymentRequestId: 1
  }
  const paymentRequestTransfer = await models.PaymentRequestTransfer.create({ ...defaultParams, ...paramsOverwrite })
  return paymentRequestTransfer
}
