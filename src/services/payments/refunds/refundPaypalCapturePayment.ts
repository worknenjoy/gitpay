import Models from '../../../models'
import PaymentMail from '../../../mail/payment'
import { PaypalConnect } from '../../../client/provider/paypal'

const models = Models as any

// Deprecated: prefer refundPaypalPayment (it can resolve capture ids when missing).
export type RefundPaypalCapturePaymentReason = 'old_open_bounty'

type RefundPaypalCapturePaymentParams = {
  orderId: number
  reason?: RefundPaypalCapturePaymentReason
  ageDays?: number | null
  olderThanDays?: number
}

function validateCaptureId(captureId: string): string {
  const CAPTURE_ID_REGEX = /^[A-Za-z0-9\-_.]{1,128}$/
  if (!CAPTURE_ID_REGEX.test(captureId)) {
    throw new Error('Invalid capture id')
  }
  return captureId
}

function toFixedAmount(value: unknown): string {
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(n)) return '0.00'
  return n.toFixed(2)
}

export async function refundPaypalCapturePayment({
  orderId,
  reason,
  ageDays,
  olderThanDays
}: RefundPaypalCapturePaymentParams) {
  const order = await models.Order.findByPk(orderId, {
    include: [models.User, models.Task]
  })

  if (!order) {
    throw new Error('order_not_found')
  }

  if (String(order.provider).toLowerCase() !== 'paypal') {
    throw new Error('invalid_provider')
  }

  if (order.status === 'refunded' || order.status === 'canceled') {
    return order.dataValues ?? order
  }

  if (!order.transfer_id) {
    throw new Error('paypal_capture_missing')
  }

  const captureId = validateCaptureId(order.transfer_id)
  const currencyCode = String(order.currency || 'USD').toUpperCase()
  const amountValue = toFixedAmount(order.amount)

  const refundData = await PaypalConnect({
    method: 'POST',
    uri: `${process.env.PAYPAL_HOST}/v2/payments/captures/${captureId}/refund`,
    body: {
      amount: {
        value: amountValue,
        currency_code: currencyCode
      }
    }
  })

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
    await PaymentMail.oldBountyPaypalRefunded(user, task, orderData, {
      ageDays: ageDays ?? null,
      olderThanDays: olderThanDays ?? 365
    })
  } else {
    await PaymentMail.refund(user, task, orderData)
  }

  return orderData
}
