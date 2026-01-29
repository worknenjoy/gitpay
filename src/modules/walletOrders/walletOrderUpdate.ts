import models from '../../models'

const currentModels = models as any

type WalletOrderUpdateParams = {
  amount?: string | number
  name?: string
  id: number
  userId: number
  [key: string]: any
}

export async function walletOrderUpdate(params: WalletOrderUpdateParams) {
  const { amount, name, id, userId } = params
  const user =
    params.userId &&
    (await currentModels.User.findOne({
      where: {
        id: userId
      }
    }))

  if (!user) {
    return { error: 'No valid user' }
  }

  const wallet = await currentModels.WalletOrder.update(params, {
    where: {
      id: id
    },
    returning: true,
    hooks: true,
    individualHooks: true
  })
  const updatedWalletOrder = wallet[1][0].dataValues

  return updatedWalletOrder
}
