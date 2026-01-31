import models from '../../models'
import stripeModule from '../../shared/stripe/stripe'
const stripe = stripeModule()

const currentModels = models as any

type UserAccountParams = {
  id: number
}

export async function userAccount(userParameters: UserAccountParams) {
  const data = await currentModels.User.findOne({
    where: { id: userParameters.id }
  })

  if (data && data.dataValues && data.dataValues.account_id) {
    try {
      const account = await stripe.accounts.retrieve(data.dataValues.account_id)
      return account
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('could not find customer', e)
      return e
    }
  }
  return {}
}
