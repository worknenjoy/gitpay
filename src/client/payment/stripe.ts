import Stripe from 'stripe'

export default (): any => {
  const passthroughFetch = (...args: Parameters<typeof fetch>) => fetch(...args)

  return new Stripe(process.env.STRIPE_KEY || '', {
    httpClient:
      process.env.NODE_ENV === 'test' ? Stripe.createFetchHttpClient(passthroughFetch) : undefined
  })
}
