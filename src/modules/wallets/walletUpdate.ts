import models from '../../models'

const currentModels = models as any

type WalletUpdateParams = {
  userId: number
  id: number
  amount: number
  name: string
}

export async function walletUpdate(params: WalletUpdateParams) {
  const { amount, name, id } = params
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

  const wallet = await currentModels.Wallet.update(
    {
      balance: amount,
      name: name
    },
    {
      where: {
        id: id
      },
      returning: true
    }
  )
  return wallet[1][0].dataValues
}
