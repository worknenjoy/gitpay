import { findPayoutById } from '../../queries/payout/findPayoutById'

export type UpdatePayoutRecordParams = {
  id: number
  status?: string
  paid?: boolean
  arrival_date?: number
  reference_number?: string
}

export async function updatePayoutRecord(params: UpdatePayoutRecordParams) {
  const payout = await findPayoutById(params.id)
  if (!payout) {
    throw new Error(`Payout ${params.id} not found`)
  }

  const updates: Record<string, any> = {}
  if (params.status !== undefined) updates.status = params.status
  if (params.paid !== undefined) updates.paid = params.paid
  if (params.arrival_date !== undefined) updates.arrival_date = params.arrival_date
  if (params.reference_number !== undefined) updates.reference_number = params.reference_number

  return payout.update(updates)
}
