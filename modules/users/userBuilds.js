const Promise = require('bluebird')
const models = require('../../models')

module.exports = Promise.method(function userBuilds (userParameters) {
  userParameters.password = models.User.generateHash(userParameters.password)

  return models.User.build(
    userParameters
  )
    .save()
    .then(data => {
      return data
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log('error from userBuilds', error)
      return false
    })
})
