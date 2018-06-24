const Promise = require('bluebird')
const models = require('../../loading/loading')

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
