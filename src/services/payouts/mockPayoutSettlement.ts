/* eslint-disable no-console */
import Models from '../../models'
import { createPayoutRecord } from '../../mutations/payout/createPayoutRecord'
import { calculateAmountWithPercent } from '../../utils'

const models = Models as any

export type MockPayoutSettlementParams = {
  userId: number
  /** Decimal major units (e.g. 50.00). Required if creating a new mock payout. */
  amount?: number
  currency?: string
  /**
   * If set, mark this existing Payout as paid instead of creating a new one.
   */
  payoutId?: number
  /**
   * When true, create a paid mock payout without calling Whop withdrawals.
   * Default true when amount is provided.
   */
  createIfMissing?: boolean
}

export type MockPayoutSettlementResult = {
  created: boolean
  updated: boolean
  payout: any
  user: any
}

/**
 * Emulate a completed Whop withdrawal (payout) for sandbox / production dry-run testing.
 *
 * Whop sandbox often cannot complete bank payouts. This writes the Gitpay Payout row
 * as if withdrawal.updated (status paid) had fired, without calling POST /withdrawals.
 */
export async function mockPayoutSettlement(
  params: MockPayoutSettlementParams
): Promise<MockPayoutSettlementResult> {
  const user = await models.User.findByPk(params.userId)
  if (!user) {
    throw new Error(`User ${params.userId} not found`)
  }

  const currency = (params.currency || 'usd').toLowerCase()

  if (params.payoutId != null) {
    const payout = await models.Payout.findByPk(params.payoutId)
    if (!payout) {
      throw new Error(`Payout ${params.payoutId} not found`)
    }
    if (payout.userId !== params.userId) {
      throw new Error(`Payout ${params.payoutId} does not belong to user ${params.userId}`)
    }
    await payout.update({
      status: 'paid',
      paid: true
    })
    await payout.reload()
    return {
      created: false,
      updated: true,
      payout: payout.dataValues ?? payout,
      user: user.dataValues ?? user
    }
  }

  if (params.amount == null || Number(params.amount) <= 0) {
    // Mark all pending/in_transit Whop payouts for this user as paid
    const pending = await models.Payout.findAll({
      where: {
        userId: params.userId,
        method: 'whop',
        status: ['pending', 'initiated', 'in_transit', 'created']
      },
      order: [['createdAt', 'ASC']]
    })

    if (pending.length === 0) {
      throw new Error(
        `No amount provided and no pending Whop payouts for user ${params.userId}. Pass --amount or --payout-id.`
      )
    }

    let last: any = null
    for (const p of pending) {
      await p.update({ status: 'paid', paid: true })
      last = p
    }
    await last.reload()
    return {
      created: false,
      updated: true,
      payout: last.dataValues ?? last,
      user: user.dataValues ?? user
    }
  }

  const finalAmount = calculateAmountWithPercent(params.amount, 0, 'decimal', currency)
  const sourceId = `mock_wdrl_${params.userId}_${Date.now()}`

  const payout = await createPayoutRecord({
    source_id: sourceId,
    userId: params.userId,
    amount: finalAmount.centavos,
    currency,
    method: 'whop',
    status: 'paid',
    description: 'Mock Whop payout settlement (sandbox/ops)'
  })

  // createPayoutRecord may not set paid — ensure webhook-equivalent state
  await payout.update({ paid: true, status: 'paid' })
  await payout.reload()

  console.log(
    `[mockPayoutSettlement] created paid mock payout ${payout.id} source=${sourceId} for user ${params.userId}`
  )

  return {
    created: true,
    updated: false,
    payout: payout.dataValues ?? payout,
    user: user.dataValues ?? user
  }
}
