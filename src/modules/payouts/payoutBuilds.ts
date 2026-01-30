import models from '../../models'

const currentModels = models as any

type PayoutBuildsParams = {
  userId: number
  source_id?: string
  amount?: number
  currency?: string
  method?: string
  status?: string
}

export async function payoutBuilds(params: PayoutBuildsParams) {
  if (!params.userId) {
    return { error: 'No userId' }
  }

  const existingPayout =
    params.source_id &&
    (await currentModels.Payout.findOne({
      where: {
        source_id: params.source_id
      }
    }))

  if (existingPayout) {
    return { error: 'This payout already exists' }
  }

  const payout = await currentModels.Payout.build({
    source_id: params.source_id,
    userId: params.userId,
    amount: params.amount,
    currency: params.currency,
    method: params.method,
    status: params.status
  })

  const newPayout = await payout.save()

  return newPayout
}
