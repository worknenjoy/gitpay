import { getPaymentProvider } from '../../providers'
import { findUserByIdSimple } from '../../queries/user/findUserByIdSimple'

type UserAccountParams = {
  id: number
}

/**
 * Returns the connected payout account for the current payment provider.
 * Stripe: full Connect account object from Stripe API.
 * Whop: lightweight local representation based on Users.whop_account_id.
 *
 * Always includes `provider` and `active` (via PaymentProvider.isConnectedAccountActive)
 * so clients can gate payment requests without provider-specific checks.
 */
export async function userAccount(userParameters: UserAccountParams) {
  const paymentProvider = getPaymentProvider()

  if (paymentProvider.name === 'whop') {
    const user = await findUserByIdSimple(userParameters.id)
    const whopAccountId = user?.dataValues?.whop_account_id
    if (!whopAccountId) {
      return {
        provider: paymentProvider.name,
        active: false
      }
    }
    const account = {
      id: whopAccountId,
      object: 'account',
      provider: paymentProvider.name,
      email: user?.dataValues?.email,
      country: user?.dataValues?.country,
      // Full KYC lives on the Whop portal; connected company id is enough for PR eligibility.
      completed: true,
      charges_enabled: true,
      payouts_enabled: true,
      details_submitted: true,
      metadata: {
        internal_user_id: String(userParameters.id)
      }
    }
    return {
      ...account,
      active: paymentProvider.isConnectedAccountActive(account)
    }
  }

  const { getUserStripeAccount } = await import('../../queries/user/stripe/getUserStripeAccount')
  const account = await getUserStripeAccount(userParameters.id)
  const accountPayload =
    account && typeof account === 'object' && !Array.isArray(account) ? account : {}

  return {
    ...accountPayload,
    provider: paymentProvider.name,
    active: paymentProvider.isConnectedAccountActive(accountPayload as any)
  }
}
