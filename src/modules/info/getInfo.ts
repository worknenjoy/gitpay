import { fetchChannelUserCount } from './fetchChannelUserCount'
import { getLatestStats } from '../../queries/stats'

export async function getInfo() {
  const stats = await getLatestStats()

  if (!stats) {
    return {
      tasks: 0,
      bounties: 0,
      users: 0,
      channelUserCount: await fetchChannelUserCount(),
      paymentRequestCount: 0,
      paymentRequestPaymentsCount: 0,
      totalPaidForPaymentRequests: 0,
      userCountriesCount: 0
    }
  }

  return {
    tasks: stats.payment_request_count,
    bounties: stats.total_paid_for_bounties_count,
    users: stats.users_count,
    channelUserCount: stats.slack_channel_users_count,
    paymentRequestCount: stats.payment_request_count,
    paymentRequestPaymentsCount: stats.payment_requests_payments_count,
    totalPaidForPaymentRequests: stats.total_paid_for_payment_requests_count,
    userCountriesCount: stats.total_user_countries_count
  }
}
