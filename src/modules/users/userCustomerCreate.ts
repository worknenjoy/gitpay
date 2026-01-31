import models from '../../models'
import stripeModule from '../../shared/stripe/stripe'
const stripe = stripeModule()

const currentModels = models as any

type UserCustomerCreateParams = {
  [key: string]: any
}

export async function userCustomerCreate(id: number, customerParameters: UserCustomerCreateParams) {
  try {
    const data = await currentModels.User.findOne({
      where: { id }
    })

    if (data.dataValues.customer_id) {
      try {
        const customer = await stripe.customers.retrieve(data.dataValues.customer_id)
        return new Error('customer.exists')
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('could not find customer', e)
        return e
      }
    } else {
      const customer = await stripe.customers.create({
        ...customerParameters,
        metadata: {
          user_id: id
        }
      })

      await data.update(
        {
          customer_id: customer.id
        },
        {
          where: { id },
          returning: true
        }
      )

      return customer
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    return false
  }
}
