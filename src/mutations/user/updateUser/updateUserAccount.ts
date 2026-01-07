import Stripe from '../../../modules/shared/stripe/stripe'
import { type UserParameters } from './updateUser'

const stripe = Stripe()

const updateUserAccount = async (
  user: UserParameters
) => {
  if (user.account_id) {
    try {
      return await stripe.accounts.update(user.account_id, { email: user.email })
    } catch (error) {
      throw new Error('user.change_email.stripe_error')
    }
  }
}

export default updateUserAccount
