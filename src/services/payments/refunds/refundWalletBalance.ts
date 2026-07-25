import Decimal from 'decimal.js'
import { Op } from 'sequelize'
import Models from '../../../models'
import stripeModule from '../../../client/payment/stripe'
import WalletMail from '../../../mail/wallet'
import { calculateAmountWithPercent } from '../../../utils'

const models = Models as any
const stripe = stripeModule()

export type RefundWalletBalanceReason = 'inactivity'

export type RefundWalletOrderStep = {
  walletOrderId: number
  orderAmount: string
  refundAmount: string
  previousStatus: string
  newStatus: 'partially_refunded' | 'refunded'
  stripeRefundId: string | null
  source: string | null
}

export type RefundWalletBalanceResult = {
  walletId: number
  userId: number
  previousBalance: string
  refundedTotal: string
  resultingBalance: string
  steps: RefundWalletOrderStep[]
  dryRun: boolean
  skipped?: boolean
  skipReason?: string
}

type RefundWalletBalanceParams = {
  walletId: number
  reason?: RefundWalletBalanceReason
  dryRun?: boolean
  onStep?: (message: string) => void
}

function log(onStep: RefundWalletBalanceParams['onStep'], message: string) {
  if (onStep) onStep(message)
}

function availableRefundAmount(order: any): Decimal {
  const amount = new Decimal(order.amount || 0)
  const refunded = new Decimal(order.refunded_amount || 0)
  const available = amount.minus(refunded)
  return available.greaterThan(0) ? available : new Decimal(0)
}

async function resolveChargeIdFromInvoice(invoiceId: string): Promise<string> {
  const invoice = await stripe.invoices.retrieve(invoiceId)

  if (!invoice) {
    throw new Error('invoice_not_found')
  }

  if (invoice.status !== 'paid') {
    throw new Error(`invoice_not_paid:${invoice.status}`)
  }

  let chargeId: string | null = null

  if (typeof invoice.charge === 'string' && invoice.charge) {
    chargeId = invoice.charge
  } else if (invoice.charge && typeof invoice.charge === 'object' && (invoice.charge as any).id) {
    chargeId = (invoice.charge as any).id
  }

  if (!chargeId && invoice.payment_intent) {
    const paymentIntentId =
      typeof invoice.payment_intent === 'string'
        ? invoice.payment_intent
        : (invoice.payment_intent as any)?.id

    if (paymentIntentId) {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
      const latestCharge = paymentIntent?.latest_charge
      if (typeof latestCharge === 'string' && latestCharge) {
        chargeId = latestCharge
      } else if (latestCharge && typeof latestCharge === 'object' && (latestCharge as any).id) {
        chargeId = (latestCharge as any).id
      }
    }
  }

  if (!chargeId) {
    throw new Error('charge_not_found_for_invoice')
  }

  return chargeId
}

async function createStripeRefund(params: {
  invoiceId: string
  amountDecimal: Decimal
  walletId: number
  walletOrderId: number
  reason: RefundWalletBalanceReason
}) {
  const chargeId = await resolveChargeIdFromInvoice(params.invoiceId)
  const amountCents = calculateAmountWithPercent(
    params.amountDecimal.toNumber(),
    0,
    'decimal'
  ).centavos

  if (amountCents <= 0) {
    throw new Error('invalid_refund_amount')
  }

  const refund = await stripe.refunds.create({
    charge: chargeId,
    amount: amountCents,
    metadata: {
      reason: params.reason,
      wallet_id: String(params.walletId),
      wallet_order_id: String(params.walletOrderId),
      type: 'wallet_balance_refund'
    }
  })

  if (!refund?.id) {
    throw new Error('stripe_refund_failed')
  }

  return refund
}

