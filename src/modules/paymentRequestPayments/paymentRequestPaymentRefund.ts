import models from '../../models'
import Stripe from '../shared/stripe/stripe'

const stripe = Stripe()
const currentModels = models as any

type PaymentRequestPaymentListParams = {
  id: number
  userId: number
}

async function getTransferByPaymentRequestPaymentId(paymentRequestPaymentId: string) {
  const transfers = await stripe.transfers.list({
    transfer_group: paymentRequestPaymentId,
    limit: 1
  })
  return transfers.data[0] ?? null
}

export async function paymentRequestRefund({ id, userId }: PaymentRequestPaymentListParams) {
  const paymentRequestPayment = await currentModels.PaymentRequestPayment.findOne({
    where: {
      id: id,
      userId: userId
    }
  })
  const sourceId = paymentRequestPayment?.source
  if (sourceId) {
    const refund = await stripe.refunds.create({
      payment_intent: sourceId
    })
    if (refund.status === 'succeeded') {
      paymentRequestPayment.status = 'refunded'
      await paymentRequestPayment.save()
      const transferGroupId = `payment_request_payment_${paymentRequestPayment.id}`
      const transfer = await getTransferByPaymentRequestPaymentId(transferGroupId)
      if (transfer) {
        const reversal = await stripe.transfers.createReversal(transfer.id, {})
        if (reversal.id) {
          const paymentRequestTransfer = await currentModels.PaymentRequestTransfer.findOne({
            where: {
              transfer_id: transfer.id,
              userId: userId
            }
          })

          if (paymentRequestTransfer) {
            paymentRequestTransfer.status = 'reversed'
            await paymentRequestTransfer.save()
          }
        }
      }
      return paymentRequestPayment
    } else {
      throw new Error('Refund failed')
    }
  }
  throw new Error('Payment source not found')
}
