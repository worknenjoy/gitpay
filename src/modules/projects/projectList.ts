import models from '../../models'

const currentModels = models as any

export async function projectList(params?: any) {
  try {
    const data = await currentModels.Project.findAll({
      include: [
        currentModels.Organization,
        {
          model: currentModels.Task,
          include: [currentModels.User]
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
