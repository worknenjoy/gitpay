import Models from '../../../models'
import { WebhookEventRegistry } from '../../../providers/webhooks'
import type { WebhookHandlerContext } from '../../../providers/webhooks'
import { processPaymentRequestPaymentFromCheckoutSession } from '../../../services/paymentRequest/processPaymentRequestPayment'
import {
  createDisputeForPaymentRequest,
  withDrawnDisputeForPaymentRequest,
  closeDisputeForPaymentRequest
} from '../../../services/payments/disputes/disputeService'
import PaymentMail from '../../../mail/payment'
const slack = require('../../../shared/slack')

const models = Models as any

/** Default Whop chargeback fee ($15) in cents — overridable via WHOP_DISPUTE_FEE_CENTS */
function whopDisputeFeeCents(): number {
  const raw = process.env.WHOP_DISPUTE_FEE_CENTS
  if (raw == null || raw === '') return 1500
  const n = Number(raw)
  return Number.isFinite(n) && n >= 0 ? n : 1500
}

/**
 * Merge plan/product/payment metadata. PR ids are often on the plan only.
 */
function mergePaymentMetadata(payment: any): Record<string, any> {
  return {
    ...(payment?.plan?.metadata || {}),
    ...(payment?.product?.metadata || {}),
    ...(payment?.metadata || {})
  }
}

/**
 * Whop amounts are major currency units (e.g. 92.5). Stripe checkout sessions use cents.
 */
function whopMajorToCents(value: unknown): number {
  if (value == null || value === '') return 0
  return Math.round(Number(value) * 100)
}

/**
 * Adapt a Whop payment object into the Stripe Checkout Session-shaped payload
 * consumed by processPaymentRequestPaymentFromCheckoutSession.
 *
 * payment.succeeded payloads often omit `status`; the event type is the source of truth for paid.
 */
function paymentToCheckoutSession(payment: any, options: { forcePaid?: boolean } = {}) {
  const metadata = mergePaymentMetadata(payment)
  const major =
    payment?.amount_after_fees != null
      ? payment.amount_after_fees
      : payment?.total ?? payment?.usd_total ?? payment?.amount ?? payment?.final_amount ?? 0
  const cents = whopMajorToCents(major)

  const status = payment?.status
  const paidByStatus = status === 'succeeded' || status === 'paid' || status === 'complete'
  const payment_status = options.forcePaid || paidByStatus ? 'paid' : status

  return {
    id: payment.id,
    payment_link:
      metadata.payment_link_id || metadata.plan_id || payment.plan?.id || payment.plan_id || null,
    payment_status,
    amount_total: cents,
    payment_intent: payment.id,
    customer_details: {
      name: payment.user?.name || payment.member?.name || metadata.customer_name,
      email:
        payment.user?.email ||
        payment.member?.email ||
        metadata.customer_email ||
        payment.customer_email_address
    },
    metadata
  }
}

async function resolvePaymentRequestSession(payment: any, metadata: Record<string, any>) {
  const session = paymentToCheckoutSession(payment, { forcePaid: true })

  if (!session.payment_link && metadata.payment_request_id) {
    const pr = await models.PaymentRequest.findByPk(metadata.payment_request_id)
    session.payment_link = pr?.payment_link_id
  }

  if (!session.payment_link && payment?.plan?.id) {
    session.payment_link = payment.plan.id
  }

  return session
}

