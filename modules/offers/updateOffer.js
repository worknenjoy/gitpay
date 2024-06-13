const Promise = require('bluebird')

const models = require('../../models')

module.exports = Promise.method(function ({ id }, { status }) {
  return models.Offer
    .update({ status }, { where: { id } }).then((u) => u)
})
