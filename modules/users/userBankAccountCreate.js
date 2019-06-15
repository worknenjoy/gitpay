const Promise = require('bluebird')
const models = require('../../models')
const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_KEY)

const currencyMap = {
  'AU': 'AUD',
  'AT': 'EUR',
  'BE': 'EUR',
  'BR': 'BRL',
  'CA': 'CAD',
  'DK': 'DKK',
  'FI': 'EUR',
  'FR': 'EUR',
  'DE': 'EUR',
  'HK': 'HKD',
  'IE': 'EUR',
  'IT': 'EUR',
  'JP': 'JPY',
  'LU': 'EUR',
  'MX': 'MXN',
  'NL': 'EUR',
  'NZ': 'NZD',
  'NO': 'EUR',
  'PT': 'EUR',
  'SG': 'SGD',
  'ES': 'EUR',
  'SE': 'SEK',
  'CH': 'CHF',
  'GB': 'GBP',
  'US': 'USD'
}

const getCurrency = (country) => {
  return currencyMap[country]
}

module.exports = Promise.method(function userBankAccountCreate (userParameters) {
  const userCountry = userParameters.country || 'BR'
  const userCurrency = getCurrency(userCountry)
  return models.User
    .findOne(
      {
        where: { id: userParameters.id }
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
              country: userCountry,
              currency: userCurrency,
              account_holder_type: 'individual',
              routing_number: userParameters.routing_number,
              account_number: userParameters.account_number
            }
          }).then(account => {
            return account
          })
        })
      }
    })
})
