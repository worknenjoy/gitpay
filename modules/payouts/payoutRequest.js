const Promise = require('bluebird')
const stripe = require('../shared/stripe/stripe')()
const models = require('../../models')
const { handleAmount } = require('../util/handle-amount/handle-amount')

module.exports = Promise.method(async function payoutRequest(params) {

  if(!params.userId) {
    return { error: 'No userId' }
  }

  const existingPayout = params.source_id && await models.Payout.findOne({
    where: {
      source_id: params.source_id
    }
  })

  if (existingPayout) {
    return { error: 'This payout already exists' }
  }

  const finalAmount = handleAmount(params.amount, 8, 'decimal')
  console.log('finalAmount', finalAmount)

  const stripePayout = await stripe.payouts.create({
    amount: finalAmount.centavos,
    currency: params.currency,
  })

  if(!stripePayout) {
    return { error: 'Error creating payout with Stripe' }
  }

  const payout = await models.Payout.build({
    source_id: stripePayout.id,
    userId: params.userId,
    amount: finalAmount.decimal,
    currency: params.currency,
    method: params.method,
    status: stripePayout.status
  })
  
  const newPayout = await payout.save()
  
  return newPayout
})
