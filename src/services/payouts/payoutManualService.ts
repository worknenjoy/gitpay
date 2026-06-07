import models from '../../models'
import { createPayoutRecord } from '../../mutations/payout/createPayoutRecord'
import PayoutMail from '../../mail/payout'

const currentModels = models as any

export type PayoutManualServiceParams = {
  userId: number
  amount: number
  currency?: string
  method?: string
  description?: string
}

export type PayoutManualServiceResult = {
  payout: any
  user: any
}

export async function payoutManualService(
  params: PayoutManualServiceParams
): Promise<PayoutManualServiceResult> {
  const user = await currentModels.User.findByPk(params.userId)
  if (!user) {
    throw new Error(`User ${params.userId} not found`)
  }

  const payout = await createPayoutRecord({
    userId: params.userId,
    amount: params.amount,
    currency: params.currency || 'usd',
    method: params.method || 'manual',
    status: 'initiated',
    description: params.description
  })

  await PayoutMail.payoutCreated(user, payout)

  return {
    payout: payout.dataValues ?? payout,
    user: user.dataValues ?? user
  }
}
