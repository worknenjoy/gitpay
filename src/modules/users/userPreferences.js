const models = require('../../models')
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
        country: user.dataValues.country,
        os: user.dataValues.os,
        skills: user.dataValues.skills,
        languages: user.dataValues.languages,
        receiveNotifications: user.dataValues.receiveNotifications != null && user.dataValues.receiveNotifications,
        openForJobs: user.dataValues.openForJobs != null && user.dataValues.openForJobs
      }
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      throw error
    })
})
