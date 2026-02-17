import models from '../../../models'

import { findUserByIdSimple } from '../../../queries/user/findUserByIdSimple'
import { findUserByIdWithOrganizations } from '../../../queries/user/findUserByIdWithOrganizations'
import { deleteAccount } from '../../../provider/stripe/user'

const currentModels = models as any

type UserAccountDeleteParams = {
  userId: number
}

export async function deleteUserAccount({ userId }: UserAccountDeleteParams) {
  const user = await findUserByIdSimple(userId)
  const accountId = user?.dataValues?.account_id

  if (!accountId) {
    throw new Error('Failed to delete Stripe account')
  }

  await currentModels.sequelize.transaction(async (t: any) => {
    const userInTx = await findUserByIdSimple(userId, { transaction: t })
    if (!userInTx) throw new Error('Failed to update user')

    await userInTx.update({ account_id: null, country: null }, { transaction: t })

    const deletedAccount = await deleteAccount(accountId)
    if (!deletedAccount?.deleted) throw new Error('Failed to delete Stripe account')
  })

  return findUserByIdWithOrganizations(userId)
}
