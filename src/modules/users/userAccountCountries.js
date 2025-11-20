const Promise = require('bluebird')
const models = require('../../models')
const stripe = require('../shared/stripe/stripe')()
const getUserAccount = require('./userAccount')

module.exports = Promise.method(async function userAccount(userParameters) {
  const { id } = userParameters
  const userAccount = await getUserAccount({ id })
  const accountCountry = userAccount.country
  if (!accountCountry) {
    return {}
  }
  return stripe.countrySpecs.retrieve(accountCountry).then((countrySpecs) => {
    return countrySpecs
  })
})
