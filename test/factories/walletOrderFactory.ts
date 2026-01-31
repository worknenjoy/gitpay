import Models from '../../src/models'

const models = Models as any

export const WalletOrderFactory = async (paramsOverwrite: any = {}) => {
  const defaultParams = {
    walletId: 1,
    source_id: 'wo_test123',
    currency: 'USD',
    amount: 100,
    status: 'pending',
    paid: false
  }
  const walletOrder = await models.WalletOrder.create({ ...defaultParams, ...paramsOverwrite })
  return walletOrder
}
