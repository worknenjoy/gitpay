import { findPayoutsByUserId } from '../../queries/payout/findPayoutsByUserId'

type PayoutSearchParams = {
  userId?: number
}

export async function payoutSearch(params: PayoutSearchParams = {}) {
  if (!params.userId) return []
  return findPayoutsByUserId(params.userId)
}
