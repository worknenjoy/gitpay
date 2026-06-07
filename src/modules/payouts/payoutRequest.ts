import models from '../../models'
import Stripe from '../../client/payment/stripe'
import { calculateAmountWithPercent } from '../../utils'
import { createPayoutRecord } from '../../mutations/payout/createPayoutRecord'
import PayoutMail from '../../mail/payout'

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

  if (!user.account_id) return { error: 'User account not activated' }

  const finalAmount = calculateAmountWithPercent(
    params.amount,
    0,
    'decimal',
    params.currency || 'usd'
  )

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

  try {
    const payout = await createPayoutRecord({
      source_id: stripePayout.id,
      userId: params.userId,
      amount: finalAmount.centavos,
      currency: params.currency,
      method: params.method,
      status: stripePayout.status
    })

    await PayoutMail.payoutCreated(user, payout)

    return payout
  } catch (err: any) {
    return { error: err.message }
  }
}
