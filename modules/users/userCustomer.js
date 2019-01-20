const Promise = require('bluebird')
const models = require('../../models')
const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_KEY)

module.exports = Promise.method(function userCustomer (userParameters) {
  return models.User
    .findOne(
      {
        where: { id: userParameters.id }
      }
    )
    .then(data => {
      if (data.dataValues.customer_id) {
        return stripe.customers.retrieve(data.dataValues.customer_id).then(customer => {
          // eslint-disable-next-line no-console
          console.log('customer', customer)
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
      console.log(error)
      return false
    })
})
