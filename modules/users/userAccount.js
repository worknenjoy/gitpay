const Promise = require('bluebird')
const models = require('../../models')
const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_KEY)

module.exports = Promise.method(function userAccount (userParameters) {
  return models.User
    .findOne(
      {
        where: { id: userParameters.id }
      }
    )
    .then(data => {
      // eslint-disable-next-line no-console
      console.log('data from account', data)
      if (data && data.dataValues && data.dataValues.account_id) {
        return stripe.accounts.retrieve(data.dataValues.account_id).then((account) => {
          // eslint-disable-next-line no-console
          console.log('user account', account)
          return account
        }).catch(e => {
          // eslint-disable-next-line no-console
          console.log('could not find customer', e)
          return e
        })
      }
      return {}
    })
})
