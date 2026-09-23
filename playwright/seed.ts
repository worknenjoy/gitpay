import fs from 'fs'
import path from 'path'
import { UserFactory, PaymentRequestFactory } from '../test/factories'

export const SEED_FILE = path.join(__dirname, '.seed.json')

/**
 * Seeds a Whop custom-amount PaymentRequest against the NODE_ENV=test database so the
 * payment-request-whop-checkout spec has a real public pay page to load. Run as a plain
 * tsx script (not a Playwright globalSetup) since Playwright's own TS loader mishandles
 * this barrel's re-exports and Sequelize's defaultValue behavior.
 */
async function seed() {
  const user = await UserFactory()
  const paymentRequest = await PaymentRequestFactory({
    userId: user.id,
    provider: 'whop',
    custom_amount: true,
    active: true,
    title: 'Open amount PR',
    description: 'Pay whatever you want',
    currency: 'usd',
    payment_link_id: 'prod_test_whop_123'
  })

  fs.writeFileSync(
    SEED_FILE,
    JSON.stringify({
      userId: user.id,
      paymentRequestId: paymentRequest.id,
      title: paymentRequest.title,
      description: paymentRequest.description
    })
  )
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('playwright/seed.ts failed:', error)
    process.exit(1)
  })
