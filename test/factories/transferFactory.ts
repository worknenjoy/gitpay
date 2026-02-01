import Models from '../../src/models'

const models = Models as any

export const TransferFactory = async (paramsOverwrite: any = {}) => {
  const randomId = Math.random().toString(36).substring(7)
  const defaultParams = {
    status: 'pending',
    transfer_id: `tr_${randomId}`,
    transfer_method: 'stripe'
  }

  const transfer = await models.Transfer.create({ ...defaultParams, ...paramsOverwrite })
  return transfer
}
