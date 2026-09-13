import models from '../../models'

const currentModels = models as any

export async function projectList(params?: any) {
  try {
    // "Maintains" is modeled as owning the Organization a project belongs
    // to (Organization.UserId) — there's no separate membership table.
    const organizationWhere = params?.userId ? { UserId: parseInt(params.userId, 10) } : undefined
    const data = await currentModels.Project.findAll({
      include: [
        {
          model: currentModels.Organization,
          where: organizationWhere,
          required: !!organizationWhere
        },
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
