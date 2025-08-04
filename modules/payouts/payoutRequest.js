const Promise = require('bluebird')
const stripe = require('../shared/stripe/stripe')()
const models = require('../../models')
const { handleAmount } = require('../util/handle-amount/handle-amount')

module.exports = Promise.method(async function payoutRequest(params) {

  if(!params.userId) {
    return { error: 'No userId' }
  }

  const user = await models.User.findByPk(params.userId)
  if (!user) {
    return { error: 'User not found' }
  }

  const existingPayout = params.source_id && await models.Payout.findOne({
    where: {
      source_id: params.source_id
    }
  })

  if (existingPayout) {
    return { error: 'This payout already exists' }
  }

  if(!user.account_id) return { error: 'User account not activated' }

  const finalAmount = handleAmount(params.amount, 0, 'decimal')

  const stripePayout = await stripe.payouts.create({
    amount: finalAmount.centavos,
    currency: params.currency,
    metadata: {
      type: 'payout_request'
    }
  }, {
    stripeAccount: user.account_id
  })

  if(!stripePayout) {
    return { error: 'Error creating payout with Stripe' }
  }

  const payout = await models.Payout.build({
    source_id: stripePayout.id,
    userId: params.userId,
    amount: finalAmount.centavos,
    currency: params.currency,
    method: params.method,
    status: stripePayout.status
  })
  
  const newPayout = await payout.save()
  
  return newPayout
  
})
