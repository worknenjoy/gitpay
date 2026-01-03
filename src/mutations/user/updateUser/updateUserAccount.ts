import { Transaction } from 'sequelize'
import Stripe from '../../../modules/shared/stripe/stripe'
import { type UserParameters } from './updateUser'

const stripe = Stripe()

const updateUserAccount = async (userParameters: UserParameters, currentUser:any, transaction?: Transaction) => {
  if(userParameters.email && userParameters.email !== currentUser.email) {
    if(currentUser.account_id) {
      return await stripe.accounts.update(
        currentUser.account_id,
        { email: userParameters.email }
      )
    }
  }
}

export default updateUserAccount