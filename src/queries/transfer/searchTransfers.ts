import Models from '../../models'
import { publicUserInclude } from '../../utils/auth/user-secret-attributes'

const models = Models as any

type TransferSearchParams = {
  userId?: number
  to?: number
}

export async function searchTransfers(params: TransferSearchParams = {}) {
  let transfers: any[] = []
  const userInclude = publicUserInclude(models.User, 'User')
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
