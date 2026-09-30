// Shared by playwright.config.js (which starts the backend) and run-e2e.js (which builds the
// frontend before that backend exists) so the two can never drift out of sync — the frontend
// build bakes API_HOST/PAYMENT_PROVIDER in at build time (frontend/webpack.config.prod.js's
// DefinePlugin), so both steps need the exact same values.

// Deliberately NOT 3000 — that's the port `npm run start:dev` binds by default. Running the
// e2e backend there risks colliding with a developer's own dev server, which makes it look
// like local dev data vanished when it's actually just this NODE_ENV=test server answering
// on the same port, backed by gitpay_test instead of gitpay_dev.
const E2E_PORT = 3010
const E2E_BASE_URL = `http://localhost:${E2E_PORT}`

// Forced explicitly rather than relying on the surrounding environment's own PAYMENT_PROVIDER
// (.env locally, CI secrets remotely) — the Import Pull Request e2e flow needs the Whop code
// path specifically, since that's what playwright/whop-stub-server.ts fakes; left ambient,
// this silently fell through to Stripe (with an expired CI test key) on CI.
const E2E_PAYMENT_PROVIDER = 'whop'

module.exports = { E2E_PORT, E2E_BASE_URL, E2E_PAYMENT_PROVIDER }
