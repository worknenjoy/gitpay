import models from '../../../models'

import { findUserByIdSimple } from '../../../queries/user/findUserByIdSimple'
import { retrieveCustomer } from '../../../queries/provider/stripe/customer'
import { createCustomer, deleteCustomer } from '../../../provider/stripe/user'

const currentModels = models as any

type UserCustomerCreateParams = {
  [key: string]: any
}

export async function createCustomerForUser(
  id: number,
  customerParameters: UserCustomerCreateParams
) {
  let createdCustomerId: string | null = null

  try {
    return await currentModels.sequelize.transaction(async (t: any) => {
      const user = await findUserByIdSimple(id, { transaction: t })
      if (!user) throw new Error('user.not_found')

      if (user.dataValues.customer_id) {
        try {
          await retrieveCustomer(user.dataValues.customer_id)
          return new Error('customer.exists')
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log('could not find customer', e)
          return e as any
        }
      }

      const customer = await createCustomer({
        ...customerParameters,
        metadata: {
          user_id: id
        }
      })

      createdCustomerId = customer.id

      await user.update({ customer_id: customer.id }, { transaction: t })
      return customer
    })
  } catch (error) {
    if (createdCustomerId) {
      await deleteCustomer(createdCustomerId).catch(() => null)
    }
    // eslint-disable-next-line no-console
    console.log(error)
    return false
  }
}
