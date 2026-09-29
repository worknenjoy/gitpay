import fs from 'fs'
import path from 'path'
import { test, expect } from '@playwright/test'

const SEED_FILE = path.join(__dirname, '.seed.json')

/**
 * Covers the two most common Import Pull Request paths — fixed amount and custom amount —
 * through "Create" only (not "Create and post"/"Post in pull request"), since actually
 * posting would hit the real GitHub API with write access.
 *
 * Resolving a PR is a real, server-side call the backend makes to GitHub's API, which
 * can't be intercepted from the browser (page.route()) or via nock (Playwright's backend
 * runs as a separate spawned process — see playwright.config.js) — so it's faked with
 * playwright/github-stub-server.ts, per GITHUB_API_BASE_URL. The two PR "numbers" pasted
 * below are just keys into that stub's canned data (see there); they don't need to
 * correspond to anything real on GitHub. Two distinct numbers/titles are used so the two
 * created payment requests don't collide in the payment requests list assertion.
 */

const FIXED_AMOUNT_PR_URL = 'https://github.com/worknenjoy/gitpay/pull/8'
const FIXED_AMOUNT_PR_TITLE = 'Home react'

const CUSTOM_AMOUNT_PR_URL = 'https://github.com/worknenjoy/gitpay/pull/15'
const CUSTOM_AMOUNT_PR_TITLE = 'Release candidate - task orders login redux prod'

test.beforeEach(async ({ page }) => {
  const { importPullRequestToken } = JSON.parse(fs.readFileSync(SEED_FILE, 'utf-8'))

  // Bootstraps a session the same way a real local login does (authorizeLocal redirects to
  // this same /#/token/:token route) — bypasses the sign-in form for a seeded user.
  await page.goto(`/#/token/${importPullRequestToken}`)
  await expect(page).toHaveURL(/\/#\/profile/)

  // A fresh browser context has no 'firstLogin' localStorage flag, so the welcome-user
  // onboarding tour (frontend/src/components/areas/private/components/session/welcome-user.js)
  // always opens over the page and blocks every other control until dismissed.
  await page.getByRole('button', { name: 'Skip' }).click()
})

test('creates a payment request for a fixed amount from a merged pull request', async ({
  page
}) => {
  await page.getByRole('button', { name: 'Import' }).click()
  await page.getByRole('menuitem', { name: 'Import pull request' }).click()

  await page.getByPlaceholder('https://github.com/owner/repo/pull/123').fill(FIXED_AMOUNT_PR_URL)

  // Waits out the resolve debounce + real GitHub API round trip.
  await expect(page.getByText(FIXED_AMOUNT_PR_TITLE)).toBeVisible({ timeout: 15000 })

  // Fixed amount is the default mode — just fill the price.
  await expect(page.getByRole('radio', { name: 'Fixed amount' })).toBeChecked()
  await page.getByRole('textbox').nth(1).fill('42.00')

  await page.getByRole('button', { name: 'Continue' }).click()

  await expect(page.getByText('Review payment request')).toBeVisible()
  await expect(page.getByText(FIXED_AMOUNT_PR_TITLE)).toBeVisible()

  await page.getByRole('button', { name: 'Create', exact: true }).click()

  await expect(page.getByText('Payment link created')).toBeVisible()
  await page.getByRole('button', { name: 'Close', exact: true }).click()

  await page.goto('/#/profile/payment-requests')

  const row = page.getByRole('row', { name: FIXED_AMOUNT_PR_TITLE })
  await expect(row).toBeVisible()
  await expect(row).toContainText('$ 42')
})

test('creates a payment request for a custom amount from a merged pull request', async ({
  page
}) => {
  await page.getByRole('button', { name: 'Import' }).click()
  await page.getByRole('menuitem', { name: 'Import pull request' }).click()

  await page.getByPlaceholder('https://github.com/owner/repo/pull/123').fill(CUSTOM_AMOUNT_PR_URL)

  await expect(page.getByText(CUSTOM_AMOUNT_PR_TITLE)).toBeVisible({ timeout: 15000 })

  await page.getByRole('radio', { name: 'Custom amount' }).click()
  await expect(page.getByText('The payment page shows an open amount field in USD.')).toBeVisible()

  await page.getByRole('button', { name: 'Continue' }).click()

  await expect(page.getByText('Review payment request')).toBeVisible()
  await expect(page.getByText('Custom amount')).toBeVisible()

  await page.getByRole('button', { name: 'Create', exact: true }).click()

  await expect(page.getByText('Payment link created')).toBeVisible()
  await page.getByRole('button', { name: 'Close', exact: true }).click()

  await page.goto('/#/profile/payment-requests')

  const row = page.getByRole('row', { name: CUSTOM_AMOUNT_PR_TITLE })
  await expect(row).toBeVisible()
  await expect(row).toContainText('Not yet defined')
})
