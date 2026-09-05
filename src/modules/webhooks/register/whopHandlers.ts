import Models from '../../../models'
import { getWhopClient } from '../../../providers/whop/client'
import { WebhookEventRegistry } from '../../../providers/webhooks'
import type { WebhookHandlerContext } from '../../../providers/webhooks'
import { processPaymentRequestPaymentFromCheckoutSession } from '../../../services/paymentRequest/processPaymentRequestPayment'
import {
  createDisputeForPaymentRequest,
  withDrawnDisputeForPaymentRequest,
  closeDisputeForPaymentRequest
} from '../../../services/payments/disputes/disputeService'
import { debitRefundForPaymentRequest } from '../../../services/payments/refunds/refundBalanceService'
import {
  debitExtraFeeForPaymentRequest,
  WHOP_DISPUTE_ALERT_FEE_CENTS
} from '../../../services/payments/fees/extraFeeService'
import { createPayoutRecord } from '../../../mutations/payout/createPayoutRecord'
import PayoutMail from '../../../mail/payout'
import PaymentRequestMail from '../../../mail/paymentRequest'
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
 *
 * - amount_total: charge/creator total (gross) → PaymentRequestPayment.amount + payment-made email
 * - amount_after_fees: platform net after Whop processor fees → claim/transfer base (then Gitpay 8%)
 */
