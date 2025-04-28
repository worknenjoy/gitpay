const Promise = require('bluebird')
const models = require('../../models')
const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_KEY)
const currencyMap = require('../util/currency-map')


const getCurrency = (country) => {
  return currencyMap.currencyMap[country]
}

module.exports = Promise.method(function userBankAccountCreate ({ userParams, bankAccountParams }) {
  console.log('userBankAccountCreate', userParams, bankAccountParams)
  const userCountry = userParams.country
  const userCurrency = userParams.currency || getCurrency(userCountry)
  return models.User
    .findOne(
      {
        where: { id: userParams.id }
      }
    )
    .then(data => {
      if (data.dataValues.account_id) {
        return stripe.accounts.listExternalAccounts(data.dataValues.account_id, { object: 'bank_account' }).then((bankAccounts) => {
          if (bankAccounts.data.length) {
            return bankAccounts.data[0]
          }
          return stripe.accounts.createExternalAccount(data.dataValues.account_id, {
            external_account: {
              object: 'bank_account',
              country: bankAccountParams.country || userCountry,
              currency: bankAccountParams.currency || userCurrency,
              account_holder_type: bankAccountParams.account_holder_type,
              routing_number: bankAccountParams.routing_number,
              account_number: bankAccountParams.account_number
            }
          }).then(account => {
            return account
          })
        })
      }
    })
})
