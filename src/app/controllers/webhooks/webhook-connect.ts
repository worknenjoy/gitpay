/* eslint-disable no-console */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

import { getPaymentProvider } from '../../../providers'
import { getStripeConnectWebhookRegistry } from '../../../modules/webhooks/register'

exports.webhookConnect = async (req: any, res: any) => {
  const stripeProvider = getPaymentProvider('stripe')

  let providerEvent

  try {
    providerEvent = await stripeProvider.verifyAndParseWebhook(req, 'connect')
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  console.log('✅ Received event:', providerEvent.type)

  if (!providerEvent) {
    return res.send(false)
  }

  const registry = getStripeConnectWebhookRegistry()
  return registry.dispatch(providerEvent, req, res, (type) => stripeProvider.mapEventType(type))
}
