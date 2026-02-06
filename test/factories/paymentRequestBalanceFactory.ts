import Models from '../../src/models'

const models = Models as any

export const PaymentRequestBalanceFactory = async (paramsOverwrite: any = {}) => {
  const defaultParams = {
    balance: 0,
    paymentRequestCustomerId: 1
  }
  const paymentRequestBalance = await models.PaymentRequestBalance.create({
    ...defaultParams,
    ...paramsOverwrite
  })
  return paymentRequestBalance
}
