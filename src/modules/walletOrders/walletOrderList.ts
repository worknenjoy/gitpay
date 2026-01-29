import models from '../../models'

const currentModels = models as any

type WalletOrderListParams = {
  walletId: number
}

export async function walletOrderList(params: WalletOrderListParams) {
  const wallet =
    params.walletId &&
    (await currentModels.Wallet.findOne({
      where: {
        id: params.walletId
      }
    }))

  if (!wallet) {
    return { error: 'No valid wallet' }
  }

  return currentModels.WalletOrder.findAll({
    where: {
      walletId: wallet.id
    },
    order: [['id', 'DESC']]
  })
}
