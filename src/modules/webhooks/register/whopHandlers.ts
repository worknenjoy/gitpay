import Models from '../../../models'
import { WebhookEventRegistry } from '../../../providers/webhooks'
import type { WebhookHandlerContext } from '../../../providers/webhooks'
import { processPaymentRequestPaymentFromCheckoutSession } from '../../../services/paymentRequest/processPaymentRequestPayment'
import PaymentMail from '../../../mail/payment'
const slack = require('../../../shared/slack')

const models = Models as any

/**
 * Adapt a Whop payment object into the Stripe Checkout Session-shaped payload
 * consumed by processPaymentRequestPaymentFromCheckoutSession.
 */
function paymentToCheckoutSession(payment: any) {
  const metadata = payment?.metadata || {}
  const amount = payment?.total || payment?.amount || payment?.final_amount || 0
  // Whop amounts are major units; Stripe session uses cents
  const amountTotalCents =
    typeof amount === 'number' && amount < 100000 && !Number.isInteger(amount * 1000)
      ? Math.round(amount * 100)
      : Math.round(Number(amount) * (amount < 1000 ? 100 : 1))

  // Prefer explicit cents if amount looks like dollars (has decimal or small)
  const cents =
    payment.amount_after_fees != null
      ? Math.round(Number(payment.amount_after_fees) * 100)
      : typeof amount === 'number' && amount % 1 !== 0
        ? Math.round(amount * 100)
        : typeof amount === 'number' && amount < 10000
          ? Math.round(amount * 100)
          : Math.round(Number(amount))

  return {
    id: payment.id,
    payment_link: metadata.payment_link_id || metadata.plan_id || payment.plan?.id || null,
    payment_status: payment.status === 'succeeded' || payment.status === 'paid' ? 'paid' : payment.status,
    amount_total: cents,
    payment_intent: payment.id,
    customer_details: {
      name: payment.user?.name || payment.member?.name || metadata.customer_name,
      email: payment.user?.email || payment.member?.email || metadata.customer_email
    },
    metadata
  }
}

async function handlePaymentSucceeded(ctx: WebhookHandlerContext) {
  const payment = ctx.event.data.object || ctx.rawEvent?.data
  const metadata = payment?.metadata || {}

  console.log('[whop] payment.succeeded', {
    id: payment?.id,
    metadata
  })

  // Payment request checkout
  if (metadata.payment_request_id || metadata.purpose === 'payment_request') {
    const session = paymentToCheckoutSession(payment)
    // Ensure payment_link is set from plan id stored on PR
    if (!session.payment_link && metadata.payment_request_id) {
      const pr = await models.PaymentRequest.findByPk(metadata.payment_request_id)
      session.payment_link = pr?.payment_link_id
    }
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

  // Fallback: try match by payment_link / plan id for payment requests without metadata
  if (payment?.plan?.id || payment?.product?.id) {
    const linkId = payment.plan?.id
    if (linkId) {
      const pr = await models.PaymentRequest.findOne({ where: { payment_link_id: linkId } })
      if (pr) {
        const session = paymentToCheckoutSession({
          ...payment,
          metadata: {
            ...metadata,
            payment_request_id: String(pr.id),
            payment_link_id: linkId
          }
        })
        session.payment_link = linkId
        try {
          await processPaymentRequestPaymentFromCheckoutSession(session)
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
