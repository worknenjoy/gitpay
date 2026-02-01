import Models from '../../src/models'

const models = Models as any

export const PaymentRequestBalanceTransactionFactory = async (paramsOverwrite: any = {}) => {
  const randomId = Math.random().toString(36).substring(7)
  const defaultParams = {
    amount: '100',
    currency: 'usd',
    sourceId: `txn_test_${randomId}`,
    type: 'CREDIT',
    reason: 'ADJUSTMENT',
    reason_details: 'Test transaction',
    status: 'completed',
    paymentRequestBalanceId: 1
  }
  const paymentRequestBalanceTransaction = await models.PaymentRequestBalanceTransaction.create({ ...defaultParams, ...paramsOverwrite })
  return paymentRequestBalanceTransaction
}
