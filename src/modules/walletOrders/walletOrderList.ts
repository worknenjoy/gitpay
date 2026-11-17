import models from '../../models'

const currentModels = models as any

type WalletOrderListParams = {
  walletId: number
  userId: number
}

export async function walletOrderList(params: WalletOrderListParams) {
  const wallet =
    params.walletId &&
    (await currentModels.Wallet.findOne({
      where: {
        id: params.walletId,
        userId: params.userId
      }
    }))

  if (!wallet) {
    return false
  }

  return currentModels.WalletOrder.findAll({
    where: {
      walletId: wallet.id
    },
    order: [['id', 'DESC']]
  })
}
