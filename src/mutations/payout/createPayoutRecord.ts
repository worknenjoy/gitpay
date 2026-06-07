import models from '../../models'
import { findPayoutBySourceId } from '../../queries/payout/findPayoutBySourceId'

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

  if (params.source_id) {
    const existing = await findPayoutBySourceId(params.source_id)
    if (existing) {
      throw new Error('This payout already exists')
    }
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
