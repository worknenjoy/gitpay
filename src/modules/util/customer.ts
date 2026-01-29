import stripeModule from '../shared/stripe/stripe'
const stripe = stripeModule()
import models from '../../models'

const currentModels = models as any

type User = {
  id: number
  email: string
  customer_id?: string
}

export async function createOrUpdateCustomer(user: User) {
  if (!user) {
    return { error: 'No valid user' }
  }
  
  if (user.customer_id) {
    const customer = await stripe.customers.retrieve(user.customer_id)
    return customer
  }
  
  const customer = await stripe.customers.create({
    email: user.email
  })
  
  if (customer.id) {
    const update = await currentModels.User.update(
      { customer_id: customer.id },
      { where: { id: user.id } }
    )
    
    if (!update) {
      throw new Error('user not updated')
    }
    
    return customer
  }
  
  throw new Error('Failed to create customer')
}
