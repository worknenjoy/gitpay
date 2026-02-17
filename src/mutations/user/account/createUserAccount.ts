import models from '../../../models'

import { findUserByIdSimple } from '../../../queries/user/findUserByIdSimple'
import { createAccount, deleteAccount } from '../../provider/stripe/user'

const currentModels = models as any

type UserAccountCreateParams = {
  id: number
  country: string
}

export async function createUserAccount(userParameters: UserAccountCreateParams) {
  const { country } = userParameters

  let createdAccountId: string | null = null

  try {
    return await currentModels.sequelize.transaction(async (t: any) => {
      const user = await findUserByIdSimple(userParameters.id, { transaction: t })

      if (!user) {
        throw new Error('user.not_found')
      }

      if (user?.dataValues?.account_id) {
        return { error: 'user already have an account' }
      }

      const account = await createAccount({
        type: 'custom',
        country,
        email: user.dataValues.email,
        business_type: 'individual',
        capabilities: {
          transfers: {
            requested: true
          }
        },
        tos_acceptance: {
          service_agreement: country === 'US' ? 'full' : 'recipient'
        }
      })

      createdAccountId = account.id

      await user.update(
        {
          account_id: account.id,
          country
        },
        { transaction: t }
      )

      return account
    })
  } catch (error) {
    if (createdAccountId) {
      await deleteAccount(createdAccountId).catch(() => null)
    }
    throw error
  }
}
