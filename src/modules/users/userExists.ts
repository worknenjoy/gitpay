import models from '../../models'

const currentModels = models as any

type UserExistsParams = {
  id?: number
  email?: string
}

export async function userExists(userAttributes: UserExistsParams) {
  const conditions: any = {}
  if (userAttributes.id) {
    conditions.id = userAttributes.id
  }
  if (userAttributes.email) {
    conditions.email = userAttributes.email
  }
  try {
    const user = await currentModels.User.findOne({
      where: {
        ...conditions
      },
      include: [
        currentModels.Type,
        {
          model: currentModels.Organization,
          include: [
            {
              model: currentModels.Project,
              include: [currentModels.Task]
            }
          ]
        }
      ],
      attributes: { exclude: ['password'] }
    })
    if (!user) return false

    if (user && !user.dataValues) return false

    if (user.length <= 0) return false

    return user
  } catch (error) {
    console.log('userExists error', error)
  }
}
