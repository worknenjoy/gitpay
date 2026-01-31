import Models from '../../src/models'

const models = Models as any

export const TransferFactory = async (paramsOverwrite: any = {}) => {
  const defaultParams = {
    amount: 100,
    currency: 'USD',
    status: 'pending',
    provider: 'stripe',
    provider_transfer_id: null
  }
  const transfer = await models.Transfer.create({ ...defaultParams, ...paramsOverwrite })
  return transfer
}
