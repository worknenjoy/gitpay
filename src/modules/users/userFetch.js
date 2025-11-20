const Promise = require('bluebird')
const models = require('../../models')
const stripe = require('../shared/stripe/stripe')()

module.exports = Promise.method(function userFetch(id) {
  return models.User.findOne({
    where: { id },
    include: [models.Type]
  }).then((data) => {
    return data
  })
})
