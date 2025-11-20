const Promise = require('bluebird')
const models = require('../../models')
const stripe = require('../shared/stripe/stripe')()

module.exports = Promise.method(function userBankAccountUpdate({ userParams, bank_account }) {
  return models.User.findOne({
    where: { id: userParams.id },
  }).then((data) => {
    if (data.dataValues.account_id) {
      return stripe.accounts
        .listExternalAccounts(data.dataValues.account_id, { object: 'bank_account' })
        .then((bankAccounts) => {
          if (bankAccounts.data.length) {
            const bankAccount = bankAccounts.data[0]
            return stripe.accounts
              .updateExternalAccount(data.dataValues.account_id, bankAccount.id, {
                account_holder_name: bank_account.account_holder_name,
                account_holder_type: bank_account.account_holder_type,
              })
              .then((account) => {
                return account
              })
          }
        })
    }
  })
})
