/* eslint-disable no-console */
import Models from '../../models'
import PaymentMail from '../../mail/payment'
const slack = require('../../shared/slack')

const models = Models as any

export type MarkBountyOrderPaidParams = {
  orderId: number
  /** Provider payment / source id (e.g. Whop pay_…) */
  paymentSourceId?: string
  provider?: string
  /** When true, skip mail/slack (script dry runs / bulk) */
  silent?: boolean
}

export type MarkBountyOrderPaidResult = {
  updated: boolean
  skipped: boolean
  reason?: string
  order: any
}

/**
 * Mark a bounty Order as paid (shared by Whop webhooks and ops scripts).
 * Idempotent when already succeeded.
 */
export async function markBountyOrderPaid(
  params: MarkBountyOrderPaidParams
): Promise<MarkBountyOrderPaidResult> {
  const order = await models.Order.findByPk(params.orderId, {
    include: [models.User, models.Task]
  })

  if (!order) {
    throw new Error(`Order ${params.orderId} not found`)
  }

  if (order.paid && order.status === 'succeeded') {
    return { updated: false, skipped: true, reason: 'already_paid', order }
  }

  const update: Record<string, unknown> = {
    paid: true,
    status: 'succeeded'
  }
  if (params.paymentSourceId) {
    update.source = params.paymentSourceId
  }
  if (params.provider) {
    update.provider = params.provider
  }

  await order.update(update)
  await order.reload({ include: [models.User, models.Task] })

  if (!params.silent) {
    try {
      if (order.User && order.Task) {
        await PaymentMail.success(order.User, order.Task, order.amount)
        await slack.notifyBounty(
          order.Task,
          order,
          order.User,
          params.provider === 'whop' ? 'Whop payment' : 'Payment'
        )
      }
    } catch (mailErr) {
      console.error('[markBountyOrderPaid] side-effects error', mailErr)
    }
  }

  return { updated: true, skipped: false, order }
}

export type ProcessUnpaidWhopBountyOrdersOptions = {
  orderId?: number
  /** Limit how many open unpaid orders to process (default 50) */
  limit?: number
  mockPaymentIdPrefix?: string
  silent?: boolean
}

export type ProcessUnpaidWhopBountyOrdersResult = {
  scanned: number
  paid: number
  skipped: number
  failed: number
  errors: Array<{ orderId: number; error: string }>
  orders: Array<{ orderId: number; source: string }>
}

/**
 * Emulate Whop payment.succeeded for unpaid Whop bounty orders (sandbox / ops).
 * Does not call Whop — only updates Gitpay Order rows the way the webhook would.
 */
export async function processUnpaidWhopBountyOrders(
  options: ProcessUnpaidWhopBountyOrdersOptions = {}
): Promise<ProcessUnpaidWhopBountyOrdersResult> {
  const where: any = {
    provider: 'whop',
    paid: false
  }
  if (options.orderId != null) {
    where.id = options.orderId
  }

  const orders = await models.Order.findAll({
    where,
    order: [['createdAt', 'ASC']],
    limit: options.limit ?? 50
  })

  const result: ProcessUnpaidWhopBountyOrdersResult = {
    scanned: orders.length,
    paid: 0,
    skipped: 0,
    failed: 0,
    errors: [],
    orders: []
  }

  const prefix = options.mockPaymentIdPrefix || 'mock_pay_order'

  for (const order of orders) {
    try {
      const paymentSourceId = `${prefix}_${order.id}_${Date.now()}`
      const markResult = await markBountyOrderPaid({
        orderId: order.id,
        paymentSourceId,
        provider: 'whop',
        silent: options.silent
      })
      if (markResult.skipped) {
        result.skipped += 1
      } else {
        result.paid += 1
        result.orders.push({ orderId: order.id, source: paymentSourceId })
      }
    } catch (error: any) {
      result.failed += 1
      result.errors.push({
        orderId: order.id,
        error: error?.message || String(error)
      })
      console.error(`[processUnpaidWhopBountyOrders] order ${order.id} failed:`, error)
    }
  }

  return result
}
