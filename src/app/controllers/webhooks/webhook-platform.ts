/* eslint-disable no-console */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

import { getPaymentProvider } from '../../../providers'
import { getStripePlatformWebhookRegistry } from '../../../modules/webhooks/register'

exports.webhookPlatform = async (req: any, res: any) => {
  const stripeProvider = getPaymentProvider('stripe')

  let providerEvent

  try {
    providerEvent = await stripeProvider.verifyAndParseWebhook(req, 'platform')
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  console.log('✅ Received event:', providerEvent.type)

  if (!providerEvent) {
    return res.send(false)
  }

  const registry = getStripePlatformWebhookRegistry()
  return registry.dispatch(providerEvent, req, res, (type) => stripeProvider.mapEventType(type))
}
