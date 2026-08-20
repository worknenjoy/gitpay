import { handleChargeRefundedIssue } from './chargeRefundedIssue'
import { handleChargeRefundedPaymentRequest } from './chargeRefundedPaymentRequest'

export const handleChargeRefunded = async (event: any, req: any, res: any) => {
  try {
    const { data } = event || {}
    const { object } = data || {}
    const { payment_intent, metadata, refunds } = object || {}
    // charge.amount_refunded is the CUMULATIVE total refunded on the charge across
    // every refund it has ever had — using it as the fee base would double-count on
    // a second partial refund. The latest refund's own `amount` (refunds.data[0],
    // Stripe returns newest first) is this specific event's actual delta.
    const latestRefund = refunds?.data?.[0]

    if (metadata && metadata.order_id) {
      await handleChargeRefundedIssue(event)
      return res.json(req.body)
    }

    if (payment_intent) {
      try {
        await handleChargeRefundedPaymentRequest({
          payment_intent_id: payment_intent,
          refund_amount: latestRefund?.amount,
          refund_id: latestRefund?.id
        })
      } catch (err: any) {
        console.error('Error handling charge.refunded for payment request:', err)
      }
      return res.json(req.body)
    }

    return res.json(req.body)
  } catch (error) {
    console.error('Error processing charge.refunded event:', error)
    return res.status(500).send('Internal Server Error')
  }
}
