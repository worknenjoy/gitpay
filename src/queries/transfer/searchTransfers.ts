import Models from '../../models'
import { USER_SENSITIVE_ATTRIBUTES } from '../user/userSensitiveAttributes'

const models = Models as any

type TransferSearchParams = {
  userId?: number
  to?: number
}

export async function searchTransfers(params: TransferSearchParams = {}) {
  const userInclude = {
    model: models.User,
    as: 'User',
    attributes: { exclude: USER_SENSITIVE_ATTRIBUTES }
  }

  let transfers: any[] = []
  if (params.userId) {
    transfers = await models.Transfer.findAll({
      where: { userId: params.userId },
      order: [['createdAt', 'DESC']],
      include: [models.Task, userInclude]
    })
  }
  if (params.to) {
    transfers = await models.Transfer.findAll({
      where: { to: params.to },
      order: [['createdAt', 'DESC']],
      include: [models.Task, userInclude]
    })
  }
  return transfers
}
