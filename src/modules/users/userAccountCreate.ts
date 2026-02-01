import models from '../../models'
import stripeModule from '../../client/payment/stripe'
const stripe = stripeModule()

const currentModels = models as any

type UserAccountCreateParams = {
  id: number
  country: string
}

export async function userAccountCreate(userParameters: UserAccountCreateParams) {
  const { country } = userParameters

  const user = await currentModels.User.findOne({
    where: { id: userParameters.id }
  })

  if (user && user.dataValues && user.dataValues.account_id) {
    return { error: 'user already have an account' }
  }

  const account = await stripe.accounts.create({
    type: 'custom',
    country: country,
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

  // eslint-disable-next-line no-console
  console.log('account created', account)

  await user.update(
    {
      account_id: account.id,
      country: country
    },
    {
      where: { id: userParameters.id }
    }
  )

  return account
}
