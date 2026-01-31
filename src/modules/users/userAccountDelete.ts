import models from '../../models'
import stripeModule from '../../shared/stripe/stripe'
const stripe = stripeModule()

const currentModels = models as any

type UserAccountDeleteParams = {
  userId: number
}

export async function userAccountDelete({ userId }: UserAccountDeleteParams) {
  const user = await currentModels.User.findByPk(userId)
  const { account_id } = user

  const deletedAccount = await stripe.accounts.del(account_id)

  if (!deletedAccount.deleted) throw new Error('Failed to delete Stripe account')
  const userUpdated = await currentModels.User.update(
    { account_id: null, country: null },
    { where: { id: userId }, returning: true }
  )

  if (!userUpdated[0]) throw new Error('Failed to update user')
  const updatedUser = await currentModels.User.findByPk(userId, {
    include: [
      currentModels.Type,
      {
        model: currentModels.Organization,
        include: [
          {
            model: currentModels.Project,
            include: [currentModels.Task]
          }
        ]
      }
    ]
  })
  return updatedUser
}
