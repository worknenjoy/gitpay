import models from '../../models'
import { fetchChannelUserCount } from './fetchChannelUserCount'
import {
  countUsers,
  countUserCountries,
  countPaymentRequests,
  countPaymentRequestPayments,
  totalPaidForBounties,
  totalPaidForPaymentRequests
} from '../../queries/stats'

const currentModels = models as any

export interface SyncInfoResult {
  users_count: number
  payment_request_count: number
  payment_requests_payments_count: number
  total_paid_for_bounties_count: number
  total_paid_for_payment_requests_count: number
  total_user_countries_count: number
  slack_channel_users_count: number
}

export async function syncInfo(): Promise<SyncInfoResult> {
  const [
    users_count,
    payment_request_count,
    payment_requests_payments_count,
    total_paid_for_bounties_count,
    total_paid_for_payment_requests_count,
    total_user_countries_count,
    slack_channel_users_count
  ] = await Promise.all([
    countUsers(),
    countPaymentRequests(),
    countPaymentRequestPayments(),
    totalPaidForBounties(),
    totalPaidForPaymentRequests(),
    countUserCountries(),
    fetchChannelUserCount()
  ])

  const stats: SyncInfoResult = {
    users_count,
    payment_request_count,
    payment_requests_payments_count,
    total_paid_for_bounties_count,
    total_paid_for_payment_requests_count,
    total_user_countries_count,
    slack_channel_users_count
  }

  await currentModels.PlatformPublicStats.create(stats)

  return stats
}
