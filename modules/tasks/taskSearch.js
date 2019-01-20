const Promise = require('bluebird')
const models = require('../../models')

module.exports = Promise.method(function taskSearch () {
  return models.Task
    .findAll(
      { include: [ models.User, models.Order, models.Assign ] }
    )
    .then(data => {
      return data
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      return false
    })
})
