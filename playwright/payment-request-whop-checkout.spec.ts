import fs from 'fs'
import path from 'path'
import { test, expect } from '@playwright/test'

const SEED_FILE = path.join(__dirname, '.seed.json')

/**
 * Covers the payer-facing flow up to the Whop checkout embed mounting — not a real
 * completed payment, which isn't feasible headlessly against Whop's live iframe.
 * Fulfillment is webhook-driven server-side (see test/api/webhooks/whop/payment-request.test.ts)
 * and is unaffected by which embed renders here.
 */
test('payer can reach the Whop checkout for a custom-amount payment request', async ({ page }) => {
  const { paymentRequestId, title, description } = JSON.parse(fs.readFileSync(SEED_FILE, 'utf-8'))

  let checkoutRequestBody: { amount?: number } | null = null
  await page.route('**/payment-requests-public/*/checkout', async (route) => {
    checkoutRequestBody = route.request().postDataJSON()
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        sessionId: 'ch_test_123',
        purchaseUrl: 'https://whop.com/checkout/plan_test'
      })
    })
  })

  await page.goto(`/#/payment-requests/${paymentRequestId}/pay`)

  await expect(page.getByText(title)).toBeVisible()
  await expect(page.getByText(description)).toBeVisible()

  await page.getByLabel('Amount to pay').fill('25')
  await page.getByRole('button', { name: 'Continue' }).click()

  await expect.poll(() => checkoutRequestBody).not.toBeNull()
  expect(checkoutRequestBody!.amount).toBe(25)

  await expect(page.getByText('Enter an amount to continue.')).toHaveCount(0)
  await expect(page.getByTestId('whop-checkout-container')).toBeVisible()
})
