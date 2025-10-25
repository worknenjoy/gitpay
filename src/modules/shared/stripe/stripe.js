module.exports = () => {
  const Stripe = require('stripe');
  const passthroughFetch = (...args) => fetch(...args);

  return new Stripe(process.env.STRIPE_KEY, {
    httpClient: process.env.NODE_ENV === 'test'
      ? Stripe.createFetchHttpClient(passthroughFetch)
      : undefined
  });
}