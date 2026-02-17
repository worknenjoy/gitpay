import { retrieveBalance as providerRetrieveBalance } from '../../../../provider/stripe/user'

export const retrieveBalance = async (accountId?: string) => {
  return providerRetrieveBalance(accountId)
}
