import models from '../../models'
import { USER_SENSITIVE_ATTRIBUTES } from '../../queries/user/userSensitiveAttributes'

const currentModels = models as any

export async function organizationList(params?: any) {
  try {
    const data = await currentModels.Organization.findAll({
      include: [
        {
          model: currentModels.Project,
          include: [currentModels.Organization]
        },
        {
          model: currentModels.User,
          attributes: { exclude: USER_SENSITIVE_ATTRIBUTES }
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
