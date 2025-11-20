import Stripe from '../../shared/stripe/stripe'
import { handleChargeRefundedIssue } from './chargeRefundedIssue'
import { handleChargeRefundedPaymentRequest } from './chargeRefundedPaymentRequest'

const stripe = Stripe()
export const handleChargeRefunded = async (event: any, req: any, res: any) => {
  try {
    const { data } = event || {}
    const { object } = data || {}
    const { payment_intent, metadata } = object || {}

    if (metadata && metadata.order_id) {
      await handleChargeRefundedIssue(event)
      return res.json(req.body)
    }

    if (payment_intent) {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent)
        const piMetadata = paymentIntent.metadata || {}

        if (piMetadata && piMetadata.payment_request_payment_id) {
          await handleChargeRefundedPaymentRequest(paymentIntent)
        }
      } catch (err: any) {
        console.error('Error retrieving Payment Intent:', err)
      }
      return res.json(req.body)
    }

    return res.json(req.body)
  } catch (error) {
    console.error('Error processing charge.refunded event:', error)
    return res.status(500).send('Internal Server Error')
  }
}
