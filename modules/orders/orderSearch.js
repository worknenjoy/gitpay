const Promise = require('bluebird')
const models = require('../../models')

module.exports = Promise.method(function orderSearch (orderParams) {
  // eslint-disable-next-line no-console
  console.log('orderParams', orderParams)
  let findOrderParams = {  
    include: [models.User, models.Task] 
  }
  if(orderParams && orderParams.id) {
    findOrderParams = { ...findOrderParams, where : {
      id: orderParams.id 
    }}
  }
  if(orderParams && orderParams.userId) {
    findOrderParams = { ...findOrderParams, where : {
      userId: orderParams.userId 
    }}
  }
  // eslint-disable-next-line no-console
  console.log('findOrderParams', findOrderParams)
  return models.Order
    .findAll(findOrderParams)
    .then(data => {
      return data
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log('error on order search', error)
      return false
    })
})
