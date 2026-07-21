import { findUserByIdSimple } from '../../../queries/user/findUserByIdSimple'
import { createAccountLink } from '../../provider/stripe/user'
import { getDefaultPaymentProviderName, getPaymentProvider } from '../../../providers'

type CreateUserAccountLinkParams = {
  id: number
}

export async function createUserAccountLink(userParameters: CreateUserAccountLinkParams) {
  const user = await findUserByIdSimple(userParameters.id)

  if (!user) {
    throw new Error('user.not_found')
  }

  const frontendHost = process.env.FRONTEND_HOST || 'http://localhost:8082'
  const refreshUrl = `${frontendHost}/#/profile/payout-settings/bank-account/account-verification/refresh`
  const returnUrl = `${frontendHost}/#/profile/payout-settings/bank-account/account-verification/return`

  const providerName = getDefaultPaymentProviderName()

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
