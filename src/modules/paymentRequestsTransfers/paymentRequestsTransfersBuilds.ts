import models from '../../models'

const currentModels = models as any

type TransferBuildsParams = {
  userId?: number
  paymentRequestId?: number
  value?: number | string
  currency?: string
  status?: string
  transfer_id?: string
  transfer_method?: string
  [key: string]: any
}

export async function paymentRequestTransferBuilds(params: TransferBuildsParams) {
  const {
    userId,
    paymentRequestId,
    value,
    status = 'pending',
    transfer_id,
    transfer_method
  } = params

  const paymentRequestTransfer = await currentModels.PaymentRequestTransfer.create({
    userId,
    paymentRequestId,
    value,
    status,
    transfer_id,
    transfer_method
  })
  return paymentRequestTransfer
}

