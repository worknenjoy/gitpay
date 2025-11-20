const { defineConfig } = require('@playwright/test')

module.exports = defineConfig({
  testDir: './playwright',
  use: {
    headless: true,
  },
})
