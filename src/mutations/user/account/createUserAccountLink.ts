import { findUserByIdSimple } from '../../../queries/user/findUserByIdSimple'
import { createAccountLink } from '../../provider/stripe/user'
import { getDefaultPaymentProviderName, getPaymentProvider } from '../../../providers'
import { getWhopHttpsApiBaseUrl } from '../../../providers/whop/redirectBase'

type CreateUserAccountLinkParams = {
  id: number
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

  const providerName = getDefaultPaymentProviderName()
  const apiHost = getApiBaseUrlForAccountLinks(providerName)
  // Provider redirects here; controllers bounce to FRONTEND_HOST hash routes
  const refreshUrl = `${apiHost}/user/account/verification/refresh`
  const returnUrl = `${apiHost}/user/account/verification/return`

  if (providerName === 'whop') {
    const whopAccountId = user?.dataValues?.whop_account_id
    if (!whopAccountId) {
      throw new Error('user.account.not_found')
    }
    const whop = getPaymentProvider('whop')
    const link = await whop.createAccountLink({
      accountId: whopAccountId,
      refreshUrl,
      returnUrl,
      type: 'account_onboarding'
    })
    return { url: link.url, provider: 'whop', object: 'account_link' }
  }

  const accountId = user?.dataValues?.account_id

  if (!accountId) {
    throw new Error('user.account.not_found')
  }

  return createAccountLink(accountId, refreshUrl, returnUrl)
}
