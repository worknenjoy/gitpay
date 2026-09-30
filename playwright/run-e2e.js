#!/usr/bin/env node
const { spawnSync } = require('child_process')
const { E2E_BASE_URL, E2E_PAYMENT_PROVIDER } = require('./e2e-env')

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { stdio: 'inherit', env: process.env, ...options })
  return result.status ?? 1
}

// Build the frontend once, the same way production deploys do (see heroku-postbuild
// in the root package.json), so the backend's express.static middleware has something
// to serve. This runs as a plain step with its own output, not as a second Playwright
// webServer racing a readiness timeout.
//
// API_HOST and PAYMENT_PROVIDER are baked into the bundle at build time (webpack
// DefinePlugin, see frontend/webpack.config.prod.js), so they must match exactly what
// playwright.config.js later starts the backend with (playwright/e2e-env.js is the single
// source of truth for both) — otherwise the built frontend calls the wrong port, or a
// provider the backend isn't actually configured for.
const buildStatus = run('npm', ['run', 'production'], {
  cwd: 'frontend',
  env: { ...process.env, API_HOST: E2E_BASE_URL, PAYMENT_PROVIDER: E2E_PAYMENT_PROVIDER }
})
if (buildStatus !== 0) process.exit(buildStatus)

const seedStatus = run('npx', ['tsx', 'playwright/seed.ts'])
if (seedStatus !== 0) process.exit(seedStatus)

const testStatus = run('npx', ['playwright', 'test'])
const cleanupStatus = run('npx', ['tsx', 'playwright/cleanup.ts'])

process.exit(testStatus !== 0 ? testStatus : cleanupStatus)
