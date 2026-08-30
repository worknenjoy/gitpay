const { defineConfig } = require('@playwright/test')

module.exports = defineConfig({
  testDir: './playwright',
  timeout: 60000,
  use: {
    headless: true,
    baseURL: 'http://localhost:8082'
  },
  webServer: [
    {
      command: 'npm run start:dev',
      url: 'http://localhost:3000/users',
      cwd: __dirname,
      reuseExistingServer: !process.env.CI,
      timeout: 60000
    },
    {
      command: 'npm run dev',
      url: 'http://localhost:8082',
      cwd: __dirname + '/frontend',
      reuseExistingServer: !process.env.CI,
      timeout: 180000
    }
  ]
})
