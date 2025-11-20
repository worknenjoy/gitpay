const Promise = require('bluebird')
const stripe = require('../shared/stripe/stripe')()
const models = require('../../models')

module.exports.createOrUpdateCustomer = Promise.method((user) => {
  if (!user) {
    return { error: 'No valid user' }
  }
  if (user.customer_id) {
    return stripe.customers.retrieve(user.customer_id).then((customer) => {
      return customer
    })
  }
  return stripe.customers
    .create({
      email: user.email
    })
    .then((customer) => {
      if (customer.id) {
        return models.User.update({ customer_id: customer.id }, { where: { id: user.id } }).then(
          (update) => {
            if (!update) {
              throw new Error('user not updated')
            }
            return customer
          }
        )
      }
    })
})
