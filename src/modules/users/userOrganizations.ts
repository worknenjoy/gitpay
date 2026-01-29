import models from '../../models'
const requestPromise = require('request-promise')
const secrets = require('../../config/secrets')

const currentModels = models as any

type UserOrganizationsParams = {
  id: number
}

export async function userOrganizations(userAttributes: UserOrganizationsParams) {
  try {
    const user = await currentModels.User.findOne({
      where: {
        id: userAttributes.id
      },
      include: [currentModels.Organization]
    })
    
    if (!user) return false

    if (
      user &&
      !user.dataValues &&
      !user.dataValues.username &&
      user.dataValues.provider !== 'github'
    )
      return false

    if (user.length <= 0) return false

    const response = await requestPromise({
      uri: `https://api.github.com/users/${user.dataValues.username}/orgs?client_id=${secrets.github.id}&client_secret=${secrets.github.secret}`,
      headers: {
        'User-Agent': 'octonode/0.3 (https://github.com/pksunkara/octonode) terminal/0.0'
      }
    })
    
    const responseFromGithub = JSON.parse(response)

    const currentOrgs = user.dataValues.Organizations
    const allOrgs = await currentModels.Organization.findAll({
      include: [currentModels.User]
    })

    const formatedResponse = responseFromGithub.map((org: any) => {
      const importedOrgs = currentOrgs.filter((o: any) => o.dataValues.name === org.login)
      const orgExist = allOrgs.filter((o: any) => o.dataValues.name === org.login)
      const isImported = !!importedOrgs.length
      return {
        name: org.login,
        image: org.avatar_url,
        organizations: orgExist,
        imported: isImported
      }
    })
    return formatedResponse
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error on request', error)
    throw error
  }
}
