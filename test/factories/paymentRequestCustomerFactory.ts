import Models from '../../src/models'

const models = Models as any

export const PaymentRequestCustomerFactory = async (paramsOverwrite: any = {}) => {
  const randomId = Math.random().toString(36).substring(7)
  const defaultParams = {
    name: 'Test Customer',
    email: `testcustomer_${randomId}@example.com`,
    sourceId: `src_test_${randomId}`,
    userId: 1
  }
  const paymentRequestCustomer = await models.PaymentRequestCustomer.create({ ...defaultParams, ...paramsOverwrite })
  return paymentRequestCustomer
}