function pickOrdersToRefund(
  orders: any[],
  balanceToRefund: Decimal
): Array<{ order: any; refundAmount: Decimal }> {
  // Prefer a single newer-first order that can cover the full balance (partial refund).
  for (const order of orders) {
    const available = availableRefundAmount(order)
    if (available.greaterThanOrEqualTo(balanceToRefund)) {
      return [{ order, refundAmount: balanceToRefund }]
    }
  }

  // Fallback: cascade from newest to oldest until balance is covered.
  const plan: Array<{ order: any; refundAmount: Decimal }> = []
  let remaining = balanceToRefund

  for (const order of orders) {
    if (remaining.lessThanOrEqualTo(0)) break
    const available = availableRefundAmount(order)
    if (available.lessThanOrEqualTo(0)) continue
    const refundAmount = Decimal.min(available, remaining)
    plan.push({ order, refundAmount })
    remaining = remaining.minus(refundAmount)
  }

  if (remaining.greaterThan(0)) {
    throw new Error(
      `insufficient_wallet_order_funds: need ${balanceToRefund.toFixed(2)}, short by ${remaining.toFixed(2)}`
    )
  }

  return plan
}

/**
 * Refund the full available wallet balance via Stripe, targeting the most recent
 * WalletOrder that can cover it (partial refund when order amount > balance).
 * Zeros the wallet balance and notifies the wallet owner.
 */
