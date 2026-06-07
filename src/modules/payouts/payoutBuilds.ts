import {
  createPayoutRecord,
  CreatePayoutRecordParams
} from '../../mutations/payout/createPayoutRecord'
import { findPayoutBySourceId } from '../../queries/payout/findPayoutBySourceId'

type PayoutBuildsParams = Omit<CreatePayoutRecordParams, 'amount'> & { amount?: number }

export async function payoutBuilds(params: PayoutBuildsParams) {
  if (!params.userId) {
    return { error: 'No userId' }
  }

  if (params.source_id) {
    const existing = await findPayoutBySourceId(params.source_id)
    if (existing) {
      return { error: 'This payout already exists' }
    }
  }

  try {
    return await createPayoutRecord(params as CreatePayoutRecordParams)
  } catch (err: any) {
    return { error: err.message }
  }
}
