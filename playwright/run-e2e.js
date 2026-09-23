#!/usr/bin/env node
const { spawnSync } = require('child_process')

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { stdio: 'inherit', env: process.env, ...options })
  return result.status ?? 1
}

// Build the frontend once, the same way production deploys do (see heroku-postbuild
// in the root package.json), so the backend's express.static middleware has something
// to serve. This runs as a plain step with its own output, not as a second Playwright
// webServer racing a readiness timeout.
const buildStatus = run('npm', ['run', 'production'], { cwd: 'frontend' })
if (buildStatus !== 0) process.exit(buildStatus)

const seedStatus = run('npx', ['tsx', 'playwright/seed.ts'])
if (seedStatus !== 0) process.exit(seedStatus)

const testStatus = run('npx', ['playwright', 'test'])
const cleanupStatus = run('npx', ['tsx', 'playwright/cleanup.ts'])

process.exit(testStatus !== 0 ? testStatus : cleanupStatus)
