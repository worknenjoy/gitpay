const models = require('../../loading/loading')
const Promise = require('bluebird')

module.exports = Promise.method(function userPreferences (userAttributes) {
  return models.User
    .findOne({
      where: {
        id: userAttributes.id
      }
    }).then(user => {
      if (!user) return false

      if (user && !user.dataValues) return false

      if (user.length <= 0) return false

      return {
        language: user.dataValues.language,
        country: user.dataValues.country
      }
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      throw error
    })
})
