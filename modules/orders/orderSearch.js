const Promise = require('bluebird')
const models = require('../../models')

module.exports = Promise.method(function orderSearch () {
  return models.Order
    .findAll(
      { include: models.User }
    )
    .then(data => {
      return data
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      return false
    })
})
