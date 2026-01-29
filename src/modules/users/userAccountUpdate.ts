import models from '../../models'
const Stripe = require('stripe')
const ip = require('ip')

const currentModels = models as any
const stripe = new Stripe(process.env.STRIPE_KEY)

type UserAccountUpdateParams = {
  userParams: {
    id: number
  }
  accountParams: any
}

export async function userAccountUpdate({ userParams, accountParams }: UserAccountUpdateParams) {
  if (accountParams?.['tos_acceptance[date]']) {
    accountParams['tos_acceptance[ip]'] = ip.address()
  }
  
  try {
    const user = await currentModels.User.findOne({
      where: { id: userParams.id }
    })
    
    if (!user && !user.dataValues && !user.dataValues.account_id) {
      return { error: 'You need to be logged to update account' }
    }
    if (!user && !user.dataValues && !user.dataValues.email) {
      return { error: 'We could not register your account' }
    }
    
    const account = await stripe.accounts.update(user.dataValues.account_id, accountParams)
    return account
  } catch (error) {
    throw error
  }
}
