import models from '../../models'

const currentModels = models as any

type PaymentRequestTransferUpdateParams = {
  id: number
  userId?: number
  transfer_method?: string
  status?: string
  value?: string | number
  transfer_id?: string
  [key: string]: any
}

export async function paymentRequestTransferUpdate(
  paymentRequestTransferUpdateParams: PaymentRequestTransferUpdateParams
) {
  const { id, userId, ...updateData } = paymentRequestTransferUpdateParams
  const transfer = await currentModels.PaymentRequestTransfer.findByPk(id)
  if (!transfer) {
    const error: any = new Error('Transfer not found')
    error.StatusCodeError = 404
    throw error
  }

  if (
    userId !== undefined &&
    transfer.userId !== undefined &&
    String(transfer.userId) !== String(userId)
  ) {
    const error: any = new Error('Unauthorized')
    error.StatusCodeError = 403
    throw error
  }

  const allowedUpdates: Record<string, any> = {}
  if (updateData.transfer_method !== undefined) allowedUpdates.transfer_method = updateData.transfer_method
  if (updateData.status !== undefined) allowedUpdates.status = updateData.status
  if (updateData.value !== undefined) allowedUpdates.value = updateData.value
  if (updateData.transfer_id !== undefined) allowedUpdates.transfer_id = updateData.transfer_id

  if (Object.keys(allowedUpdates).length > 0) {
    await transfer.update(allowedUpdates, {
      returning: true
    })
    await transfer.reload()
  }

  return transfer
}

