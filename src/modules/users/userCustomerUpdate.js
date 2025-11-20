const Promise = require('bluebird')
const models = require('../../models')
const Stripe = require('stripe')
const { databaseStaging } = require('../../config/secrets')
const stripe = require('../shared/stripe/stripe')()

module.exports = Promise.method(function userCustomerUpdate(id, customerParameters) {
  return models.User.findOne({
    where: { id },
  })
    .then((data) => {
      if (data.dataValues.customer_id) {
        return stripe.customers
          .update(data.dataValues.customer_id, customerParameters)
          .then((customer) => {
            return customer
          })
          .catch((e) => {
            // eslint-disable-next-line no-console
            console.log('could not find customer', e)
            return e
          })
      }
      return false
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      return false
    })
})
