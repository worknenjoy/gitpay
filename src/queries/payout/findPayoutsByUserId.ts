import models from '../../models'

const currentModels = models as any

export async function findPayoutsByUserId(userId: number) {
  return currentModels.Payout.findAll({
    where: { userId },
    include: [currentModels.User]
  })
}
