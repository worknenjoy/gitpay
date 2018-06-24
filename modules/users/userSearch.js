const Promise = require('bluebird')
const models = require('../../loading/loading')

module.exports = Promise.method(function userSearch () {
  return models.User
    .findAll(
      {}
    )
    .then(data => {
      return data
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      return false
    })
})
