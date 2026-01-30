import models from '../../models'

const currentModels = models as any

type WalletFetchParams = {
  userId: number
  id: number
}

export async function walletFetch(params: WalletFetchParams) {
  const user =
    params.userId &&
    (await currentModels.User.findOne({
      where: {
        id: params.userId
      }
    }))

  if (!user) {
    return { error: 'No valid user' }
  }

  const wallet = await currentModels.Wallet.findOne({
    where: {
      id: params.id,
      userId: user.id
    }
  })

  if (!wallet) {
    return { error: 'No valid wallet' }
  }

  return wallet.dataValues
}
