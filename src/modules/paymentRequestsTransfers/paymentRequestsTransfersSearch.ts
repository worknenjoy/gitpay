import models from '../../models'
import { USER_SENSITIVE_ATTRIBUTES } from '../../queries/user/userSensitiveAttributes'

const currentModels = models as any
const publicUserInclude = {
  model: currentModels.User,
  as: 'User',
  attributes: { exclude: USER_SENSITIVE_ATTRIBUTES }
}

type TransferSearchParams = {
  userId?: number
  to?: string
}

export async function transferSearch(params: TransferSearchParams = {}) {
  let transfers: any[] = []
  if (params.userId) {
    transfers = await currentModels.Transfer.findAll({
      where: { userId: params.userId },
      include: [currentModels.Task, publicUserInclude]
    })
  }
  if (params.to) {
    transfers = await currentModels.Transfer.findAll({
      where: { to: params.to },
      include: [currentModels.Task, publicUserInclude]
    })
  }
  return transfers
}
