import models from '../../models'

const currentModels = models as any
const userInclude = {
  model: currentModels.User,
  as: 'User'
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
      include: [currentModels.Task, userInclude]
    })
  }
  if (params.to) {
    transfers = await currentModels.Transfer.findAll({
      where: { to: params.to },
      include: [currentModels.Task, userInclude]
    })
  }
  return transfers
}
