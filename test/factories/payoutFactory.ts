import Models from '../../src/models'

const models = Models as any

export const PayoutFactory = async (paramsOverwrite: any = {}) => {
  const defaultParams = {
    source_id: 'po_test123',
    method: 'stripe',
    amount: 100,
    currency: 'usd',
    status: 'initiated',
    paid: false
  }
  const payout = await models.Payout.create({ ...defaultParams, ...paramsOverwrite })
  return payout
}
