const models = require('../../loading/loading')
const Promise = require('bluebird')

module.exports = Promise.method(function userExists (userAttributes) {
  return models.User
    .findOne({
      where: {
        email: userAttributes.email
      }
    }).then(user => {
      if (!user) return false

      return user
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      throw error
    })
})
