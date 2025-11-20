const Promise = require('bluebird')
const models = require('../../models')
const stripe = require('../shared/stripe/stripe')()

module.exports = Promise.method(function userCustomer(userParameters) {
  const { id } = userParameters
  return models.User.findOne({
    where: { id }
  })
    .then((data) => {
      const { customer_id } = data.dataValues
      if (customer_id) {
        return stripe.customers
          .retrieve(customer_id)
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
      console.log('error to find customer', error)
      return false
    })
})
