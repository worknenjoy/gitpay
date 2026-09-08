import models from '../../models'
import { USER_AUTH_SECRET_ATTRIBUTES } from '../../queries/user/userSensitiveAttributes'

const currentModels = models as any

export async function userFetch(id: number) {
  const data = await currentModels.User.findOne({
    where: { id },
    include: [currentModels.Type],
    attributes: { exclude: USER_AUTH_SECRET_ATTRIBUTES }
  })
  return data
}
