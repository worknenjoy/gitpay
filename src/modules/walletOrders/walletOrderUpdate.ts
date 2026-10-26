import models from '../../models'

const currentModels = models as any

type WalletOrderUpdateParams = {
  amount?: string | number
  name?: string
  description?: string
  id: number
  userId: number
  [key: string]: any
}

export async function walletOrderUpdate(params: WalletOrderUpdateParams) {
  const { name, description, id, userId } = params
  const user =
    userId &&
    (await currentModels.User.findOne({
      where: {
        id: userId
      }
    }))

  if (!user) {
    const error: any = new Error('No valid user')
    error.StatusCodeError = 401
    throw error
  }

  const existingOrder = await currentModels.WalletOrder.findOne({
    where: {
      id: id
    },
    include: [
      {
        model: currentModels.Wallet
      }
    ]
  })

  if (!existingOrder) {
    const error: any = new Error('Wallet order not found')
    error.StatusCodeError = 404
    throw error
  }

  const orderWallet =
    existingOrder.Wallet ||
    (await currentModels.Wallet.findOne({
      where: {
        id: existingOrder.walletId
      }
    }))

  if (!orderWallet || String(orderWallet.userId) !== String(userId)) {
    const error: any = new Error('Unauthorized')
    error.StatusCodeError = 403
    throw error
  }

  const allowedUpdates: Record<string, any> = {}
  if (description !== undefined) {
    allowedUpdates.description = description
  } else if (name !== undefined) {
    allowedUpdates.description = name
  }

  if (Object.keys(allowedUpdates).length > 0) {
    await currentModels.WalletOrder.update(allowedUpdates, {
      where: {
        id: id
      },
      returning: true,
      hooks: true,
      individualHooks: true
    })
  }

  const updatedWalletOrder = await currentModels.WalletOrder.findOne({
    where: {
      id: id
    }
  })

  return updatedWalletOrder ? updatedWalletOrder.dataValues : existingOrder.dataValues
}
