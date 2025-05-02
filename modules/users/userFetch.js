const Promise = require('bluebird')
const models = require('../../models')
const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_KEY)

module.exports = Promise.method(function userFetch (id) {
  return models.User
    .findOne(
      {
        where: { id },
        include: [
          models.Type
        ]
      }
    )
    .then(data => {
      return data
    })
})
