import models from '../../models'

const currentModels = models as any

type WalletUpdateParams = {
  userId: number
  id: number
  amount?: number
  name?: string
}

export async function walletUpdate(params: WalletUpdateParams) {
  const { amount, name, id, userId } = params
  const user =
    userId &&
    (await currentModels.User.findOne({
      where: {
        id: userId
      }
    }))

  if (!user) {
    return { error: 'No valid user' }
  }

  const updateFields: any = {}
  if (name !== undefined) {
    updateFields.name = name
  }
  if (amount !== undefined) {
    updateFields.balance = amount
  }

  const wallet = await currentModels.Wallet.update(
    updateFields,
    {
      where: {
        id,
        userId
      },
      returning: true
    }
  )

  if (!wallet || !wallet[0] || !wallet[1] || wallet[1].length === 0) {
    return { error: 'No valid wallet' }
  }

  return wallet[1][0].dataValues
}
