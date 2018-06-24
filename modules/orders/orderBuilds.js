const Promise = require('bluebird')
const models = require('../../loading/loading')

module.exports = Promise.method(function orderBuilds (orderParameters) {
  return models.Order
    .build(
      orderParameters
    )
    .save()
    .then((data) => {
      return data
    }).catch(err => {
      // eslint-disable-next-line no-console
      console.log('error to stripe account')
      // eslint-disable-next-line no-console
      console.log(err)
      return err
    })
})
