const Promise = require('bluebird')
const stripe = require('../shared/stripe/stripe')()

module.exports = Promise.method(async function userAccountBalance(userParameters) {
  const { account_id } = userParameters
  const accountBalance = await stripe.balance.retrieve({
    stripeAccount: account_id,
  })
  return accountBalance
})
