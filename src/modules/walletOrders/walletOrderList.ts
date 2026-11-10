import models from '../../models'

const currentModels = models as any

type WalletOrderListParams = {
  walletId: number
  userId?: number
}

export async function walletOrderList(params: WalletOrderListParams) {
  const where: any = { id: params.walletId }
  if (params.userId) {
    where.userId = params.userId
  }

  const wallet =
    params.walletId &&
    (await currentModels.Wallet.findOne({
      where
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
