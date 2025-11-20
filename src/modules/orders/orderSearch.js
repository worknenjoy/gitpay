const Promise = require('bluebird')
const models = require('../../models')

module.exports = Promise.method(function orderSearch(orderParams) {
  let findOrderParams = {
    include: [models.User, models.Task],
    order: [['id', 'DESC']],
  }
  if (orderParams && orderParams.id) {
    findOrderParams = {
      ...findOrderParams,
      where: {
        id: orderParams.id,
      },
    }
  }
  if (orderParams && orderParams.userId) {
    findOrderParams = {
      ...findOrderParams,
      where: {
        userId: orderParams.userId,
      },
    }
  }
  return models.Order.findAll(findOrderParams)
    .then((data) => {
      return data
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('error on order search', error)
      return false
    })
})