function paymentToCheckoutSession(payment: any, options: { forcePaid?: boolean } = {}) {
  const metadata = mergePaymentMetadata(payment)
  const major =
    payment?.total ??
    payment?.usd_total ??
    payment?.settlement_amount ??
    payment?.amount ??
    payment?.final_amount ??
    0
  const cents = whopMajorToCents(major)

  // Major units (e.g. 0.57). Only set when Whop provides it (payment.succeeded).
  const amountAfterFeesMajor =
    payment?.amount_after_fees != null && payment?.amount_after_fees !== ''
      ? Number(payment.amount_after_fees)
      : null

  // Whop's own reported application fee, when present on the payment object.
  // Assumed major currency units, consistent with the sibling amount fields above
  // (Whop's docs don't call this out explicitly — verify against a live payload
  // if this ever looks off by a factor of 100).
  const providerFeeAmountMajor =
    payment?.application_fee?.amount != null && payment?.application_fee?.amount !== ''
      ? Number(payment.application_fee.amount)
      : null

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
    // Gitpay extension: not a Stripe field; used for Whop claim base
    amount_after_fees:
      amountAfterFeesMajor != null && Number.isFinite(amountAfterFeesMajor)
        ? amountAfterFeesMajor
        : null,
    // Gitpay extension: not a Stripe field; provider's own reported fee for the "Whop Fee" email row
    provider_fee_amount:
      providerFeeAmountMajor != null && Number.isFinite(providerFeeAmountMajor)
        ? providerFeeAmountMajor
        : null,
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

  // Metadata correlation is authoritative when present — it must win over whatever
  // paymentToCheckoutSession already derived from the raw plan id. That derivation
  // (payment.plan?.id) is correct for a fixed persistent plan, but wrong for a
  // custom-amount payment request: createCheckoutForAmount mints a fresh, single-use
  // plan per payer, so its id never equals PaymentRequests.payment_link_id (which
  // stores the product id in that case) — falling through to the plan-id-based
  // lookup below would 404 in processCheckoutSessionCompleted.
  if (metadata.payment_request_id) {
    const pr = await models.PaymentRequest.findByPk(metadata.payment_request_id)
    if (pr?.payment_link_id) {
      session.payment_link = pr.payment_link_id
    }
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
    if (!orderId) {
      console.warn('[whop] bounty payment missing order_id')
      return ctx.res.status(200).json(ctx.rawEvent || ctx.event)
    }
    try {
      const { markBountyOrderPaid } = await import('../../../services/orders/markBountyOrderPaid')
      await markBountyOrderPaid({
        orderId: Number(orderId),
        paymentSourceId: payment.id,
        provider: 'whop'
      })
    } catch (error: any) {
      if (String(error?.message || '').includes('not found')) {
        console.warn('[whop] order not found for payment', orderId)
        return ctx.res.status(200).json(ctx.rawEvent || ctx.event)
      }
      console.error('[whop] bounty paid error', error)
      return ctx.res.status(500).json({ error: error?.message || 'bounty_order_error' })
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

/** Whop may send plan/product as an object `{ id }` or a bare id string. */
function resolveWhopResourceId(value: unknown): string | null {
  if (value == null || value === '') return null
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null && 'id' in value) {
    const id = (value as { id?: unknown }).id
    return id != null && id !== '' ? String(id) : null
  }
  return null
}

/**
 * Whop product/plan checkouts often emit `membership.activated` (and sometimes
 * `membership.went_valid`) when access is granted after purchase. For payment
 * requests we create one-time plans; that event is a reliable "paid" signal even
 * when `payment.succeeded` is delayed, filtered, or not delivered to this webhook.
 *
 * Payload shape differs from payments: no amount_after_fees / pay_ id. Primary match is
 * metadata.payment_request_id (works for both a fixed persistent plan and a dynamically
 * minted per-payer plan — e.g. Whop custom-amount payment requests, where a fresh plan id
 * is created per checkout via createCheckoutForAmount and can never equal the stored
 * PaymentRequests.payment_link_id, which holds the product id in that case). Falls back to
 * plan.id → PaymentRequests.payment_link_id for older/fixed-price plans without metadata.
 *
 * Requires BOTH:
 * 1) Whop dashboard webhook subscribed to `membership.activated`
 * 2) This handler registered in `registerWhopHandlers` (restart API after deploy)
 */
async function handleMembershipActivated(ctx: WebhookHandlerContext) {
  const membership = ctx.event.data?.object || ctx.rawEvent?.data || ctx.rawEvent
  const planId =
    resolveWhopResourceId(membership?.plan) ||
    resolveWhopResourceId(membership?.plan_id) ||
    resolveWhopResourceId(membership?.data?.plan)
  const productId =
    resolveWhopResourceId(membership?.product) || resolveWhopResourceId(membership?.product_id)
  const metadata = {
    ...(membership?.plan?.metadata || {}),
    ...(membership?.product?.metadata || {}),
    ...(membership?.metadata || {})
  }

  console.log('[whop] membership.activated/went_valid handler running', {
    id: membership?.id,
    planId,
    productId,
    planType: typeof membership?.plan,
    keys: membership && typeof membership === 'object' ? Object.keys(membership) : [],
    metadata
  })

  // Bounty order (embedded checkout) — one-time plan purchases often deliver this
  // event instead of / before payment.succeeded (see handlePaymentSucceeded above).
  if (metadata.order_id || metadata.purpose === 'bounty_order') {
    const orderId = metadata.order_id
    if (!orderId) {
      console.warn('[whop] bounty membership event missing order_id')
      return ctx.res.status(200).json(ctx.rawEvent || ctx.event)
    }
    const paymentSourceId =
      membership?.payment?.id ||
      membership?.payment_id ||
      membership?.last_payment_id ||
      membership?.id
    try {
      const { markBountyOrderPaid } = await import('../../../services/orders/markBountyOrderPaid')
      await markBountyOrderPaid({
        orderId: Number(orderId),
        paymentSourceId,
        provider: 'whop'
      })
    } catch (error: any) {
      if (String(error?.message || '').includes('not found')) {
        console.warn('[whop] order not found for membership event', orderId)
        return ctx.res.status(200).json(ctx.rawEvent || ctx.event)
      }
      console.error('[whop] bounty membership paid error', error)
      return ctx.res.status(500).json({ error: error?.message || 'bounty_order_error' })
    }

    return ctx.res.status(200).json(ctx.rawEvent || ctx.event)
  }

  if (!planId && !productId && !metadata.payment_request_id) {
    console.warn(
      '[whop] membership event: missing plan/product id and metadata — cannot match PaymentRequest',
      { membershipId: membership?.id }
    )
    return ctx.res.status(200).json(ctx.rawEvent || ctx.event)
  }

  const pr = metadata.payment_request_id
    ? await models.PaymentRequest.findByPk(metadata.payment_request_id)
    : planId
      ? await models.PaymentRequest.findOne({ where: { payment_link_id: planId } })
      : null

  if (!pr) {
    console.warn(
      '[whop] membership event: no PaymentRequest matched (metadata.payment_request_id=',
      metadata.payment_request_id,
      ', payment_link_id=',
      planId,
      ')'
    )
    return ctx.res.status(200).json(ctx.rawEvent || ctx.event)
  }

  console.log('[whop] membership matched PaymentRequest', {
    paymentRequestId: pr.id,
    payment_link_id: pr.payment_link_id,
    status: pr.status
  })

  // Prefer a real payment id when Whop embeds it; else membership id (idempotent per purchase)
  const paymentSourceId =
    membership?.payment?.id ||
    membership?.payment_id ||
    membership?.last_payment_id ||
    membership?.id

  const planMetadata = {
    ...(membership?.plan?.metadata || {}),
    ...(membership?.product?.metadata || {}),
    ...(membership?.metadata || {}),
    purpose: 'payment_request',
    payment_request_id: String(pr.id),
    payment_link_id: pr.payment_link_id,
    user_id: pr.userId != null ? String(pr.userId) : undefined
  }

  // amount_total path uses major units → cents.
  // For fixed-amount payment requests, PR.amount is the real price (major units, e.g. 100.00).
  // For custom-amount payment requests PR.amount is null — the buyer picked the amount at
  // checkout, and it only exists on the dynamically-minted plan Whop just activated a
  // membership for. Fetch that plan's initial_price rather than fabricating $0 from a
  // field that was never set. planId is required here; if Whop somehow omitted it, this
  // event can't be trusted for the amount and is skipped (payment.succeeded should still
  // deliver the correct amount via its own metadata-based correlation path).
  let amountMajor = Number(pr.amount) || 0
  if (pr.custom_amount) {
    if (!planId) {
      console.warn(
        '[whop] membership event: custom-amount PR matched but no plan id to read the real amount from',
        { paymentRequestId: pr.id }
      )
      return ctx.res.status(200).json(ctx.rawEvent || ctx.event)
    }
    try {
      const plan = await getWhopClient().get<any>(`/plans/${planId}`)
      amountMajor = Number(plan?.initial_price) || 0
    } catch (error) {
      console.error('[whop] membership event: failed to fetch plan for custom-amount PR', {
        paymentRequestId: pr.id,
        planId,
        error
      })
      return ctx.res.status(200).json(ctx.rawEvent || ctx.event)
    }
  }

  const pseudoPayment = {
    id: paymentSourceId,
    status: 'succeeded',
    total: amountMajor,
    currency: pr.currency || 'usd',
    plan: {
      id: pr.payment_link_id,
      metadata: planMetadata
    },
    product: membership?.product,
    user: membership?.user || membership?.member,
    metadata: planMetadata
  }

  try {
    const session = await resolvePaymentRequestSession(pseudoPayment, planMetadata)
    session.payment_link = pr.payment_link_id
    console.log('[whop] PR membership → checkout session', {
      payment_link: session.payment_link,
      payment_status: session.payment_status,
      amount_total: session.amount_total,
      payment_request_id: pr.id,
      source: paymentSourceId
    })
    await processPaymentRequestPaymentFromCheckoutSession(session)
    return ctx.res.status(200).json(ctx.rawEvent || ctx.event)
  } catch (error: any) {
    console.error('[whop] membership payment request error', error)
    const status = error?.statusCode || error?.status || 500
    return ctx.res.status(status).json({ error: error?.message || 'membership_pr_error' })
  }
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
    where: { source_id: invoiceId, provider: 'whop' }
  })
  if (order) {
    try {
      const { markBountyOrderPaid } = await import('../../../services/orders/markBountyOrderPaid')
      await markBountyOrderPaid({
        orderId: order.id,
        paymentSourceId: invoiceId,
        provider: 'whop'
      })
    } catch (e) {
      console.error('[whop] invoice order paid error', e)
    }
    return ctx.res.status(200).json(ctx.rawEvent || ctx.event)
  }

  // Wallet top-up invoice
  const walletOrder = await models.WalletOrder.findOne({
    where: { source: invoiceId, provider: 'whop' }
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
    const walletOrder = await models.WalletOrder.findOne({
      where: { source: invoiceId, provider: 'whop' }
    })
    if (walletOrder && !walletOrder.paid) {
      await walletOrder.update({ status: 'failed' })
    }
  }
  return ctx.res.status(200).json(ctx.rawEvent || ctx.event)
}

const WHOP_PAID_STATUSES = ['paid', 'completed', 'succeeded']
const WHOP_FAILED_STATUSES = ['failed', 'canceled', 'cancelled', 'denied']

/**
 * Sends the status-appropriate PayoutMail. Returns true only on a genuine
 * successful send (false if skipped or delivery failed) so callers can decide
 * whether to advance Payout.notified_status.
 */
async function sendWithdrawalStatusMail(
  user: any,
  payout: any,
  status: string | undefined
): Promise<boolean> {
  const normalized = status ? String(status).toLowerCase() : ''

  if (WHOP_PAID_STATUSES.includes(normalized)) {
    return PayoutMail.payoutPaid(user, payout)
  } else if (WHOP_FAILED_STATUSES.includes(normalized)) {
    return PayoutMail.payoutFailed(user, payout)
  }
  return PayoutMail.payoutUpdated(user, payout)
}

/**
 * Create-or-update a Payout from a Whop withdrawal object, sending/retrying the
 * appropriate PayoutMail. Shared by the webhook handler, the reconciliation
 * cron, and the manual sync script — all three funnel through this single
 * function so row + notification behavior stays identical regardless of
 * trigger, and a mail send that failed on one pass gets retried on the next
 * (via Payout.notified_status lagging behind Payout.status).
 */
export async function upsertWhopPayoutFromWithdrawal(
  withdrawal: any,
  companyId: string | undefined
) {
  const withdrawalId = withdrawal?.id
  const status = withdrawal?.status

  if (!withdrawalId) return null

  const existingPayout = await models.Payout.findOne({ where: { source_id: withdrawalId } })

  if (!existingPayout) {
    if (!companyId) {
      console.warn('[whop] no company_id for withdrawal', withdrawalId)
      return null
    }

    const user = await models.User.findOne({ where: { whop_account_id: companyId } })
    if (!user) {
      console.warn('[whop] no user found for withdrawal company', { withdrawalId, companyId })
      return null
    }

    const payout = await createPayoutRecord({
      source_id: withdrawalId,
      userId: user.id,
      amount: whopMajorToCents(withdrawal.amount),
      currency: withdrawal.currency || 'usd',
      method: 'whop',
      status: status || 'pending'
    })

    const normalizedStatus = status ? String(status).toLowerCase() : ''
    if (WHOP_PAID_STATUSES.includes(normalizedStatus)) {
      await payout.update({ paid: true })
    }

    const sent = await PayoutMail.payoutCreated(user, payout)
    if (sent || !user.receiveNotifications) {
      await payout.update({ notified_status: payout.status })
    }

    return payout
  }

  const update: any = {}
  if (status) update.status = status
  if (status && WHOP_PAID_STATUSES.includes(String(status).toLowerCase())) {
    update.paid = true
  }
  if (status && WHOP_FAILED_STATUSES.includes(String(status).toLowerCase())) {
    update.paid = false
  }

  if (Object.keys(update).length > 0) {
    await existingPayout.update(update)
  }

  const needsNotification =
    Boolean(existingPayout.status) && existingPayout.status !== existingPayout.notified_status

  if (needsNotification) {
    const user = await models.User.findByPk(existingPayout.userId)
    if (user) {
      const sent = await sendWithdrawalStatusMail(user, existingPayout, existingPayout.status)
      if (sent || !user.receiveNotifications) {
        await existingPayout.update({ notified_status: existingPayout.status })
      }
    }
  }

  return existingPayout
}

async function handleWithdrawal(ctx: WebhookHandlerContext) {
  const withdrawal = ctx.event.data.object || ctx.rawEvent?.data
  const withdrawalId = withdrawal?.id
  const status = withdrawal?.status
  // Whop envelope places company_id as a sibling of `data`, not nested inside it.
  const companyId = ctx.rawEvent?.company_id ?? withdrawal?.company_id

  console.log('[whop] withdrawal event', {
    type: ctx.event.type,
    withdrawalId,
    status,
    companyId
  })

  try {
    await upsertWhopPayoutFromWithdrawal(withdrawal, companyId)
  } catch (error) {
    console.error('[whop] error processing withdrawal', { withdrawalId, error })
    return ctx.res.status(500).json({ error: 'withdrawal_processing_error' })
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

  if (paymentId && refund?.id) {
    try {
      await debitRefundForPaymentRequest({
        refund_id: refund.id,
        source_id: paymentId,
        refunded_amount: whopMajorToCents(refund.amount)
      })
    } catch (error: any) {
      console.error('[whop] refund balance debit error', error)
      const status = error?.statusCode || error?.status || 500
      return ctx.res.status(status).json({ error: error?.message || 'refund_error' })
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

/**
 * Whop's Early Dispute Alerts: an early warning from the card network before a
 * dispute is formalized. `charge_for_alert` tells us whether Whop billed the
 * platform for this specific alert (~$29, see WHOP_DISPUTE_ALERT_FEE_CENTS) —
 * independent of whether the alert later becomes a refund (dispute.created is
 * never sent for alerts Whop auto-refunds) or escalates into a formal dispute.
 * No money has moved yet at alert time beyond that fee, so this handler only
 * debits the alert fee (when charged) and notifies the seller — the refund or
 * dispute clawback is captured separately by handleRefund / handleDisputeCreated
 * when (if) that event actually arrives.
 */
async function handleDisputeAlertCreated(ctx: WebhookHandlerContext) {
  const alert = ctx.event.data.object || ctx.rawEvent?.data
  const paymentId = alert?.payment?.id
  const alertId = alert?.id

  console.log('[whop] dispute_alert.created', {
    alertId,
    paymentId,
    amount: alert?.amount,
    alertType: alert?.alert_type,
    chargeForAlert: alert?.charge_for_alert
  })

  if (!paymentId) {
    console.warn('[whop] dispute_alert.created missing payment.id — ignoring')
    return ctx.res.status(200).json(ctx.rawEvent || ctx.event)
  }

  const prPayment = await models.PaymentRequestPayment.findOne({
    where: { source: paymentId },
    include: [
      { model: models.User },
      { model: models.PaymentRequest },
      { model: models.PaymentRequestCustomer }
    ]
  })
  if (!prPayment) {
    console.log('[whop] dispute_alert.created not a payment-request payment', paymentId)
    return ctx.res.status(200).json(ctx.rawEvent || ctx.event)
  }

  try {
    if (alert?.charge_for_alert === true) {
      await debitExtraFeeForPaymentRequest({
        source_id: alertId,
        payment_source_id: paymentId,
        amount: WHOP_DISPUTE_ALERT_FEE_CENTS,
        reason_details: 'whop_dispute_alert_fee',
        closedAt: alert.created_at ? new Date(alert.created_at) : undefined
      })
    }
  } catch (error: any) {
    console.error('[whop] dispute_alert.created fee error', error)
    const status = error?.statusCode || error?.status || 500
    return ctx.res.status(status).json({ error: error?.message || 'dispute_alert_error' })
  }

  PaymentRequestMail.newDisputeAlertForPaymentRequest(prPayment.User, alert, prPayment).catch(
    (mailError: any) => {
      console.error(`Failed to send email for dispute alert: ${alertId}`, mailError)
    }
  )

  return ctx.res.status(200).json(ctx.rawEvent || ctx.event)
}

export function registerWhopHandlers(
  registry: WebhookEventRegistry = new WebhookEventRegistry()
): WebhookEventRegistry {
  registry
    .onRaw('payment.succeeded', handlePaymentSucceeded)
    .onRaw('payment.failed', handlePaymentFailed)
    // Plan/product checkout often delivers membership events instead of / before payment.succeeded
    .onRaw('membership.activated', handleMembershipActivated)
    .onRaw('membership.went_valid', handleMembershipActivated)
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
    .onRaw('dispute_alert.created', handleDisputeAlertCreated)

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
