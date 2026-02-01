import models from '../../models'
import stripeModule from '../../client/payment/stripe'
const stripe = stripeModule()

const currentModels = models as any

type UserCustomerUpdateParams = {
  [key: string]: any
}

export async function userCustomerUpdate(id: number, customerParameters: UserCustomerUpdateParams) {
  try {
    const data = await currentModels.User.findOne({
      where: { id }
    })

    if (data.dataValues.customer_id) {
      try {
        const customer = await stripe.customers.update(
          data.dataValues.customer_id,
          customerParameters
        )
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
