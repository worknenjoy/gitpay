const models = require('../../models')
const Promise = require('bluebird')
const requestPromise = require('request-promise')
const secrets = require('../../config/secrets')

module.exports = Promise.method(function userOrganizations(userAttributes) {
  return models.User.findOne({
    where: {
      id: userAttributes.id,
    },
    include: [models.Organization],
  })
    .then((user) => {
      if (!user) return false

      if (
        user &&
        !user.dataValues &&
        !user.dataValues.username &&
        user.dataValues.provider !== 'github'
      )
        return false

      if (user.length <= 0) return false

      return requestPromise({
        uri: `https://api.github.com/users/${user.dataValues.username}/orgs?client_id=${secrets.github.id}&client_secret=${secrets.github.secret}`,
        headers: {
          'User-Agent': 'octonode/0.3 (https://github.com/pksunkara/octonode) terminal/0.0',
        },
      }).then(async (response) => {
        const responseFromGithub = JSON.parse(response)

        const currentOrgs = user.dataValues.Organizations
        const allOrgs = await models.Organization.findAll({
          include: [models.User],
        })

        const formatedResponse = responseFromGithub.map((org) => {
          const importedOrgs = currentOrgs.filter((o) => o.dataValues.name === org.login)
          const orgExist = allOrgs.filter((o) => o.dataValues.name === org.login)
          const isImported = !!importedOrgs.length
          return {
            name: org.login,
            image: org.avatar_url,
            organizations: orgExist,
            imported: isImported,
          }
        })
        return formatedResponse
      })
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('error on request', error)
      throw error
    })
})
