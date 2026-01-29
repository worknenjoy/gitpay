import models from '../../models'

const currentModels = models as any

type PayoutSearchParams = {
  userId?: number
}

export async function payoutSearch(params: PayoutSearchParams = {}) {
  let payouts = []
  if (params.userId) {
    payouts = await currentModels.Payout.findAll({
      where: { userId: params.userId },
      include: [currentModels.User]
    })
  }
  return payouts
}
