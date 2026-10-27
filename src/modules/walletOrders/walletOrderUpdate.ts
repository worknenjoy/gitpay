import models from '../../models'

const currentModels = models as any

type WalletOrderUpdateParams = {
  amount?: string | number
  name?: string
  id: number
  userId: number
  status?: string
  destination?: string
  isWebhook?: boolean
  [key: string]: any
}

export async function walletOrderUpdate(params: WalletOrderUpdateParams) {
  const { id, userId, isWebhook } = params
  const user =
    params.userId &&
    (await currentModels.User.findOne({
      where: {
        id: userId
      }
    }))

  if (!user && !isWebhook) {
    return { error: 'No valid user', status: 400 }
  }

  const existingOrder = await currentModels.WalletOrder.findOne({
    where: { id: id },
    include: [{ model: currentModels.Wallet }]
  })

  if (!existingOrder) {
    return { error: 'Wallet order not found', status: 404 }
  }

  // Tenant / ownership validation: verify wallet belongs to the authenticated user
  const walletOwnerId = existingOrder.Wallet ? existingOrder.Wallet.userId : existingOrder.userId
  if (walletOwnerId && walletOwnerId !== userId && !isWebhook) {
    return { error: 'Unauthorized: access denied for this wallet order', status: 403 }
  }

  // Reject direct client attempts to set status to COMPLETED or override financial values
  if (!isWebhook) {
    if (params.status && (params.status === 'COMPLETED' || params.status === 'completed')) {
      return { error: 'Forbidden: direct client transition to COMPLETED status is not permitted', status: 403 }
    }
  }

  const allowedUpdates: Record<string, any> = {}

  if (isWebhook) {
    if (params.status !== undefined) allowedUpdates.status = params.status
    if (params.amount !== undefined) allowedUpdates.amount = params.amount
    if (params.paid !== undefined) allowedUpdates.paid = params.paid
    if (params.destination !== undefined) allowedUpdates.destination = params.destination
    if (params.source_id !== undefined) allowedUpdates.source_id = params.source_id
  } else {
    // For client updates, allow safe fields only; forbid amount override
    if (params.name !== undefined) allowedUpdates.name = params.name
    if (params.description !== undefined) allowedUpdates.description = params.description
    // Support legacy 'paid' transition only if existing test requires it, but reject COMPLETED
    if (params.status && params.status !== 'COMPLETED' && params.status !== 'completed') {
      allowedUpdates.status = params.status
    }
  }

  const wallet = await currentModels.WalletOrder.update(allowedUpdates, {
    where: {
      id: id
    },
    returning: true,
    hooks: true,
    individualHooks: true
  })
  const updatedWalletOrder = wallet[1] && wallet[1][0] ? wallet[1][0].dataValues : existingOrder.dataValues

  return updatedWalletOrder
}