async function handlePaymentSucceeded(ctx: WebhookHandlerContext) {
  const payment = ctx.event.data.object || ctx.rawEvent?.data
  const metadata = mergePaymentMetadata(payment)

  console.log('[whop] payment.succeeded', {
    id: payment?.id,
    planId: payment?.plan?.id,
    metadata
  })

  // Payment request checkout (metadata on payment or plan)
  if (metadata.payment_request_id || metadata.purpose === 'payment_request') {
    const session = await resolvePaymentRequestSession(payment, metadata)
    console.log('[whop] PR checkout session', {
      payment_link: session.payment_link,
      payment_status: session.payment_status,
      amount_total: session.amount_total,
      payment_request_id: metadata.payment_request_id
    })
    try {
      await processPaymentRequestPaymentFromCheckoutSession(session)
      return ctx.res.status(200).json(ctx.rawEvent || ctx.event)
    } catch (error: any) {
      console.error('[whop] payment request checkout error', error)
      const status = error?.statusCode || error?.status || 500
      return ctx.res.status(status).json({ error: error?.message || 'payment_request_error' })
    }
  }

  // Bounty order (embedded checkout)
  if (metadata.order_id || metadata.purpose === 'bounty_order') {
    const orderId = metadata.order_id
    const order = await models.Order.findByPk(orderId, {
      include: [models.User, models.Task]
    })
    if (!order) {
      console.warn('[whop] order not found for payment', orderId)
      return ctx.res.status(200).json(ctx.rawEvent || ctx.event)
    }

    if (order.paid && order.status === 'succeeded') {
      return ctx.res.status(200).json(ctx.rawEvent || ctx.event)
    }

    await order.update({
      paid: true,
      status: 'succeeded',
      source: payment.id,
      provider: 'whop'
    })

    try {
      if (order.User && order.Task) {
        await PaymentMail.success(order.User, order.Task, order.amount)
        await slack.notifyBounty(order.Task, order, order.User, 'Whop payment')
      }
    } catch (mailErr) {
      console.error('[whop] bounty paid side-effects error', mailErr)
    }

    return ctx.res.status(200).json(ctx.rawEvent || ctx.event)
  }

  // Fallback: match payment request by plan id (payment_link_id)
  if (payment?.plan?.id || payment?.product?.id) {
    const linkId = payment.plan?.id
    if (linkId) {
      const pr = await models.PaymentRequest.findOne({ where: { payment_link_id: linkId } })
      if (pr) {
        const session = await resolvePaymentRequestSession(
          {
            ...payment,
            metadata: {
              ...metadata,
              payment_request_id: String(pr.id),
              payment_link_id: linkId,
              purpose: 'payment_request'
            }
          },
          {
            ...metadata,
            payment_request_id: String(pr.id),
            payment_link_id: linkId,
            purpose: 'payment_request'
          }
        )
        session.payment_link = linkId
        try {
          await processPaymentRequestPaymentFromCheckoutSession(session)
          return ctx.res.status(200).json(ctx.rawEvent || ctx.event)
        } catch (error: any) {
          console.error('[whop] PR fallback error', error)
          const status = error?.statusCode || error?.status || 500
          return ctx.res.status(status).json({ error: error?.message })
        }
      }
    }
  }

  return ctx.res.status(200).json(ctx.rawEvent || ctx.event)
}

async function handlePaymentFailed(ctx: WebhookHandlerContext) {
  const payment = ctx.event.data.object || ctx.rawEvent?.data
  const metadata = payment?.metadata || {}
  if (metadata.order_id) {
    const order = await models.Order.findByPk(metadata.order_id)
    if (order && !order.paid) {
      await order.update({ status: 'failed', source: payment.id })
    }
  }
  return ctx.res.status(200).json(ctx.rawEvent || ctx.event)
}

async function handleInvoicePaid(ctx: WebhookHandlerContext) {
  const invoice = ctx.event.data.object || ctx.rawEvent?.data
  const invoiceId = invoice?.id
  console.log('[whop] invoice.paid', invoiceId)

  if (!invoiceId) {
    return ctx.res.status(200).json(ctx.rawEvent || ctx.event)
  }

  // Bounty invoice order
  const order = await models.Order.findOne({
    where: { source_id: invoiceId, provider: 'whop' },
    include: [models.User, models.Task]
  })
  if (order) {
    if (!(order.paid && order.status === 'succeeded')) {
      await order.update({
        paid: true,
        status: 'succeeded',
        source: invoiceId
      })
      try {
        if (order.User && order.Task) {
          await PaymentMail.success(order.User, order.Task, order.amount)
        }
      } catch (e) {
        console.error('[whop] invoice order email error', e)
      }
    }
    return ctx.res.status(200).json(ctx.rawEvent || ctx.event)
  }

  // Wallet top-up invoice
  const walletOrder = await models.WalletOrder.findOne({
    where: { source: invoiceId }
  })
  if (walletOrder) {
    await walletOrder.update({
      paid: true,
      status: 'paid'
    })
  }

  return ctx.res.status(200).json(ctx.rawEvent || ctx.event)
}

async function handleInvoiceCreated(ctx: WebhookHandlerContext) {
  return ctx.res.status(200).json(ctx.rawEvent || ctx.event)
}

