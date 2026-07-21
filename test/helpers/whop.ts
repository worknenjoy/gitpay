import { resetPaymentProviderCache } from '../../src/providers'

export async function withPaymentProvider<T>(
  name: 'stripe' | 'whop',
  fn: () => Promise<T>
): Promise<T> {
  const previous = process.env.PAYMENT_PROVIDER
  process.env.PAYMENT_PROVIDER = name
  resetPaymentProviderCache()
  try {
    return await fn()
  } finally {
    process.env.PAYMENT_PROVIDER = previous || 'stripe'
    resetPaymentProviderCache()
  }
}

export const WHOP_API_HOST = process.env.WHOP_API_BASE_URL || 'https://api.whop.com'
