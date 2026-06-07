import models from '../../models'

const currentModels = models as any

export type CreatePayoutRecordParams = {
  userId: number
  source_id?: string
  amount: number
  currency?: string
  method?: string
  status?: string
  description?: string
}

export async function createPayoutRecord(params: CreatePayoutRecordParams) {
  if (!params.userId) {
    throw new Error('No userId provided')
  }

  return currentModels.Payout.build({
    source_id: params.source_id,
    userId: params.userId,
    amount: params.amount,
    currency: params.currency || 'usd',
    method: params.method,
    status: params.status || 'initiated',
    description: params.description
  }).save()
}
