import models from '../../models'

const currentModels = models as any

export async function findPayoutBySourceId(source_id: string) {
  return currentModels.Payout.findOne({ where: { source_id } })
}
