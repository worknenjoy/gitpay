import { resetPaymentProviderCache } from '../../src/providers'
import { resetWhopClient } from '../../src/providers/whop/client'
import { WhopPaymentProvider } from '../../src/providers/whop/WhopPaymentProvider'
import { resetWhopWebhookRegistry } from '../../src/modules/webhooks/register/whopHandlers'

export async function withPaymentProvider<T>(
  name: 'stripe' | 'whop',
  fn: () => Promise<T>
): Promise<T> {
  const previous = process.env.PAYMENT_PROVIDER
  process.env.PAYMENT_PROVIDER = name
  resetPaymentProviderCache()
  resetWhopClient()
  WhopPaymentProvider.resetInstance()
  resetWhopWebhookRegistry()
  try {
    return await fn()
  } finally {
    process.env.PAYMENT_PROVIDER = previous || 'stripe'
    resetPaymentProviderCache()
    resetWhopClient()
    WhopPaymentProvider.resetInstance()
    resetWhopWebhookRegistry()
  }
}

/**
 * Origin used for nock (without path). Matches WhopClient base host.
 * Force tests to use production API host unless WHOP_API_BASE_URL is set for the suite.
 */
export function getWhopNockOrigin(): string {
  const base =
    process.env.WHOP_API_BASE_URL ||
    (process.env.WHOP_SANDBOX === 'true' || process.env.WHOP_SANDBOX === '1'
      ? 'https://sandbox-api.whop.com/api/v1'
      : 'https://api.whop.com/api/v1')
  try {
    return new URL(base.startsWith('http') ? base : `https://${base}`).origin
  } catch {
    return 'https://api.whop.com'
  }
}

/** @deprecated use getWhopNockOrigin — kept for existing tests */
export const WHOP_API_HOST = 'https://api.whop.com'

/** Pin Whop client to api.whop.com for nock-friendly tests */
export function pinWhopApiForTests() {
  process.env.WHOP_API_BASE_URL = 'https://api.whop.com/api/v1'
  delete process.env.WHOP_SANDBOX
  resetWhopClient()
  WhopPaymentProvider.resetInstance()
}

/**
 * Mock GET /payments/:id for the payment-request transfer settlement gate.
 * `settled: false` returns `settlement_time_at: null` (Whop has not posted the funds yet).
 * Without `paymentId`, matches any payment and persists for the whole test.
 */
export function nockWhopPayment({ settled, paymentId }: { settled: boolean; paymentId?: string }) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const nock = require('nock')
  const scope = nock(WHOP_API_HOST)
    .get(paymentId ? `/api/v1/payments/${paymentId}` : /^\/api\/v1\/payments\/[^/]+$/)
    .reply(200, (uri: string) => ({
      id: uri.split('/').pop(),
      status: 'paid',
      settlement_time_at: settled ? '2026-01-01T00:00:00.000Z' : null
    }))
  return paymentId ? scope : scope.persist()
}
