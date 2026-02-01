import models from '../../models'
import Stripe from '../../client/payment/stripe'
import { handleAmount } from '../util/handle-amount/handle-amount'

const stripe = Stripe()

const currentModels = models as any

type PayoutRequestParams = {
  userId: number
  source_id?: string
  amount: number
  currency?: string
  method?: string
}

export async function payoutRequest(params: PayoutRequestParams) {
  if (!params.userId) {
    return { error: 'No userId' }
  }

  const user = await currentModels.User.findByPk(params.userId)
  if (!user) {
    return { error: 'User not found' }
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

  if (!user.account_id) return { error: 'User account not activated' }

  const finalAmount = handleAmount(params.amount, 0, 'decimal', params.currency || 'usd')

  const stripePayout = await stripe.payouts.create(
    {
      amount: finalAmount.centavos,
      currency: params.currency,
      metadata: {
        type: 'payout_request'
      }
    },
    {
      stripeAccount: user.account_id
    }
  )

  if (!stripePayout) {
    return { error: 'Error creating payout with Stripe' }
  }

  const payout = await currentModels.Payout.build({
    source_id: stripePayout.id,
    userId: params.userId,
    amount: finalAmount.centavos,
    currency: params.currency,
    method: params.method,
    status: stripePayout.status
  })

  const newPayout = await payout.save()

  return newPayout
}
