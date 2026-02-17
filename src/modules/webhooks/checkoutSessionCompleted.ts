import { processPaymentRequestPaymentFromCheckoutSession } from '../../services/paymentRequest/processPaymentRequestPayment'

export default async function checkoutSessionCompleted(event: any, req: any, res: any) {
  try {
    const session = event?.data?.object
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
