import { retrieveBalance } from '../../provider/stripe/balance'

export const getUserStripeBalance = async (accountId: string) => {
  return retrieveBalance(accountId)
}
