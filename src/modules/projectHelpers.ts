import models from '../models'

const currentModels = models as any

const project = async (
  userOrCompany: string,
  projectName: string,
  userId: number,
  provider: string
): Promise<any> => {
  try {
    const organizationExist = await currentModels.Organization.findOne({
      where: {
        name: userOrCompany
      },
      include: [currentModels.Project]
    })
    if (organizationExist) {
      const projectFromOrg = await currentModels.Project.findOne({
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
      const organization = await currentModels.Organization.create({
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
    throw new Error(String(e))
  }
}

export default project
