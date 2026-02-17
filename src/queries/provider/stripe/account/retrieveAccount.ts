import { retrieveAccount as providerRetrieveAccount } from '../../../../provider/stripe/user'

export const retrieveAccount = async (accountId: string) => {
  return providerRetrieveAccount(accountId)
}
