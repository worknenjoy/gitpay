import Models from '../../models'

const models = Models as any

type TransferSearchParams = {
  userId?: number
  to?: number
}

export async function searchTransfers(params: TransferSearchParams = {}) {
  let transfers: any[] = []
  if (params.userId) {
    transfers = await models.Transfer.findAll({
      where: { userId: params.userId },
      include: [
        models.Task,
        {
          model: models.User,
          as: 'User'
        }
      ]
    })
  }
  if (params.to) {
    transfers = await models.Transfer.findAll({
      where: { to: params.to },
      include: [
        models.Task,
        {
          model: models.User,
          as: 'User'
        }
      ]
    })
  }
  return transfers
}
