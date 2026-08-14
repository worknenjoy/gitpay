import { WebhookEventRegistry } from '../../../providers/webhooks'
import type { WebhookHandlerContext } from '../../../providers/webhooks'

import chargeSucceeded from '../chargeSucceeded'
import checkoutSessionCompleted from '../checkoutSessionCompleted'
import customerSourceCreated from '../customerSourceCreated'
import chargeUpdated from '../chargeUpdated'
import chargeFailed from '../chargeFailed'
import { handleChargeRefunded } from '../charges/chargeRefunded/chargeRefunded'
import { chargeDisputeCreatedWebhookHandler, chargeDisputeClosedWebhookHandler } from '../charges'
import invoiceCreated from '../invoiceCreated'
import invoiceUpdated from '../invoiceUpdated'
import invoicePaid from '../invoicePaid'
import invoiceFinalized from '../invoiceFinalized'
import { transferCreated } from '../transfers'
import { transferReversed } from '../transfers'
import { chargeDisputeFundsWithdrawnWebhookHandler } from '../charges/chargeDisputeFundsWithdrawn/chargeDisputeFundsWithdrawn'
import balanceAvailable from '../balanceAvailable'
import invoicePaymentSucceeded from '../invoicePaymentSucceeded'
import invoicePaymentFailed from '../invoicePaymentFailed'

/** Legacy Stripe handlers that take (event, paid, status, req, res) */
function withPaidStatus(handler: (event: any, paid: any, status: any, req: any, res: any) => any) {
  return (ctx: WebhookHandlerContext) => {
    const event = ctx.rawEvent
    const paid = event?.data?.object?.paid || false
    const status = event?.data?.object?.status
    return handler(event, paid, status, ctx.req, ctx.res)
  }
}

/** Legacy Stripe handlers that take (event, req, res) */
function withEvent(handler: (event: any, req: any, res: any) => any) {
  return (ctx: WebhookHandlerContext) => handler(ctx.rawEvent, ctx.req, ctx.res)
}

/**
 * Registers all Stripe platform webhook handlers on a registry.
 * Uses raw event types so existing domain modules keep working unchanged.
 */
export function registerStripePlatformHandlers(
  registry: WebhookEventRegistry = new WebhookEventRegistry()
): WebhookEventRegistry {
  registry
    .onRaw('customer.source.created', withEvent(customerSourceCreated))
    .onRaw('charge.updated', withPaidStatus(chargeUpdated))
    .onRaw('charge.refunded', withEvent(handleChargeRefunded))
    .onRaw('charge.succeeded', withPaidStatus(chargeSucceeded))
    .onRaw('charge.failed', withPaidStatus(chargeFailed))
    .onRaw('charge.dispute.created', withEvent(chargeDisputeCreatedWebhookHandler))
    .onRaw('charge.dispute.funds_withdrawn', withEvent(chargeDisputeFundsWithdrawnWebhookHandler))
    .onRaw('charge.dispute.closed', withEvent(chargeDisputeClosedWebhookHandler))
    .onRaw('invoice.created', withEvent(invoiceCreated))
    .onRaw('invoice.updated', withEvent(invoiceUpdated))
    .onRaw('invoice.paid', withEvent(invoicePaid))
    .onRaw('invoice.finalized', withEvent(invoiceFinalized))
    .onRaw('transfer.created', withEvent(transferCreated))
    .onRaw('transfer.reversed', withEvent(transferReversed))
    .onRaw('balance.available', withEvent(balanceAvailable))
    .onRaw('invoice.payment_succeeded', withEvent(invoicePaymentSucceeded))
    .onRaw('invoice.payment_failed', withEvent(invoicePaymentFailed))
    .onRaw('checkout.session.completed', withEvent(checkoutSessionCompleted))
    .onRaw('checkout.session.async_payment_succeeded', withEvent(checkoutSessionCompleted))

  // Normalized aliases so a future Whop adapter can dispatch the same domain path
  // for payment-request checkout without knowing Stripe event names.
  registry.onNormalized('checkout.completed', withEvent(checkoutSessionCompleted))

  return registry
}

let platformRegistry: WebhookEventRegistry | null = null

export function getStripePlatformWebhookRegistry(): WebhookEventRegistry {
  if (!platformRegistry) {
    platformRegistry = registerStripePlatformHandlers()
  }
  return platformRegistry
}

export function resetStripePlatformWebhookRegistry(): void {
  platformRegistry = null
}
