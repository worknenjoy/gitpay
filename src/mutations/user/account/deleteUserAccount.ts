import models from '../../../models'

import { findUserByIdSimple } from '../../../queries/user/findUserByIdSimple'
import { findUserByIdWithOrganizations } from '../../../queries/user/findUserByIdWithOrganizations'
import { deleteAccount } from '../../provider/stripe/user'

const currentModels = models as any

type UserAccountDeleteParams = {
  userId: number
  /** Force a provider (Whop tab passes 'whop', Stripe tab passes 'stripe') */
  provider?: string
}

export async function deleteUserAccount({ userId, provider }: UserAccountDeleteParams) {
  const user = await findUserByIdSimple(userId)
  const accountId = user?.dataValues?.account_id
  const whopAccountId = user?.dataValues?.whop_account_id
  const requestedProvider = (provider || '').toLowerCase()

  // Whop disconnect (explicit): clear the local link only; the Whop company
  // (bank/KYC) is intentionally NOT deleted. Must run even if a legacy Stripe
  // account also exists, so the Whop tab never deletes the Stripe account.
  if (requestedProvider === 'whop' && whopAccountId) {
    await currentModels.sequelize.transaction(async (t: any) => {
      const userInTx = await findUserByIdSimple(userId, { transaction: t })
      if (!userInTx) throw new Error('Failed to update user')
      await userInTx.update({ whop_account_id: null }, { transaction: t })
    })
    return findUserByIdWithOrganizations(userId)
  }

  // Stripe: delete the Connect account remotely and clear the link.
  if (accountId && requestedProvider !== 'whop') {
    await currentModels.sequelize.transaction(async (t: any) => {
      const userInTx = await findUserByIdSimple(userId, { transaction: t })
      if (!userInTx) throw new Error('Failed to update user')

      await userInTx.update({ account_id: null, country: null }, { transaction: t })

      const deletedAccount = await deleteAccount(accountId)
      if (!deletedAccount?.deleted) throw new Error('Failed to delete Stripe account')
    })

    return findUserByIdWithOrganizations(userId)
  }

  // Whop: disconnect the linked company from Gitpay. The Whop company (bank/KYC)
  // is intentionally NOT deleted — only the local link is cleared.
  if (whopAccountId) {
    await currentModels.sequelize.transaction(async (t: any) => {
      const userInTx = await findUserByIdSimple(userId, { transaction: t })
      if (!userInTx) throw new Error('Failed to update user')
      await userInTx.update({ whop_account_id: null, country: null }, { transaction: t })
    })

    return findUserByIdWithOrganizations(userId)
  }

  throw new Error('Failed to delete account')
}
