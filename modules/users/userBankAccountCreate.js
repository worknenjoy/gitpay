const Promise = require('bluebird')
const models = require('../../models')
const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_KEY)

const currencyMap = {
  'AU': 'AUD',
  'AT': 'EUR',
  'BE': 'EUR',
  'BR': 'BRL',
  'BG': 'BGN', // Bulgaria
  'CA': 'CAD',
  'HR': 'HRK', // Croatia
  'CY': 'EUR', // Cyprus
  'CZ': 'CZK', // Czech Republic
  'DK': 'DKK',
  'EE': 'EUR', // Estonia
  'FI': 'EUR',
  'FR': 'EUR',
  'DE': 'EUR',
  'GH': 'GHS', // Ghana
  'GI': 'GIP', // Gibraltar
  'GR': 'EUR', // Greece
  'HK': 'HKD',
  'HU': 'HUF', // Hungary
  'IN': 'INR',
  'IE': 'EUR',
  'IT': 'EUR',
  'JP': 'JPY',
  'KE': 'KES', // Kenya
  'LV': 'EUR', // Latvia
  'LI': 'CHF', // Liechtenstein
  'LT': 'EUR', // Lithuania
  'LU': 'EUR',
  'MY': 'MYR', // Malaysia
  'MT': 'EUR', // Malta
  'MX': 'MXN',
  'NL': 'EUR',
  'NZ': 'NZD',
  'NG': 'NGN',
  'NO': 'NOK', // Norway
  'PL': 'PLN', // Poland
  'PT': 'EUR',
  'RO': 'RON',
  'SG': 'SGD',
  'SK': 'EUR', // Slovakia
  'SI': 'EUR', // Slovenia
  'ZA': 'ZAR', // South Africa
  'ES': 'EUR',
  'SE': 'SEK',
  'CH': 'CHF',
  'TH': 'THB', // Thailand
  'AE': 'AED', // United Arab Emirates
  'GB': 'GBP',
  'US': 'USD'
};


const getCurrency = (country) => {
  return currencyMap[country]
}

module.exports = Promise.method(function userBankAccountCreate (userParameters) {
  const userCountry = userParameters.country
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
