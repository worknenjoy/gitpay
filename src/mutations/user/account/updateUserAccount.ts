import ip from 'ip'

import { findUserByIdSimple } from '../../../queries/user/findUserByIdSimple'
import { updateAccount } from '../../provider/stripe/user'

type UserAccountUpdateParams = {
  userParams: {
    id: number
  }
  accountParams: any
}

export async function updateUserAccount({ userParams, accountParams }: UserAccountUpdateParams) {
  if (accountParams?.['tos_acceptance[date]']) {
    accountParams['tos_acceptance[ip]'] = ip.address()
  }

  const user = await findUserByIdSimple(userParams.id)

  if (!user?.dataValues?.account_id) {
    return { error: 'You need to be logged to update account' }
  }

  if (!user?.dataValues?.email) {
    return { error: 'We could not register your account' }
  }

  return updateAccount(user.dataValues.account_id, accountParams)
}
