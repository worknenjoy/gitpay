import models from '../../models'

const currentModels = models as any

export async function findPayoutById(id: number) {
  return currentModels.Payout.findByPk(id, { include: [currentModels.User] })
}
