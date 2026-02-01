import Models from '../../src/models'

const models = Models as any

export const OrderFactory = async (paramsOverwrite: any = {}) => {
  const randomId = Math.random().toString(36).substring(7)
  const defaultParams = {
    source_id: `order_test_${randomId}`,
    provider: 'stripe',
    currency: 'USD',
    amount: 200,
    status: 'open',
    paid: false
  }
  const order = await models.Order.create({ ...defaultParams, ...paramsOverwrite })
  return order
}
