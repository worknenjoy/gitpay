import Models from '../../../models'
import PaymentMail from '../../../mail/payment'
import { PaypalConnect } from '../../../client/provider/paypal'

const models = Models as any

export type RefundPaypalPaymentReason = 'old_open_bounty'

export type PaypalReturnMethod = 'refund' | 'payout'

type RefundPaypalPaymentParams = {
  orderId: number
  reason?: RefundPaypalPaymentReason
  ageDays?: number | null
  olderThanDays?: number
  fallbackToPayoutOnTimeLimit?: boolean
}

function validatePayPalId(id: string, label: string): string {
  const ID_REGEX = /^[A-Za-z0-9\-_.]{1,128}$/
  if (!ID_REGEX.test(id)) {
    throw new Error(`Invalid ${label}`)
  }
  return id
}

function toFixedAmount(value: unknown): string {
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(n)) return '0.00'
  return n.toFixed(2)
}

function tryParseJson(input: unknown): any {
  if (typeof input === 'string') {
    try {
      return JSON.parse(input)
    } catch {
      return null
    }
  }
  return input
}

function extractCaptureIdFromHref(href?: string): string | null {
  if (!href) return null
  const m = href.match(/\/v2\/payments\/captures\/([^/?#]+)/)
  return m?.[1] ?? null
}

function extractCaptureIdFromCheckoutOrderDetails(details: any): string | null {
  const purchaseUnits: any[] = details?.purchase_units ?? []
  for (const unit of purchaseUnits) {
    const captures: any[] = unit?.payments?.captures ?? []
    for (const cap of captures) {
      if (cap?.id) return String(cap.id)
    }
  }
  return null
}

function buildSafePayoutBatchId(orderId: number): string {
  // PayPal has length limits; keep it short and deterministic-ish.
  // Includes timestamp to reduce collision risk across environments.
  const stamp = Date.now().toString(36)
  return `gitpay-${orderId}-${stamp}`.slice(0, 30)
}

async function createPaypalPayout(params: {
  payerId: string
  amountValue: string
  currencyCode: string
  note: string
  senderItemId: string
}): Promise<{ payoutBatchId: string; raw: any }> {
  const response = await PaypalConnect({
    method: 'POST',
    uri: `${process.env.PAYPAL_HOST}/v1/payments/payouts`,
    body: {
      sender_batch_header: {
        sender_batch_id: buildSafePayoutBatchId(Number(params.senderItemId) || 0),
        email_subject: 'Gitpay payout'
      },
      items: [
        {
          recipient_type: 'PAYPAL_ID',
          amount: {
            value: params.amountValue,
            currency: params.currencyCode
          },
          receiver: params.payerId,
          note: params.note,
          sender_item_id: params.senderItemId
        }
      ]
    }
  })

  const payoutBatchId = response?.batch_header?.payout_batch_id
  if (!payoutBatchId) {
    const e: any = new Error('paypal_payout_missing_batch_id')
    e.meta = { response }
    throw e
  }
  return { payoutBatchId: String(payoutBatchId), raw: response }
}

async function resolveCaptureIdFromAuthorization(authorizationId: string): Promise<string | null> {
  const details = await PaypalConnect({
    method: 'GET',
    uri: `${process.env.PAYPAL_HOST}/v2/payments/authorizations/${authorizationId}`
  })

  // Best-effort: some PayPal responses include links to capture resources.
  const links: Array<{ href?: string; rel?: string }> = details?.links ?? []
  for (const link of links) {
    const captureId = extractCaptureIdFromHref(link?.href)
    if (captureId) return captureId
  }

  return null
}

async function resolveCaptureIdFromCheckoutOrder(orderId: string): Promise<string | null> {
  const details = await PaypalConnect({
    method: 'GET',
    uri: `${process.env.PAYPAL_HOST}/v2/checkout/orders/${orderId}`
  })

  return extractCaptureIdFromCheckoutOrderDetails(details)
}

export async function refundPaypalPayment({
  orderId,
  reason,
  ageDays,
  olderThanDays,
  fallbackToPayoutOnTimeLimit
}: RefundPaypalPaymentParams) {
  const order = await models.Order.findByPk(orderId, {
    include: [models.User, models.Task]
  })

  if (!order) {
    throw new Error('order_not_found')
  }

  if (String(order.provider).toLowerCase() !== 'paypal') {
    throw new Error('invalid_provider')
  }

  if (order.status === 'refunded') {
    return order.dataValues ?? order
  }

  const currencyCode = String(order.currency || 'USD').toUpperCase()
  const amountValue = toFixedAmount(order.amount)

  let captureId: string | null = order.transfer_id ? String(order.transfer_id) : null
  if (captureId) {
    captureId = validatePayPalId(captureId, 'capture id')
  }

  // If we don’t have a capture id, try to resolve it from the checkout order (source_id).
  if (!captureId && order.source_id) {
    const checkoutOrderId = validatePayPalId(String(order.source_id), 'order id')
    const resolved = await resolveCaptureIdFromCheckoutOrder(checkoutOrderId)
    if (resolved) {
      captureId = validatePayPalId(String(resolved), 'capture id')

      // Backfill for future runs (best-effort).
      try {
        await order.update({ transfer_id: captureId })
      } catch {
        // ignore
      }
    }
  }

  // If we still don’t have a capture id, try to resolve it from the authorization.
  if (!captureId) {
    if (!order.authorization_id) {
      const e: any = new Error('paypal_capture_missing')
      e.meta = {
        orderId: order.id,
        transfer_id: order.transfer_id ?? null,
        source_id: order.source_id ?? null,
        authorization_id: order.authorization_id ?? null
      }
      throw e
    }

    const authorizationId = validatePayPalId(String(order.authorization_id), 'authorization id')
    captureId = await resolveCaptureIdFromAuthorization(authorizationId)

    if (captureId) {
      captureId = validatePayPalId(captureId, 'capture id')
    }
  }

  if (!captureId) {
    // Keep the error explicit so it’s clear this is a refund-only script.
    const e: any = new Error('paypal_capture_missing')
    e.meta = {
      orderId: order.id,
      transfer_id: order.transfer_id ?? null,
      source_id: order.source_id ?? null,
      authorization_id: order.authorization_id ?? null
    }
    throw e
  }

  let refundData: any
  let returnMethod: PaypalReturnMethod = 'refund'
  try {
    refundData = await PaypalConnect({
      method: 'POST',
      uri: `${process.env.PAYPAL_HOST}/v2/payments/captures/${captureId}/refund`,
      body: {
        amount: {
          value: amountValue,
          currency_code: currencyCode
        }
      }
    })
  } catch (err: any) {
    const parsed = tryParseJson(err?.error)
    const issue = parsed?.details?.[0]?.issue
    // If already refunded, treat as idempotent.
    if (issue === 'ALREADY_REFUNDED') {
      return order.dataValues ?? order
    }

    // Refund window exceeded: optionally fallback to a PayPal Payout (new payment back to payer).
    if (issue === 'REFUND_TIME_LIMIT_EXCEEDED' && fallbackToPayoutOnTimeLimit) {
      const payerIdRaw = order.payer_id ? String(order.payer_id) : ''
      if (!payerIdRaw) {
        const e: any = new Error('paypal_payer_missing')
        e.meta = { orderId: order.id }
        throw e
      }

      const payerId = validatePayPalId(payerIdRaw, 'payer id')
      const note =
        reason === 'old_open_bounty'
          ? 'Refund for old open bounty (time limit exceeded).'
          : 'Refund (time limit exceeded).'

      const payout = await createPaypalPayout({
        payerId,
        amountValue,
        currencyCode,
        note,
        senderItemId: String(order.id)
      })

      returnMethod = 'payout'

      refundData = {
        id: `payout:${payout.payoutBatchId}`,
        payout
      }
    } else {
      throw err
    }
  }

  const updatedOrder = await order.update(
    {
      status: 'refunded',
      paid: false,
      refund_id: refundData?.id
    },
    {
      where: { id: order.id },
      returning: true,
      plain: true
    }
  )

  if (!updatedOrder) {
    throw new Error('update_order_error')
  }

  const orderData =
    updatedOrder.dataValues || (updatedOrder[0] && updatedOrder[0].dataValues) || order.dataValues

  const user = order.User || (await models.User.findByPk(orderData.userId))
  const task = order.Task || (await models.Task.findByPk(orderData.TaskId))

  if (reason === 'old_open_bounty') {
    await PaymentMail.oldBountyPaypalRefunded(
      user,
      task,
      { ...orderData, transfer_id: captureId },
      {
        ageDays: ageDays ?? null,
        olderThanDays: olderThanDays ?? 365,
        returnMethod
      }
    )
  } else {
    await PaymentMail.refund(user, task, { ...orderData, transfer_id: captureId })
  }

  return orderData
}