async function handleInvoiceFailed(ctx: WebhookHandlerContext) {
  const invoice = ctx.event.data.object || ctx.rawEvent?.data
  const invoiceId = invoice?.id
  if (invoiceId) {
    const order = await models.Order.findOne({
      where: { source_id: invoiceId, provider: 'whop' }
    })
    if (order && !order.paid) {
      await order.update({ status: 'failed' })
    }
    const walletOrder = await models.WalletOrder.findOne({ where: { source: invoiceId } })
    if (walletOrder && !walletOrder.paid) {
      await walletOrder.update({ status: 'failed' })
    }
  }
  return ctx.res.status(200).json(ctx.rawEvent || ctx.event)
}

async function handleWithdrawal(ctx: WebhookHandlerContext) {
  const withdrawal = ctx.event.data.object || ctx.rawEvent?.data
  const withdrawalId = withdrawal?.id
  const status = withdrawal?.status

  console.log('[whop] withdrawal event', { type: ctx.event.type, withdrawalId, status })

  if (!withdrawalId) {
    return ctx.res.status(200).json(ctx.rawEvent || ctx.event)
  }

  const paidStatuses = ['paid', 'completed', 'succeeded']
  const failedStatuses = ['failed', 'canceled', 'cancelled', 'denied']

  const update: any = {}
  if (status) update.status = status
  if (status && paidStatuses.includes(String(status).toLowerCase())) {
    update.paid = true
  }
  if (status && failedStatuses.includes(String(status).toLowerCase())) {
    update.paid = false
  }

  if (Object.keys(update).length > 0) {
    const [updatedCount] = await models.Payout.update(update, {
      where: { source_id: withdrawalId }
    })
    if (updatedCount === 0) {
      console.warn('[whop] no payout found for withdrawal', withdrawalId)
    }
  }

  return ctx.res.status(200).json(ctx.rawEvent || ctx.event)
}

async function handleRefund(ctx: WebhookHandlerContext) {
  const refund = ctx.event.data.object || ctx.rawEvent?.data
  const paymentId = refund?.payment_id || refund?.payment?.id || refund?.id
  const metadata = refund?.metadata || {}

  console.log('[whop] refund event', { type: ctx.event.type, paymentId, metadata })

  // Bounty order refund
  if (metadata.order_id) {
    const order = await models.Order.findByPk(metadata.order_id)
    if (order && order.status !== 'refunded') {
      await order.update({ status: 'refunded', paid: false })
    }
  } else if (paymentId) {
    const order = await models.Order.findOne({
      where: { source: paymentId, provider: 'whop' }
    })
    if (order && order.status !== 'refunded') {
      await order.update({ status: 'refunded', paid: false })
    }
  }

  // Payment request payment refund
  if (metadata.payment_request_payment_id) {
    const prPayment = await models.PaymentRequestPayment.findByPk(
      metadata.payment_request_payment_id
    )
    if (prPayment) {
      await prPayment.update({ status: 'refunded' })
    }
  } else if (paymentId) {
    const prPayment = await models.PaymentRequestPayment.findOne({
      where: { source: paymentId }
    })
    if (prPayment) {
      await prPayment.update({ status: 'refunded' })
    }
  }

  return ctx.res.status(200).json(ctx.rawEvent || ctx.event)
}

/**
 * Whop withdraws disputed amount + fee immediately on create (no separate funds_withdrawn event).
 * Maps to Stripe: charge.dispute.created + charge.dispute.funds_withdrawn.
 */
async function handleDisputeCreated(ctx: WebhookHandlerContext) {
  const dispute = ctx.event.data.object || ctx.rawEvent?.data
  const paymentId = dispute?.payment?.id
  const disputeId = dispute?.id

  console.log('[whop] dispute.created', {
    disputeId,
    paymentId,
    amount: dispute?.amount,
    reason: dispute?.reason
  })

  if (!paymentId) {
    console.warn('[whop] dispute.created missing payment.id — ignoring')
    return ctx.res.status(200).json(ctx.rawEvent || ctx.event)
  }

  const prPayment = await models.PaymentRequestPayment.findOne({
    where: { source: paymentId }
  })
  if (!prPayment) {
    console.log('[whop] dispute.created not a payment-request payment', paymentId)
    return ctx.res.status(200).json(ctx.rawEvent || ctx.event)
  }

  try {
    // Whop amounts are major units; mail + ledger use cents (Stripe shape)
    const amountCents = whopMajorToCents(dispute.amount)
    const feeCents = whopDisputeFeeCents()
    const disputeForMail = {
      ...dispute,
      amount: amountCents,
      currency: dispute.currency || dispute.payment?.currency || 'usd',
      balance_transactions: [{ fee: feeCents, net: -(amountCents + feeCents) }]
    }

    await createDisputeForPaymentRequest({
      source_id: paymentId,
      dispute: disputeForMail
    })

    await withDrawnDisputeForPaymentRequest({
      source_id: paymentId,
      dispute_id: disputeId,
      amount: amountCents,
      fee: feeCents,
      reason: dispute.reason || 'dispute',
      status: dispute.status || 'needs_response',
      openedAt: dispute.created_at,
      closedAt: undefined
    })
  } catch (error: any) {
    console.error('[whop] dispute.created error', error)
    const status = error?.statusCode || error?.status || 500
    return ctx.res.status(status).json({ error: error?.message || 'dispute_error' })
  }

  return ctx.res.status(200).json(ctx.rawEvent || ctx.event)
}

