const { test, expect } = require('@playwright/test')

test('basic check', async ({ page }) => {
  await page.goto('data:text/html,<html><body><h1>Hello Playwright</h1></body></html>')
  await expect(page.locator('h1')).toHaveText('Hello Playwright')
})
