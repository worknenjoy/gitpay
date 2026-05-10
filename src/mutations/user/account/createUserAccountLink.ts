import { findUserByIdSimple } from '../../../queries/user/findUserByIdSimple'
import { createAccountLink } from '../../provider/stripe/user'

type CreateUserAccountLinkParams = {
  id: number
}

export async function createUserAccountLink(userParameters: CreateUserAccountLinkParams) {
  const user = await findUserByIdSimple(userParameters.id)

  if (!user) {
    throw new Error('user.not_found')
  }

  const accountId = user?.dataValues?.account_id

  if (!accountId) {
    throw new Error('user.account.not_found')
  }

  const frontendHost = process.env.FRONTEND_HOST || 'http://localhost:8082'
  const refreshUrl = `${frontendHost}/#/profile/payout-settings/bank-account/account-verification/refresh`
  const returnUrl = `${frontendHost}/#/profile/payout-settings/bank-account/account-verification/return`

  return createAccountLink(accountId, refreshUrl, returnUrl)
}
