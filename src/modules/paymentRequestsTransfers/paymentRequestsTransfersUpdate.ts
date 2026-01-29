import models from '../../models'

const currentModels = models as any

type PaymentRequestTransferUpdateParams = {
  id: number
  [key: string]: any
}

export async function paymentRequestTransferUpdate(paymentRequestTransferUpdateParams: PaymentRequestTransferUpdateParams) {
  const { id, ...updateData } = paymentRequestTransferUpdateParams
  const transfer = await currentModels.PaymentRequestTransfer.findByPk(id)
  if (!transfer) {
    throw new Error('Transfer not found')
  }
  await transfer.update(updateData, {
    returning: true
  })
  transfer.reload()
  return transfer
}
