import models from '../../models'
import { calculateAmountWithPercent } from '../../utils'
import { createPayoutRecord } from '../../mutations/payout/createPayoutRecord'
import PayoutMail from '../../mail/payout'
import { getDefaultPaymentProviderName, getPaymentProvider } from '../../providers'

const currentModels = models as any

type PayoutRequestParams = {
  userId: number
  source_id?: string
  amount: number
  currency?: string
  method?: string
  /** Whop: optional saved payout method id */
  payout_method_id?: string
}

export async function payoutRequest(params: PayoutRequestParams) {
  if (!params.userId) {
    return { error: 'No userId' }
  }

  const user = await currentModels.User.findByPk(params.userId)
  if (!user) {
    return { error: 'User not found' }
  }

  const method =
    params.method ||
    (getDefaultPaymentProviderName() === 'whop' ? 'whop' : 'stripe')

  const finalAmount = calculateAmountWithPercent(
    params.amount,
    0,
    'decimal',
    params.currency || 'usd'
  )

  if (method === 'whop') {
    if (!user.whop_account_id) {
      return { error: 'User Whop account not activated' }
    }

    try {
      const whop = getPaymentProvider('whop')
      const withdrawal = await whop.createPayout({
        amount: finalAmount.decimal,
        currency: params.currency || 'usd',
        accountId: user.whop_account_id,
        payoutMethodId: params.payout_method_id,
        metadata: { type: 'payout_request', user_id: String(params.userId) }
      })

      if (!withdrawal?.payoutId) {
        return { error: 'Error creating payout with Whop' }
      }

      const payout = await createPayoutRecord({
        source_id: withdrawal.payoutId,
        userId: params.userId,
        amount: finalAmount.centavos,
        currency: params.currency,
        method: 'whop',
        status: withdrawal.status || 'pending'
      })

      await PayoutMail.payoutCreated(user, payout)
      return payout
    } catch (err: any) {
      return { error: err.message || 'Error creating payout with Whop' }
    }
  }

  // Default: Stripe Connect payout
  if (!user.account_id) return { error: 'User account not activated' }

  try {
    const stripe = getPaymentProvider('stripe')
    const stripePayout = await stripe.createPayout({
      amount: finalAmount.decimal,
      currency: params.currency || 'usd',
      accountId: user.account_id,
      metadata: { type: 'payout_request' }
    })

    if (!stripePayout?.payoutId) {
      return { error: 'Error creating payout with Stripe' }
    }

    const payout = await createPayoutRecord({
      source_id: stripePayout.payoutId,
      userId: params.userId,
      amount: finalAmount.centavos,
      currency: params.currency,
      method: params.method || 'stripe',
      status: stripePayout.status
    })

    await PayoutMail.payoutCreated(user, payout)
    return payout
  } catch (err: any) {
    return { error: err.message }
  }
}
