import models from '../../models'

const currentModels = models as any

export async function listOrganizations() {
  try {
    const data = await currentModels.Organization.findAll({
      include: [
        {
          model: currentModels.Project,
          include: [currentModels.Organization]
        },
        {
          model: currentModels.User
        }
      ]
    })
    return data
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    return false
  }
}
