import { processPaymentRequestPaymentFromCheckoutSession } from '../../services/paymentRequest/processPaymentRequestPayment'

/**
 * Payment-request checkout completion.
 * Accepts a Stripe-shaped event (`event.data.object` = Checkout Session) today.
 * Whop will adapt payment.succeeded into the same session-like object before calling this.
 */
export default async function checkoutSessionCompleted(event: any, req: any, res: any) {
  try {
    // Support both Stripe event envelope and a bare session object (normalized path).
    const session = event?.data?.object ?? event
    console.log('[checkoutSessionCompleted] handling session', {
      id: session?.id,
      payment_status: session?.payment_status,
      eventType: event?.type
    })
    await processPaymentRequestPaymentFromCheckoutSession(session)
    return res.status(200).json(req.body)
  } catch (error: any) {
    console.error('[checkoutSessionCompleted] error', {
      message: error?.message,
      stack: error?.stack,
      statusCode: error?.statusCode,
      eventType: event?.type
    })
    const message = error?.message || 'Error processing checkout session completed'
    const status = error?.statusCode || error?.status || 500
    return res.status(status).json({ error: message })
  }
}