/**
 * Terminal outcomes: won → credit PR balance; lost/closed → notify only.
 */
async function handleDisputeUpdated(ctx: WebhookHandlerContext) {
  const dispute = ctx.event.data.object || ctx.rawEvent?.data
  const paymentId = dispute?.payment?.id
  const status = String(dispute?.status || '').toLowerCase()
  const terminal = ['won', 'lost', 'closed']

  console.log('[whop] dispute.updated', {
    disputeId: dispute?.id,
    paymentId,
    status
  })

  if (!paymentId || !terminal.includes(status)) {
    return ctx.res.status(200).json(ctx.rawEvent || ctx.event)
  }

  const prPayment = await models.PaymentRequestPayment.findOne({
    where: { source: paymentId }
  })
  if (!prPayment) {
    return ctx.res.status(200).json(ctx.rawEvent || ctx.event)
  }

  try {
    const amountCents = whopMajorToCents(dispute.amount)
    const feeCents = whopDisputeFeeCents()
    // Shape compatible with closeDisputeForPaymentRequest (Stripe-like fields)
    const shaped = {
      ...dispute,
      amount: amountCents,
      balance_transactions: [{ fee: feeCents }],
      reason: dispute.reason,
      created: dispute.created_at
        ? Math.floor(new Date(dispute.created_at).getTime() / 1000)
        : Math.floor(Date.now() / 1000)
    }

    await closeDisputeForPaymentRequest({
      source_id: paymentId,
      status,
      dispute: shaped
    })
  } catch (error: any) {
    console.error('[whop] dispute.updated error', error)
    const code = error?.statusCode || error?.status || 500
    return ctx.res.status(code).json({ error: error?.message || 'dispute_error' })
  }

  return ctx.res.status(200).json(ctx.rawEvent || ctx.event)
}

export function registerWhopHandlers(
  registry: WebhookEventRegistry = new WebhookEventRegistry()
): WebhookEventRegistry {
  registry
    .onRaw('payment.succeeded', handlePaymentSucceeded)
    .onRaw('payment.failed', handlePaymentFailed)
    .onRaw('invoice.paid', handleInvoicePaid)
    .onRaw('invoice.created', handleInvoiceCreated)
    .onRaw('invoice.past_due', handleInvoiceFailed)
    .onRaw('invoice.voided', handleInvoiceFailed)
    .onRaw('withdrawal.created', handleWithdrawal)
    .onRaw('withdrawal.updated', handleWithdrawal)
    .onRaw('refund.created', handleRefund)
    .onRaw('refund.updated', handleRefund)
    .onRaw('dispute.created', handleDisputeCreated)
    .onRaw('dispute.updated', handleDisputeUpdated)

  registry
    .onNormalized('payment.succeeded', handlePaymentSucceeded)
    .onNormalized('payment.failed', handlePaymentFailed)
    .onNormalized('invoice.paid', handleInvoicePaid)
    .onNormalized('invoice.created', handleInvoiceCreated)
    .onNormalized('invoice.failed', handleInvoiceFailed)
    .onNormalized('checkout.completed', handlePaymentSucceeded)
    .onNormalized('payout.created', handleWithdrawal)
    .onNormalized('payout.updated', handleWithdrawal)
    .onNormalized('payout.paid', handleWithdrawal)
    .onNormalized('payment.refunded', handleRefund)
    .onNormalized('dispute.created', handleDisputeCreated)
    .onNormalized('dispute.updated', handleDisputeUpdated)

  return registry
}

let whopRegistry: WebhookEventRegistry | null = null

export function getWhopWebhookRegistry(): WebhookEventRegistry {
  if (!whopRegistry) {
    whopRegistry = registerWhopHandlers()
  }
  return whopRegistry
}

export function resetWhopWebhookRegistry(): void {
  whopRegistry = null
}
