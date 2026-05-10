import { getStripeClient } from '../../../../provider/stripe/client'

export const createAccountLink = async (
  accountId: string,
  refreshUrl: string,
  returnUrl: string
) => {
  const stripe = getStripeClient()
  return stripe.accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: 'account_onboarding'
  })
}
