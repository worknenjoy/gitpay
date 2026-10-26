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
    const err: any = new Error('No valid user')
    err.status = 400
    throw err
  }

  const existingWallet = await currentModels.Wallet.findOne({
    where: { id }
  })

  if (!existingWallet) {
    const err: any = new Error('Wallet not found')
    err.status = 404
    throw err
  }

  if (Number(existingWallet.userId) !== Number(userId)) {
    const err: any = new Error('Unauthorized')
    err.status = 403
    throw err
  }

  const updateFields: any = {}
  if (name !== undefined) updateFields.name = name
  if (amount !== undefined) updateFields.balance = Number(amount).toFixed(2)

  const updatedWallet = await existingWallet.update(updateFields)
  return updatedWallet.dataValues
}
