import models from '../../models'

const currentModels = models as any

type WalletBuildsParams = {
  userId: number
  name: string
}

export async function walletBuilds(params: WalletBuildsParams) {
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

  return currentModels.Wallet.create({
    userId: user.id,
    name: params.name,
    balance: 0
  })
}
