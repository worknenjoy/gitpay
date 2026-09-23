#!/usr/bin/env node
const { spawnSync } = require('child_process')

function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit', env: process.env })
  return result.status ?? 1
}

const seedStatus = run('npx', ['tsx', 'playwright/seed.ts'])
if (seedStatus !== 0) process.exit(seedStatus)

const testStatus = run('npx', ['playwright', 'test'])
const cleanupStatus = run('npx', ['tsx', 'playwright/cleanup.ts'])

process.exit(testStatus !== 0 ? testStatus : cleanupStatus)
