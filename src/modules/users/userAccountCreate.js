const Promise = require('bluebird')
const models = require('../../models')
const stripe = require('../shared/stripe/stripe')()

module.exports = Promise.method(function userAccountCreate(userParameters) {
  const { country } = userParameters
  return models.User.findOne({
    where: { id: userParameters.id }
  }).then((user) => {
    if (user && user.dataValues && user.dataValues.account_id) {
      return { error: 'user already have an account' }
    }

    return stripe.accounts
      .create({
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
      .then((account) => {
        // eslint-disable-next-line no-console
        console.log('account created', account)
        return user
          .update(
            {
              account_id: account.id,
              country: country
            },
            {
              where: { id: userParameters.id }
            }
          )
          .then((userUpdated) => {
            return account
          })
      })
  })
})
