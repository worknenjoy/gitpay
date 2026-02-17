import { Stripe } from 'stripe'

import { listExternalAccounts as providerListExternalAccounts } from '../../../../provider/stripe/user'

export const listExternalAccounts = async (
  accountId: string,
  params: Stripe.AccountListExternalAccountsParams
) => {
  return providerListExternalAccounts(accountId, params)
}
