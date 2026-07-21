import type { NormalizedEventType, ProviderWebhookEvent } from '../types'

export type WebhookHandlerContext = {
  req: any
  res: any
  event: ProviderWebhookEvent
  /** Original provider event object (e.g. Stripe event) for legacy handlers */
  rawEvent: any
  normalizedType: NormalizedEventType | null
}

export type WebhookHandler = (ctx: WebhookHandlerContext) => Promise<any> | any

/**
 * Registry of webhook handlers keyed by provider-native event type and/or
 * normalized domain event type. Controllers verify the payload via PaymentProvider,
 * then dispatch here so Stripe and Whop share the same routing pattern.
 */
export class WebhookEventRegistry {
  private rawHandlers = new Map<string, WebhookHandler>()
  private normalizedHandlers = new Map<NormalizedEventType, WebhookHandler>()

  onRaw(eventType: string, handler: WebhookHandler): this {
    this.rawHandlers.set(eventType, handler)
    return this
  }

  onNormalized(eventType: NormalizedEventType, handler: WebhookHandler): this {
    this.normalizedHandlers.set(eventType, handler)
    return this
  }

  /**
   * Dispatch a verified provider event.
   * Preference: exact raw type handler, then normalized type handler, else 200 + body.
   */
  async dispatch(
    event: ProviderWebhookEvent,
    req: any,
    res: any,
    mapEventType: (rawType: string) => NormalizedEventType | null
  ): Promise<any> {
    const normalizedType = mapEventType(event.type)
    const ctx: WebhookHandlerContext = {
      req,
      res,
      event,
      rawEvent: event.raw,
      normalizedType
    }

    const rawHandler = this.rawHandlers.get(event.type)
    if (rawHandler) {
      return rawHandler(ctx)
    }

    if (normalizedType) {
      const normalizedHandler = this.normalizedHandlers.get(normalizedType)
      if (normalizedHandler) {
        return normalizedHandler(ctx)
      }
    }

    // Unhandled events still acknowledge so providers do not retry endlessly.
    return res.status(200).json(event.raw ?? event)
  }
}
