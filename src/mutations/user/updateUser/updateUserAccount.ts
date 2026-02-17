import { type UserParameters } from './updateUser'

import { updateAccount } from '../../../provider/stripe/user'

const updateUserAccount = async (user: UserParameters) => {
  if (user.account_id) {
    try {
      return await updateAccount(user.account_id, { email: user.email })
    } catch (error) {
      throw new Error('user.change_email.stripe_error')
    }
  }
}

export default updateUserAccount
