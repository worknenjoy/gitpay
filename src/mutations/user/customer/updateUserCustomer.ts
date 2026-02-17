import { findUserByIdSimple } from '../../../queries/user/findUserByIdSimple'
import { updateCustomer } from '../../../provider/stripe/user'

type UserCustomerUpdateParams = {
  [key: string]: any
}

export async function updateUserCustomer(id: number, customerParameters: UserCustomerUpdateParams) {
  try {
    const user = await findUserByIdSimple(id)

    if (user?.dataValues?.customer_id) {
      try {
        const customer = await updateCustomer(user.dataValues.customer_id, customerParameters)
        return customer
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('could not find customer', e)
        return e
      }
    }

    return false
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    return false
  }
}
