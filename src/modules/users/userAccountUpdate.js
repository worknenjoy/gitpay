const Promise = require('bluebird')
const models = require('../../models')
const Stripe = require('stripe')
const ip = require('ip')
const stripe = new Stripe(process.env.STRIPE_KEY)

module.exports = Promise.method(function userAccountUpdate({ userParams, accountParams }) {
  if (accountParams?.['tos_acceptance[date]']) {
    accountParams['tos_acceptance[ip]'] = ip.address()
  }
  return models.User.findOne({
    where: { id: userParams.id },
  }).then((user) => {
    if (!user && !user.dataValues && !user.dataValues.account_id) {
      return { error: 'You need to be logged to update account' }
    }
    if (!user && !user.dataValues && !user.dataValues.email) {
      return { error: 'We could not register your account' }
    }
    return stripe.accounts.update(user.dataValues.account_id, accountParams).then((account) => {
      return account
    })
  })
})
