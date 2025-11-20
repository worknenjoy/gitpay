const models = require('../models')

const project = async (userOrCompany, projectName, userId, provider) => {
  try {
    const organizationExist = await models.Organization.findOne({
      where: {
        name: userOrCompany
      },
      include: [models.Project]
    })
    if (organizationExist) {
      const projectFromOrg = await models.Project.findOne({
        where: {
          name: projectName,
          OrganizationId: organizationExist.id
        }
      })
      if (projectFromOrg) {
        return projectFromOrg
      } else {
        const newProject = await organizationExist.createProject({ name: projectName })
        return newProject
      }
    } else {
      const organization = await models.Organization.create({
        name: userOrCompany,
        UserId: userId,
        provider: provider
      })
      const project = await organization.createProject({ name: projectName })
      return project
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('error', e)
    throw new Error(e)
  }
}

module.exports = project
