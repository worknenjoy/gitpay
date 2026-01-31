import Models from '../../src/models'

const models = Models as any

export const WalletFactory = async (paramsOverwrite: any = {}) => {
  const defaultParams = {
    name: 'Test Wallet',
    balance: 0,
    userId: 1
  }
  const wallet = await models.Wallet.create({ ...defaultParams, ...paramsOverwrite })
  return wallet
}
