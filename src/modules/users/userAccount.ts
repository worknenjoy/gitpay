import { getDefaultPaymentProviderName } from '../../providers'
import { findUserByIdSimple } from '../../queries/user/findUserByIdSimple'

type UserAccountParams = {
  id: number
}

/**
 * Returns the connected payout account for the current payment provider.
 * Stripe: full Connect account object from Stripe API.
 * Whop: lightweight local representation based on Users.whop_account_id.
 */
export async function userAccount(userParameters: UserAccountParams) {
  const provider = getDefaultPaymentProviderName()

  if (provider === 'whop') {
    const user = await findUserByIdSimple(userParameters.id)
    const whopAccountId = user?.dataValues?.whop_account_id
    if (!whopAccountId) {
      return {}
    }
    return {
      id: whopAccountId,
      object: 'account',
      provider: 'whop',
      email: user?.dataValues?.email,
      country: user?.dataValues?.country,
      // Frontend treats completed accounts as verification-ready; full KYC lives on Whop portal.
      completed: true,
      charges_enabled: true,
      payouts_enabled: true,
      details_submitted: true,
      metadata: {
        internal_user_id: String(userParameters.id)
      }
    }
  }

  const { getUserStripeAccount } = await import('../../queries/user/stripe/getUserStripeAccount')
  return getUserStripeAccount(userParameters.id)
}
