const { defineConfig } = require('@playwright/test')

module.exports = defineConfig({
  testDir: './playwright',
  use: {
    headless: true,
    baseURL: 'http://localhost:8082'
  },
  webServer: [
    {
      command: 'npx tsx src/index.ts',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      env: { NODE_ENV: 'test' },
      timeout: 120000,
      stdout: 'pipe',
      stderr: 'pipe'
    },
    {
      command: 'npm run dev',
      cwd: './frontend',
      url: 'http://localhost:8082',
      reuseExistingServer: !process.env.CI,
      timeout: 300000,
      stdout: 'pipe',
      stderr: 'pipe'
    }
  ]
})
