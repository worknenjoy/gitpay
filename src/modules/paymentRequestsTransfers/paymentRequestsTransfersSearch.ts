import models from '../../models'

const currentModels = models as any

type TransferSearchParams = {
  userId?: number
  to?: string
}

export async function transferSearch(params: TransferSearchParams = {}) {
  let transfers: any[] = []
  if (params.userId) {
    transfers = await currentModels.Transfer.findAll({
      where: { userId: params.userId },
      include: [
        currentModels.Task,
        {
          model: currentModels.User,
          as: 'User'
        }
      ]
    })
  }
  if (params.to) {
    transfers = await currentModels.Transfer.findAll({
      where: { to: params.to },
      include: [
        currentModels.Task,
        {
          model: currentModels.User,
          as: 'User'
        }
      ]
    })
  }
  return transfers
}
