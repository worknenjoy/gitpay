import models from '../../models'
const stripe = require('../shared/stripe/stripe')()

const currentModels = models as any

type UserCustomerParams = {
  id: number
}

export async function userCustomer(userParameters: UserCustomerParams) {
  const { id } = userParameters
  
  try {
    const data = await currentModels.User.findOne({
      where: { id }
    })
    
    const { customer_id } = data.dataValues
    if (customer_id) {
      try {
        const customer = await stripe.customers.retrieve(customer_id)
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
    console.log('error to find customer', error)
    return false
  }
}
