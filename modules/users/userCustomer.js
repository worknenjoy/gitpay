const Promise = require('bluebird')
const models = require('../../models')
const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_KEY)

module.exports = Promise.method(function userCustomer (userParameters) {
  const { id } = userParameters
  return models.User
    .findOne(
      {
        where: { id }
      }
    )
    .then(data => {
      const { customer_id } = data.dataValues
      if (customer_id) {
        return stripe.customers.retrieve(customer_id).then(customer => {
          return customer
        }).catch(e => {
          // eslint-disable-next-line no-console
          console.log('could not finde customer', e)
          return e
        })
      }
      return false
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log('error to find customer', error)
      return false
    })
})
