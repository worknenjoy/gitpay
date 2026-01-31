import Models from '../../src/models'

const models = Models as any

export const PaymentRequestBalanceTransactionFactory = async (paramsOverwrite: any = {}) => {
  const defaultParams = {
    amount: '100',
    currency: 'usd',
    sourceId: 'txn_test123',
    type: 'CREDIT',
    reason: 'ADJUSTMENT',
    reason_details: 'Test transaction',
    status: 'completed',
    paymentRequestBalanceId: 1
  }
  const paymentRequestBalanceTransaction = await models.PaymentRequestBalanceTransaction.create({ ...defaultParams, ...paramsOverwrite })
  return paymentRequestBalanceTransaction
}
