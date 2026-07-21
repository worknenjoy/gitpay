import { WebhookEventRegistry } from '../../../providers/webhooks'
import type { WebhookHandlerContext } from '../../../providers/webhooks'
import { payoutCreated, payoutUpdated, payoutFailed, payoutPaid } from '../payouts'

function withEvent(handler: (event: any, req: any, res: any) => any) {
  return (ctx: WebhookHandlerContext) => handler(ctx.rawEvent, ctx.req, ctx.res)
}

export function registerStripeConnectHandlers(
  registry: WebhookEventRegistry = new WebhookEventRegistry()
): WebhookEventRegistry {
  registry
    .onRaw('payout.created', withEvent(payoutCreated))
    .onRaw('payout.failed', withEvent(payoutFailed))
    .onRaw('payout.paid', withEvent(payoutPaid))
    .onRaw('payout.updated', withEvent(payoutUpdated))

  registry
    .onNormalized('payout.created', withEvent(payoutCreated))
    .onNormalized('payout.failed', withEvent(payoutFailed))
    .onNormalized('payout.paid', withEvent(payoutPaid))
    .onNormalized('payout.updated', withEvent(payoutUpdated))

  return registry
}

let connectRegistry: WebhookEventRegistry | null = null

export function getStripeConnectWebhookRegistry(): WebhookEventRegistry {
  if (!connectRegistry) {
    connectRegistry = registerStripeConnectHandlers()
  }
  return connectRegistry
}

export function resetStripeConnectWebhookRegistry(): void {
  connectRegistry = null
}
