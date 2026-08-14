import { findUserByIdSimple } from '../../../queries/user/findUserByIdSimple'
import { createAccountLink } from '../../provider/stripe/user'
import { getDefaultPaymentProviderName, getPaymentProvider } from '../../../providers'
import { getWhopHttpsApiBaseUrl } from '../../../providers/whop/redirectBase'

type CreateUserAccountLinkParams = {
  id: number
  /** Force a provider (Whop tab passes 'whop', Stripe tab passes 'stripe') */
  provider?: string
  /**
   * What the user is trying to resolve — 'identity' (KYC only, Whop's `account_onboarding`
   * use_case) or 'payout' (the fuller `payouts_portal`: withdrawals, payout methods, and
   * identity too). Only meaningful for Whop; ignored for Stripe. Defaults to 'identity' so
   * omitting it keeps the historical behavior.
   */
  purpose?: string
}

/**
 * Public API origin used as Stripe/Whop return_url / refresh_url.
 * Backend then redirects into FRONTEND_HOST SPA routes (see accountVerificationReturn).
 *
 * Whop requires https://. Prefer WHOP_API_HOST (tunnel to the API) for local dev.
 */
function getApiBaseUrlForAccountLinks(providerName: string): string {
  if (providerName === 'whop') {
    return (
      getWhopHttpsApiBaseUrl() ||
      'https://localhost:3000'
    )
  }

  return (process.env.API_HOST || 'http://localhost:3000').replace(/\/$/, '')
}

export async function createUserAccountLink(userParameters: CreateUserAccountLinkParams) {
  const user = await findUserByIdSimple(userParameters.id)

  if (!user) {
    throw new Error('user.not_found')
  }

  // Prefer the explicit provider (which tab the user is on); otherwise resolve from
  // the user's actual connected account so a legacy Stripe account still generates a
  // Stripe link while the platform default is Whop. This is important when a user has
  // BOTH a legacy Stripe account and a Whop account — the Whop tab must not hit Stripe.
  const hasStripeAccount = Boolean(user?.dataValues?.account_id)
  const hasWhopAccount = Boolean(user?.dataValues?.whop_account_id)
  const requestedProvider = (userParameters.provider || '').toLowerCase()
  const providerName =
    requestedProvider === 'whop' || requestedProvider === 'stripe'
      ? requestedProvider
      : hasWhopAccount && !hasStripeAccount
        ? 'whop'
        : hasStripeAccount
          ? 'stripe'
          : getDefaultPaymentProviderName()
  const apiHost = getApiBaseUrlForAccountLinks(providerName)
  // Provider redirects here; controllers bounce to FRONTEND_HOST hash routes.
  // `provider` is echoed back on the callback so the controller knows which
  // hash route (Stripe's bank-account tab vs Whop's tab) to redirect into.
  const refreshUrl = `${apiHost}/user/account/verification/refresh?provider=${providerName}`
  const returnUrl = `${apiHost}/user/account/verification/return?provider=${providerName}`

  if (providerName === 'whop') {
    const whopAccountId = user?.dataValues?.whop_account_id
    if (!whopAccountId) {
      throw new Error('user.account.not_found')
    }
    const whop = getPaymentProvider('whop')
    // account_onboarding = KYC/identity only; payouts_portal = withdrawals, payout methods,
    // and identity (the superset). See https://docs.whop.com/api-reference/account-links/create-account-link
    const useCase = userParameters.purpose === 'payout' ? 'payouts_portal' : 'account_onboarding'
    const link = await whop.createAccountLink({
      accountId: whopAccountId,
      refreshUrl,
      returnUrl,
      type: useCase
    })
    return { url: link.url, provider: 'whop', object: 'account_link' }
  }

  const accountId = user?.dataValues?.account_id

  if (!accountId) {
    throw new Error('user.account.not_found')
  }

  return createAccountLink(accountId, refreshUrl, returnUrl)
}
