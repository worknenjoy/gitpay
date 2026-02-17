import { findUserByIdSimple } from '../findUserByIdSimple'
import { retrieveCustomer } from '../../provider/stripe/customer'

export const getUserStripeCustomer = async (userId: number) => {
  try {
    const user = await findUserByIdSimple(userId)
    const customerId = user?.dataValues?.customer_id

    if (!customerId) return false

    try {
      return await retrieveCustomer(customerId)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('could not find customer', e)
      return e
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error to find customer', error)
    return false
  }
}
