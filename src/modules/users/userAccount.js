const Promise = require('bluebird')
const models = require('../../models')
const stripe = require('../shared/stripe/stripe')()

module.exports = Promise.method(function userAccount(userParameters) {
  return models.User.findOne({
    where: { id: userParameters.id }
  }).then((data) => {
    if (data && data.dataValues && data.dataValues.account_id) {
      return stripe.accounts
        .retrieve(data.dataValues.account_id)
        .then((account) => {
          return account
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.log('could not find customer', e)
          return e
        })
    }
    return {}
  })
})
