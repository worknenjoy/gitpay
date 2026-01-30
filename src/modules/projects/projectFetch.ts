import models from '../../models'

const currentModels = models as any

type ProjectFetchParams = {
  id: number
}

export async function projectFetch(projectParams: ProjectFetchParams, params?: any) {
  try {
    const data = await currentModels.Project.findOne({
      where: {
        id: projectParams.id
      },
      include: [
        {
          model: currentModels.Task,
          where: params || null,
          include: [currentModels.Project, currentModels.User, currentModels.Assign]
        },
        currentModels.Organization
      ]
    })
    return data
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    return false
  }
}
