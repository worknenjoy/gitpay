import models from '../../models'

const currentModels = models as any

type TransferBuildsParams = {
  userId?: number
  paymentRequestId?: number
  amount?: number
  currency?: string
  status?: string
  method?: string
  [key: string]: any
}

export async function paymentRequestTransferBuilds(params: TransferBuildsParams) {
  const paymentRequestTransfer = await currentModels.PaymentRequestTransfer.create(params)
  return paymentRequestTransfer
}
