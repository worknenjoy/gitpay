const Promise = require('bluebird')
const models = require('../../models')
const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_KEY)
const getUserAccount = require('./userAccount')

module.exports = Promise.method(async function userAccount (userParameters) {
  const { id } = userParameters
  const userAccount = await getUserAccount({ id })
  const accountCountry = userAccount.country
  return stripe.countrySpecs.retrieve(accountCountry).then((countrySpecs) => {
    console.log('countrySpecs', countrySpecs)
    return countrySpecs
  })
})
