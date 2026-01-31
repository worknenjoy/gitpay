import Models from '../../src/models'

const models = Models as any

export const PaymentRequestCustomerFactory = async (paramsOverwrite: any = {}) => {
  const defaultParams = {
    name: 'Test Customer',
    email: 'testcustomer@example.com',
    sourceId: 'src_test_123',
    userId: 1
  }
  const paymentRequestCustomer = await models.PaymentRequestCustomer.create({ ...defaultParams, ...paramsOverwrite })
  return paymentRequestCustomer
}
