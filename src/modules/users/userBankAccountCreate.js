const Promise = require('bluebird')
const models = require('../../models')
const stripe = require('../shared/stripe/stripe')()
const currencyMap = require('../util/currency-map')

const getCurrency = (country) => {
  return currencyMap.currencyMap[country]
}

module.exports = Promise.method(function userBankAccountCreate({ userParams, bankAccountParams }) {
  const userCountry = userParams.country
  const userCurrency = userParams.currency || getCurrency(userCountry)
  return models.User.findOne({
    where: { id: userParams.id }
  }).then((data) => {
    if (data.dataValues.account_id) {
      return stripe.accounts
        .listExternalAccounts(data.dataValues.account_id, { object: 'bank_account' })
        .then((bankAccounts) => {
          if (bankAccounts.data.length) {
            return bankAccounts.data[0]
          }
          return stripe.accounts
            .createExternalAccount(data.dataValues.account_id, {
              external_account: {
                object: 'bank_account',
                country: bankAccountParams.country || userCountry,
                currency: bankAccountParams.currency || userCurrency,
                account_holder_type: bankAccountParams.account_holder_type,
                account_holder_name: bankAccountParams.account_holder_name,
                routing_number: bankAccountParams.routing_number,
                account_number: bankAccountParams.account_number
              }
            })
            .then((account) => {
              return account
            })
        })
    }
  })
})
