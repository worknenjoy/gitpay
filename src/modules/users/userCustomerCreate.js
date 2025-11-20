const Promise = require('bluebird')
const models = require('../../models')
const stripe = require('../shared/stripe/stripe')()

module.exports = Promise.method(function userCustomerCreate(id, customerParameters) {
  return models.User.findOne({
    where: { id }
  })
    .then((data) => {
      if (data.dataValues.customer_id) {
        return stripe.customers
          .retrieve(data.dataValues.customer_id)
          .then((customer) => {
            return new Error('customer.exists')
          })
          .catch((e) => {
            // eslint-disable-next-line no-console
            console.log('could not find customer', e)
            return e
          })
      } else {
        return stripe.customers
          .create({
            ...customerParameters,
            metadata: {
              user_id: id
            }
          })
          .then((customer) => {
            return data
              .update(
                {
                  customer_id: customer.id
                },
                {
                  where: { id },
                  returning: true
                }
              )
              .then((userUpdated) => {
                return customer
              })
          })
      }
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      return false
    })
})
