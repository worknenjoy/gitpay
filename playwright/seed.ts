import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'
import { UserFactory, PaymentRequestFactory } from '../test/factories'
import Models from '../src/models'

const models = Models as any

export const SEED_FILE = path.join(__dirname, '.seed.json')

/**
 * Signs the same JWT shape as a real local login (src/client/auth/local-strategy.ts), so
 * the spec can land an authenticated session via the app's own `/#/token/:token` hand-off
 * (src/app/controllers/auth/auth.ts's authorizeLocal redirects there after sign-in) instead
 * of driving the sign-in form through the UI.
 */
function signSessionToken(user: any) {
  return jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_PHRASE as string)
}

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

  // Import Pull Request flow needs a GitHub-linked user (provider_username matching the
  // author login github-stub-server.ts returns for the PRs import-pull-request.spec.ts
  // resolves) with a user Type, since ImportPullRequest only renders for
  // isMaintainer/isFunding/isContributor (frontend/src/hooks/use-user-types.ts).
  const importPullRequestUser = await UserFactory({
    provider: 'github',
    provider_username: 'alexanmtz',
    // A github-provider user without this is redirected to /accept-terms before reaching
    // any private page (frontend/src/components/areas/private/pages/private-page.tsx).
    terms_accepted_at: new Date(),
    // Every payment request is a Whop direct charge (createPaymentRequest.ts), which
    // requires a connected seller account — any non-empty id works here since
    // WHOP_API_BASE_URL points at playwright/whop-stub-server.ts, which never validates it.
    whop_account_id: 'biz_e2e_stub_seller'
  })
  const [contributorType] = await models.Type.findOrCreate({
    where: { name: 'contributor' },
    defaults: { label: 'Contributor' }
  })
  await importPullRequestUser.addType(contributorType)

  fs.writeFileSync(
    SEED_FILE,
    JSON.stringify({
      userId: user.id,
      paymentRequestId: paymentRequest.id,
      title: paymentRequest.title,
      description: paymentRequest.description,
      importPullRequestUserId: importPullRequestUser.id,
      importPullRequestToken: signSessionToken(importPullRequestUser)
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
