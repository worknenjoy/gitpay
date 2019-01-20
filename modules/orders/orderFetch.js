const Promise = require('bluebird')
const models = require('../../models')

module.exports = Promise.method(function orderFetch (orderParams) {
  return models.Order
    .findOne(
      { where: { id: orderParams.id }, include: models.User }
    )
    .then(async (data) => {
      return {
        source_id: data.source_id,
        currency: data.currency,
        amount: data.amount
      }
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      return false
    })
})
