require('tsx/cjs');

// The backend suite is the Stripe suite. Whop tests opt in per-case via
// withPaymentProvider('whop', ...), which saves and restores the value, so
// nothing here relies on an ambient whop setting. Force stripe unconditionally
// so a developer's local .env / shell PAYMENT_PROVIDER=whop can't leak into the
// tests (dotenv, loaded later from src/config/secrets, won't override it).
process.env.PAYMENT_PROVIDER = 'stripe'