export async function refundWalletBalance({
  walletId,
  reason = 'inactivity',
  dryRun = false,
  onStep
}: RefundWalletBalanceParams): Promise<RefundWalletBalanceResult> {
  log(onStep, `Loading wallet #${walletId}...`)

  const wallet = await models.Wallet.findByPk(walletId, {
    include: [{ model: models.User }]
  })

  if (!wallet) {
    throw new Error('wallet_not_found')
  }

  const user = wallet.User || (await models.User.findByPk(wallet.userId))
  if (!user) {
    throw new Error('wallet_owner_not_found')
  }

  // afterFind recalculates and persists balance
  const previousBalance = new Decimal(wallet.balance || 0)
  log(
    onStep,
    `Wallet #${walletId} owner userId=${wallet.userId}, balance=${previousBalance.toFixed(2)}`
  )

  if (previousBalance.lessThanOrEqualTo(0)) {
    log(onStep, `Skipping wallet #${walletId}: balance is zero or negative`)
    return {
      walletId,
      userId: wallet.userId,
      previousBalance: previousBalance.toFixed(2),
      refundedTotal: '0.00',
      resultingBalance: previousBalance.toFixed(2),
      steps: [],
      dryRun,
      skipped: true,
      skipReason: 'zero_balance'
    }
  }

  log(onStep, `Fetching paid / partially_refunded wallet orders (newest first)...`)
  const orders = await models.WalletOrder.findAll({
    where: {
      walletId,
      status: { [Op.in]: ['paid', 'partially_refunded'] }
    },
    order: [
      ['createdAt', 'DESC'],
      ['id', 'DESC']
    ]
  })

  if (!orders.length) {
    throw new Error('no_refundable_wallet_orders')
  }

  log(
    onStep,
    `Found ${orders.length} refundable wallet order(s): ${orders
      .map(
        (o: any) =>
          `#${o.id} status=${o.status} amount=${o.amount} refunded=${o.refunded_amount || 0} available=${availableRefundAmount(o).toFixed(2)}`
      )
      .join('; ')}`
  )

  // Prefer last (newest) order that can cover the full balance as a partial refund.
  let coveringOrder: any | null = null
  for (const order of orders) {
    const available = availableRefundAmount(order)
    log(
      onStep,
      `Evaluating wallet order #${order.id}: available=${available.toFixed(2)} vs balance=${previousBalance.toFixed(2)}`
    )
    if (available.greaterThanOrEqualTo(previousBalance)) {
      coveringOrder = order
      log(
        onStep,
        `Selected wallet order #${order.id} for partial refund of ${previousBalance.toFixed(2)} (order amount ${order.amount})`
      )
      break
    }
    log(onStep, `Wallet order #${order.id} is smaller than balance — checking next older order...`)
  }

  let plan: Array<{ order: any; refundAmount: Decimal }>
  if (coveringOrder) {
    plan = [{ order: coveringOrder, refundAmount: previousBalance }]
  } else {
    log(
      onStep,
      `No single wallet order covers the full balance; cascading refunds from newest to oldest...`
    )
    plan = pickOrdersToRefund(orders, previousBalance)
  }

  log(
    onStep,
    `Refund plan (${plan.length} step(s)): ${plan
      .map((p) => `order#${p.order.id} => ${p.refundAmount.toFixed(2)}`)
      .join(', ')}`
  )

  if (dryRun) {
    log(onStep, `Dry run — no Stripe refunds or DB updates will be performed`)
    const steps: RefundWalletOrderStep[] = plan.map(({ order, refundAmount }) => {
      const previousRefunded = new Decimal(order.refunded_amount || 0)
      const newRefunded = previousRefunded.plus(refundAmount)
      const orderAmount = new Decimal(order.amount || 0)
      const newStatus = newRefunded.greaterThanOrEqualTo(orderAmount)
        ? 'refunded'
        : 'partially_refunded'
      return {
        walletOrderId: order.id,
        orderAmount: orderAmount.toFixed(2),
        refundAmount: refundAmount.toFixed(2),
        previousStatus: order.status,
        newStatus,
        stripeRefundId: null,
        source: order.source
      }
    })

    return {
      walletId,
      userId: wallet.userId,
      previousBalance: previousBalance.toFixed(2),
      refundedTotal: previousBalance.toFixed(2),
      resultingBalance: '0.00',
      steps,
      dryRun: true
    }
  }

  const steps: RefundWalletOrderStep[] = []
  let refundedTotal = new Decimal(0)

  for (const { order, refundAmount } of plan) {
    log(
      onStep,
      `Creating Stripe refund of ${refundAmount.toFixed(2)} against wallet order #${order.id} (invoice ${order.source})...`
    )

    if (!order.source) {
      throw new Error(`wallet_order_missing_source:${order.id}`)
    }

    const stripeRefund = await createStripeRefund({
      invoiceId: order.source,
      amountDecimal: refundAmount,
      walletId,
      walletOrderId: order.id,
      reason
    })

    log(onStep, `Stripe refund created: ${stripeRefund.id} (status=${stripeRefund.status})`)

    const previousRefunded = new Decimal(order.refunded_amount || 0)
    const newRefunded = previousRefunded.plus(refundAmount)
    const orderAmount = new Decimal(order.amount || 0)
    const newStatus: 'partially_refunded' | 'refunded' = newRefunded.greaterThanOrEqualTo(
      orderAmount
    )
      ? 'refunded'
      : 'partially_refunded'

    log(
      onStep,
      `Updating wallet order #${order.id}: status ${order.status} → ${newStatus}, refunded_amount ${previousRefunded.toFixed(2)} → ${newRefunded.toFixed(2)}`
    )

    await models.WalletOrder.update(
      {
        status: newStatus,
        refunded_amount: newRefunded.toFixed(2),
        paid: newStatus === 'partially_refunded' ? true : false
      },
      {
        where: { id: order.id }
      }
    )

    steps.push({
      walletOrderId: order.id,
      orderAmount: orderAmount.toFixed(2),
      refundAmount: refundAmount.toFixed(2),
      previousStatus: order.status,
      newStatus,
      stripeRefundId: stripeRefund.id,
      source: order.source
    })

    refundedTotal = refundedTotal.plus(refundAmount)
  }

  // Recalculate wallet balance via afterFind hook
  log(onStep, `Recalculating wallet #${walletId} balance after refunds...`)
  const updatedWallet = await models.Wallet.findByPk(walletId)
  const resultingBalance = new Decimal(updatedWallet?.balance || 0)

  log(
    onStep,
    `Wallet #${walletId} balance: ${previousBalance.toFixed(2)} → ${resultingBalance.toFixed(2)} (refunded ${refundedTotal.toFixed(2)})`
  )

  log(onStep, `Sending refund notification email to ${user.email}...`)
  await WalletMail.balanceRefunded(user, {
    wallet: updatedWallet || wallet,
    refundAmount: refundedTotal.toFixed(2),
    previousBalance: previousBalance.toFixed(2),
    resultingBalance: resultingBalance.toFixed(2),
    reason,
    steps
  })
  log(onStep, `Notification sent (or skipped if user disabled notifications)`)

  return {
    walletId,
    userId: wallet.userId,
    previousBalance: previousBalance.toFixed(2),
    refundedTotal: refundedTotal.toFixed(2),
    resultingBalance: resultingBalance.toFixed(2),
    steps,
    dryRun: false
  }
}
