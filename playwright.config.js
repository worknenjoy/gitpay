const { defineConfig } = require('@playwright/test')

module.exports = defineConfig({
  testDir: './playwright',
  use: {
    headless: true,
    baseURL: 'http://localhost:3000'
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
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      env: {
        NODE_ENV: 'test',
        WHOP_API_BASE_URL: 'http://localhost:4310',
        GITHUB_API_BASE_URL: 'http://localhost:4311'
      },
      timeout: 60000,
      stdout: 'pipe',
      stderr: 'pipe'
    }
  ]
})
