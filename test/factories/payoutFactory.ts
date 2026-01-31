import Models from '../../src/models'

const models = Models as any

export const PayoutFactory = async (paramsOverwrite: any = {}) => {
  const randomId = Math.random().toString(36).substring(7)
  const defaultParams = {
    source_id: `po_test_${randomId}`,
    method: 'stripe',
    amount: 100,
    currency: 'usd',
    status: 'initiated',
    paid: false
  }
  const payout = await models.Payout.create({ ...defaultParams, ...paramsOverwrite })
  return payout
}
