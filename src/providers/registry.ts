import type { PaymentProvider } from './PaymentProvider'
import type { PaymentProviderName } from './types'
import { StripePaymentProvider } from './stripe/StripePaymentProvider'
import { WhopPaymentProvider } from './whop/WhopPaymentProvider'
import { resetWhopClient } from './whop/client'

const instances = new Map<PaymentProviderName, PaymentProvider>()

export function getDefaultPaymentProviderName(): PaymentProviderName {
  const raw = (process.env.PAYMENT_PROVIDER || 'stripe').toLowerCase()
  if (raw === 'whop') return 'whop'
  return 'stripe'
}

/**
 * Resolve a payment provider by name. Defaults to PAYMENT_PROVIDER env (stripe).
 * Instances are cached; call resetPaymentProviderCache in tests when switching.
 */
export function getPaymentProvider(name?: string): PaymentProvider {
  const resolved = (name || getDefaultPaymentProviderName()).toLowerCase() as PaymentProviderName

  const cached = instances.get(resolved)
  if (cached) return cached

  let provider: PaymentProvider
  switch (resolved) {
    case 'whop':
      provider = WhopPaymentProvider.getInstance()
      break
    case 'stripe':
    default:
      provider = StripePaymentProvider.getInstance()
      break
  }

  instances.set(provider.name, provider)
  return provider
}

export function resetPaymentProviderCache(): void {
  instances.clear()
  StripePaymentProvider.resetInstance()
  WhopPaymentProvider.resetInstance()
  resetWhopClient()
}
