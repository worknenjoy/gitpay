import { fetchChannelUserCount } from './fetchChannelUserCount'
import {
  countUsers,
  countBounties,
  totalPaidForBounties,
  countPaymentRequests,
  countPaymentRequestPayments,
  totalPaidForPaymentRequests,
  countUserCountries
} from '../../queries/stats'

export async function getInfo() {
  const [
    countTasks,
    bounties,
    users,
    channelUserCount,
    paymentRequestCount,
    paymentRequestPaymentsCount,
    totalPaidForPaymentRequestsAmount,
    userCountriesCount
  ] = await Promise.all([
    countBounties(),
    totalPaidForBounties(),
    countUsers(),
    fetchChannelUserCount(),
    countPaymentRequests(),
    countPaymentRequestPayments(),
    totalPaidForPaymentRequests(),
    countUserCountries()
  ])
  return {
    tasks: countTasks,
    bounties,
    users,
    channelUserCount,
    paymentRequestCount,
    paymentRequestPaymentsCount,
    totalPaidForPaymentRequests: totalPaidForPaymentRequestsAmount,
    userCountriesCount
  }
}
