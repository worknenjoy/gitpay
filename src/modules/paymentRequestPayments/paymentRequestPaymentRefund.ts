import models from '../../models'
import { getPaymentProvider } from '../../providers'

const currentModels = models as any

type PaymentRequestRefundParams = {
  id: number
  userId: number
}

function isRefundSuccessful(status: string | undefined | null): boolean {
  if (!status) return true
  const s = String(status).toLowerCase()
  return s === 'succeeded' || s === 'success' || s === 'pending' || s === 'completed'
}

/**
 * Refund a payment-request payment via the provider stored on the parent PaymentRequest
 * (Stripe PaymentIntent or Whop payment id). Best-effort reverse of the linked transfer.
 */
export async function paymentRequestRefund({ id, userId }: PaymentRequestRefundParams) {
  const paymentRequestPayment = await currentModels.PaymentRequestPayment.findOne({
    where: {
      id: id,
      userId: userId
    },
    include: [{ model: currentModels.PaymentRequest }]
  })

  if (!paymentRequestPayment) {
    throw new Error('Payment Request Payment not found')
  }

  const sourceId = paymentRequestPayment.source
  if (!sourceId) {
    throw new Error('Payment source not found')
  }

  const paymentRequest = paymentRequestPayment.PaymentRequest
  const paymentProvider = getPaymentProvider(paymentRequest?.provider || undefined)

  const refund = await paymentProvider.refund({
    paymentReference: sourceId
  })

  if (!isRefundSuccessful(refund.status)) {
    throw new Error('Refund failed')
  }

  paymentRequestPayment.status = 'refunded'
  await paymentRequestPayment.save()

  // Prefer the transfer row linked to this payment; fall back to PR transfer_id
  let paymentRequestTransfer = null as any
  if (paymentRequestPayment.transferId) {
    paymentRequestTransfer = await currentModels.PaymentRequestTransfer.findByPk(
      paymentRequestPayment.transferId
    )
  }
  if (!paymentRequestTransfer && paymentRequest?.transfer_id) {
    paymentRequestTransfer = await currentModels.PaymentRequestTransfer.findOne({
      where: {
        transfer_id: paymentRequest.transfer_id,
        userId
      }
    })
  }
  if (!paymentRequestTransfer) {
    paymentRequestTransfer = await currentModels.PaymentRequestTransfer.findOne({
      where: {
        paymentRequestId: paymentRequestPayment.paymentRequestId,
        userId
      },
      order: [['createdAt', 'DESC']]
    })
  }

  // Stripe legacy path: locate transfer by transfer_group when no local row
  let transferIdToReverse = paymentRequestTransfer?.transfer_id as string | undefined
  if (!transferIdToReverse && paymentProvider.name === 'stripe') {
    const { getStripeClient } = await import('../../provider/stripe/client')
    const stripe = getStripeClient()
    const transferGroupId = `payment_request_payment_${paymentRequestPayment.id}`
    const transfers = await stripe.transfers.list({
      transfer_group: transferGroupId,
      limit: 1
    })
    transferIdToReverse = transfers.data[0]?.id
    if (transferIdToReverse && !paymentRequestTransfer) {
      paymentRequestTransfer = await currentModels.PaymentRequestTransfer.findOne({
        where: { transfer_id: transferIdToReverse, userId }
      })
    }
  }

  if (transferIdToReverse) {
    try {
      await paymentProvider.reverseTransfer(transferIdToReverse, {})
    } catch (error) {
      // Whop has no reverse API; Stripe may fail if already reversed — still mark local state when possible
      console.error('Transfer reverse failed (continuing):', error)
    }

    if (paymentRequestTransfer) {
      paymentRequestTransfer.status = 'reversed'
      await paymentRequestTransfer.save()
    }
  }

  return paymentRequestPayment
}
