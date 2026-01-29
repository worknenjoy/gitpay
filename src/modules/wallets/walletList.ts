import models from '../../models'

const currentModels = models as any

type WalletListParams = {
  userId: number
}

export async function walletList(params: WalletListParams) {
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

  return currentModels.Wallet.findAll({
    where: {
      userId: user.id
    },
    hooks: true,
    individualHooks: true
  })
}
