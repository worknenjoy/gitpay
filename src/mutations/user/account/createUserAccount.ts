import models from '../../../models'

import { findUserByIdSimple } from '../../../queries/user/findUserByIdSimple'
import { createAccount, deleteAccount } from '../../provider/stripe/user'
import { getDefaultPaymentProviderName, getPaymentProvider } from '../../../providers'

const currentModels = models as any

type UserAccountCreateParams = {
  id: number
  country: string
}

export async function createUserAccount(userParameters: UserAccountCreateParams) {
  const { country } = userParameters
  const providerName = getDefaultPaymentProviderName()

  // Whop connected company (sub-merchant)
  if (providerName === 'whop') {
    let createdAccountId: string | null = null
    try {
      return await currentModels.sequelize.transaction(async (t: any) => {
        const user = await findUserByIdSimple(userParameters.id, { transaction: t })

        if (!user) {
          throw new Error('user.not_found')
        }

        if (user?.dataValues?.whop_account_id) {
          return { error: 'user already have a Whop account' }
        }

        const whop = getPaymentProvider('whop')
        const account = await whop.createConnectedAccount({
          email: user.dataValues.email,
          country,
          metadata: {
            internal_user_id: String(user.dataValues.id),
            title: user.dataValues.name || user.dataValues.username || user.dataValues.email
          }
        })

        createdAccountId = account.accountId

        await user.update(
          {
            whop_account_id: account.accountId,
            country
          },
          { transaction: t }
        )

        return {
          id: account.accountId,
          provider: 'whop',
          ...((account.raw as object) || {})
        }
      })
    } catch (error) {
      // Whop has no delete-company guarantee; leave orphan for manual cleanup
      console.error('Failed to create Whop connected account', error, createdAccountId)
      throw error
    }
  }

  // Stripe Connect (default)
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
