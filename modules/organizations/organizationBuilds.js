const Promise = require('bluebird')
const models = require('../../models')

module.exports = Promise.method(function userBuilds (organizationParameters) {
  return models.Organization.build(
    organizationParameters
  )
    .save()
    .then(data => {
      return data
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log('error from organizationBuilds', error)
      return false
    })
})
