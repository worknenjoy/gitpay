require('tsx/cjs');

// Default payment connector for the existing Stripe suite. Whop tests set PAYMENT_PROVIDER=whop explicitly.
if (!process.env.PAYMENT_PROVIDER) {
  process.env.PAYMENT_PROVIDER = 'stripe'
}