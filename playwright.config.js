const { defineConfig } = require('@playwright/test')
const { E2E_PORT, E2E_BASE_URL, E2E_PAYMENT_PROVIDER } = require('./playwright/e2e-env')

module.exports = defineConfig({
  testDir: './playwright',
  use: {
    headless: true,
    baseURL: E2E_BASE_URL
  },
  webServer: [
    {
      // Fakes the external Whop API so import-pull-request.spec.ts can create a real
      // payment request without a real connected seller account — see its own comment.
      command: 'npx tsx playwright/whop-stub-server.ts',
      port: 4310,
      reuseExistingServer: !process.env.CI,
      timeout: 30000,
      stdout: 'pipe',
      stderr: 'pipe'
    },
    {
      // Fakes the external GitHub API so import-pull-request.spec.ts doesn't depend on
      // GitHub's unauthenticated rate limit (shared across CI's IP pool) — see its own comment.
      command: 'npx tsx playwright/github-stub-server.ts',
      port: 4311,
      reuseExistingServer: !process.env.CI,
      timeout: 30000,
      stdout: 'pipe',
      stderr: 'pipe'
    },
    {
      command: 'npx tsx src/index.ts',
      url: E2E_BASE_URL,
      reuseExistingServer: !process.env.CI,
      env: {
        NODE_ENV: 'test',
        PORT: String(E2E_PORT),
        WHOP_API_BASE_URL: 'http://localhost:4310',
        GITHUB_API_BASE_URL: 'http://localhost:4311',
        PAYMENT_PROVIDER: E2E_PAYMENT_PROVIDER
      },
      timeout: 60000,
      stdout: 'pipe',
      stderr: 'pipe'
    }
  ]
})
