import models from '../../models'

const currentModels = models as any

type WalletOrderListParams = {
  walletId: number
  userId?: number
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
    const err: any = new Error('No valid wallet')
    err.status = 404
    throw err
  }

  if (params.userId && Number(wallet.userId) !== Number(params.userId)) {
    const err: any = new Error('Unauthorized')
    err.status = 403
    throw err
  }

  return currentModels.WalletOrder.findAll({
    where: {
      walletId: wallet.id
    },
    order: [['id', 'DESC']]
  })
}
