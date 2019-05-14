const models = require('../../models')
const Promise = require('bluebird')
const requestPromise = require('request-promise')
const secrets = require('../../config/secrets')

module.exports = Promise.method(function userOrganizations (userAttributes) {
  return models.User
    .findOne({
      where: {
        id: userAttributes.id
      }
    }).then(user => {
      // eslint-disable-next-line no-console
      console.log('theUser', user)
      if (!user) return false

      if (user && !user.dataValues && !user.dataValues.username && user.dataValues.provider !== 'github') return false

      if (user.length <= 0) return false

      // eslint-disable-next-line no-console
      console.log('theUserNameTest', user.dataValues.username)

      return requestPromise({
        uri: `https://api.github.com/users/${user.dataValues.username}/orgs?client_id=${secrets.github.id}&client_secret=${secrets.github.secret}`,
        headers: {
          'User-Agent': 'octonode/0.3 (https://github.com/pksunkara/octonode) terminal/0.0'
        }
      }).then(response => {
        // eslint-disable-next-line no-console
        console.log('responseFromGithub', response)
        const responseFromGithub = JSON.parse(response)
        return responseFromGithub
      })
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log('error on request', error)
      throw error
    })
})
