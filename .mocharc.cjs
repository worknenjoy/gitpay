'use strict'

// Root Mocha config for the backend suite.
// `test/bootstrap.cjs` must load before any spec imports src/config/secrets
// (which runs dotenv.config()). It defaults PAYMENT_PROVIDER to 'stripe' for
// the existing Stripe suite; dotenv won't override an already-set env var, so
// a local .env with PAYMENT_PROVIDER=whop no longer leaks into the tests.
// Whop tests opt in explicitly via test/helpers/whop.ts.
module.exports = {
  require: ['./test/bootstrap.cjs']
}
