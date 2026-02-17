import models from '../../../models'

import { createCustomer, deleteCustomer } from '../../../provider/stripe/user'
import { retrieveCustomer } from '../../../queries/provider/stripe/customer'

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
    return retrieveCustomer(user.customer_id)
  }

  let createdCustomerId: string | null = null

  try {
    return await currentModels.sequelize.transaction(async (t: any) => {
      const customer = await createCustomer({
        email: user.email
      })

      createdCustomerId = customer.id

      if (!customer.id) {
        throw new Error('Failed to create customer')
      }

      const [updatedCount] = await currentModels.User.update(
        { customer_id: customer.id },
        { where: { id: user.id }, transaction: t }
      )

      if (!updatedCount) {
        throw new Error('user not updated')
      }

      return customer
    })
  } catch (error) {
    if (createdCustomerId) {
      await deleteCustomer(createdCustomerId).catch(() => null)
    }
    throw error
  }
}
