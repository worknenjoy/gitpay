import models from '../../models'

const currentModels = models as any

type FetchOrganizationParams = {
  id: number
}

export async function organizationFetch(orgParams: FetchOrganizationParams) {
  try {
    const data = await currentModels.Organization.findOne({
      where: {
        id: orgParams.id
      },
      include: [
        {
          model: currentModels.Project,
          where: null,
          include: [currentModels.Task, currentModels.Organization]
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
