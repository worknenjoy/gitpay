/* eslint-disable no-console */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

import { getPaymentProvider } from '../../../providers'
import { getWhopWebhookRegistry } from '../../../modules/webhooks/register/whopHandlers'

exports.webhookWhop = async (req: any, res: any) => {
  const whopProvider = getPaymentProvider('whop')

  let providerEvent

  try {
    providerEvent = await whopProvider.verifyAndParseWebhook(req, 'platform')
  } catch (err: any) {
    console.error('❌ Whop webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  console.log('✅ Received Whop event:', providerEvent.type)

  if (!providerEvent) {
    return res.send(false)
  }

  const registry = getWhopWebhookRegistry()
  return registry.dispatch(providerEvent, req, res, (type) => whopProvider.mapEventType(type))
}
