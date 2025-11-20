const Promise = require('bluebird')
const models = require('../../models')
const stripe = require('../shared/stripe/stripe')()

module.exports = Promise.method(function userBankAccount(userParameters) {
  return models.User.findOne({
    where: { id: userParameters.id }
  }).then((data) => {
    if (data.dataValues.account_id) {
      return stripe.accounts
        .listExternalAccounts(data.dataValues.account_id, { object: 'bank_account' })
        .then((bankAccounts) => {
          if (bankAccounts.data.length) {
            return bankAccounts.data[0]
          }
          return false
        })
    }
  })
})
