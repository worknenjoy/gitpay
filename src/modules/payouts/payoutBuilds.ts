import { createPayoutRecord, CreatePayoutRecordParams } from '../../mutations/payout/createPayoutRecord'

type PayoutBuildsParams = Omit<CreatePayoutRecordParams, 'amount'> & { amount?: number }

export async function payoutBuilds(params: PayoutBuildsParams) {
  if (!params.userId) {
    return { error: 'No userId' }
  }

  try {
    return await createPayoutRecord(params as CreatePayoutRecordParams)
  } catch (err: any) {
    return { error: err.message }
  }
}
