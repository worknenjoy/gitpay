import Models from '../../src/models'

const models = Models as any

export const TransferFactory = async (paramsOverwrite: any = {}) => {
  const randomId = Math.random().toString(36).substring(7)
  const defaultParams = {
    status: 'pending',
    transfer_id: `tr_${randomId}`,
    transfer_method: 'stripe'
  }
  
  // Map 'amount' to 'value' if provided (for backward compatibility)
  if (paramsOverwrite.amount !== undefined && paramsOverwrite.value === undefined) {
    paramsOverwrite.value = paramsOverwrite.amount
    delete paramsOverwrite.amount
  }
  
  const transfer = await models.Transfer.create({ ...defaultParams, ...paramsOverwrite })
  return transfer
}
