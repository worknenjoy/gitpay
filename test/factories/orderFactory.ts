import Models from '../../src/models'

const models = Models as any

export const OrderFactory = async (paramsOverwrite: any = {}) => {
  const defaultParams = {
    source_id: '1234',
    provider: 'stripe',
    currency: 'USD',
    amount: 200,
    status: 'open',
    paid: false
  }
  const order = await models.Order.create({ ...defaultParams, ...paramsOverwrite })
  return order
}
