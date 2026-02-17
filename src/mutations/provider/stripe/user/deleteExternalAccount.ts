import { getStripeClient } from '../../../../provider/stripe/client'

export const deleteExternalAccount = async (accountId: string, externalAccountId: string) => {
  const stripe = getStripeClient()
  return stripe.accounts.deleteExternalAccount(accountId, externalAccountId)
}
