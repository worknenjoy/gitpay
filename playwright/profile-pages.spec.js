const { test, expect } = require('@playwright/test')
const { Client } = require('pg')

const API_URL = 'http://localhost:3000'

const uniqueSuffix = () => `${Date.now()}_${Math.floor(Math.random() * 100000)}`

let typeIdByName

async function fetchTypeIds(request) {
  if (typeIdByName) return typeIdByName
  const res = await request.get(`${API_URL}/types/search`)
  const types = await res.json()
  typeIdByName = Object.fromEntries(types.map((t) => [t.name, t.id]))
  return typeIdByName
}

// Registers, activates and logs in a fresh user, then assigns the given roles (Types).
// Mirrors the register -> activate -> login flow in test/helpers (Mocha suite), just over
// real HTTP against a running server instead of supertest.
async function provisionUser(request, { name, types }) {
  const email = `e2e_${uniqueSuffix()}@example.com`
  const password = 'password123'

  const registerRes = await request.post(`${API_URL}/auth/register`, {
    data: { email, password, confirmPassword: password, name }
  })
  const user = await registerRes.json()

  await request.get(`${API_URL}/auth/activate?token=${user.activation_token}&userId=${user.id}`)

  const loginRes = await request.post(`${API_URL}/authorize/local`, {
    form: { username: email, password },
    maxRedirects: 0
  })
  const location = loginRes.headers()['location']
  const jwt = location.match(/token\/([^/?#]+)/)[1]

  const typeIds = await fetchTypeIds(request)
  await request.post(`${API_URL}/auth/accept-terms`, {
    headers: { Authorization: `Bearer ${jwt}` },
    data: { Types: types.map((t) => typeIds[t]) }
  })

  return { id: user.id, email, jwt }
}

async function seedMaintainerProject(pgClient, userId) {
  const suffix = uniqueSuffix()
  const org = await pgClient.query(
    'INSERT INTO "Organizations" (name, "UserId", "createdAt", "updatedAt") VALUES ($1, $2, now(), now()) RETURNING id',
    [`e2e-org-${suffix}`, userId]
  )
  const project = await pgClient.query(
    'INSERT INTO "Projects" (name, repo, description, "OrganizationId", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, now(), now()) RETURNING id',
    [`e2e-project-${suffix}`, `e2e-project-${suffix}`, 'E2E test project', org.rows[0].id]
  )
  await pgClient.query(
    `INSERT INTO "Tasks" (title, url, provider, status, value, "userId", "ProjectId", not_listed, "createdAt", "updatedAt")
     VALUES ($1, $2, 'github', 'open', 200, $3, $4, false, now(), now())`,
    [
      `E2E open bounty ${suffix}`,
      `https://github.com/e2e/${suffix}/issues/1`,
      userId,
      project.rows[0].id
    ]
  )
  return { projectName: `e2e-project-${suffix}` }
}

async function seedServicePackage(pgClient, userId) {
  const suffix = uniqueSuffix()
  await pgClient.query(
    `INSERT INTO "PaymentRequests"
      (title, description, currency, amount, custom_amount, active, deactivate_after_payment,
       send_instructions_email, provider, status, transfer_status, tier, featured, "userId", "createdAt", "updatedAt")
     VALUES ($1, $2, 'usd', 600, false, true, false, false, 'stripe', 'open', 'pending_payment', 'Standard', true, $3, now(), now())`,
    [`E2E package ${suffix}`, 'Custom integration or feature', userId]
  )
}

test.describe('Role-based public profile pages', () => {
  let pgClient

  test.beforeAll(async () => {
    pgClient = new Client({
      host: '127.0.0.1',
      port: 5432,
      user: 'postgres',
      password: 'postgres',
      database: process.env.NODE_ENV === 'test' ? 'gitpay_test' : 'gitpay_dev'
    })
    await pgClient.connect()
  })

  test.afterAll(async () => {
    await pgClient.end()
  })

  test('contributor profile shows the contributor role and Services/Bounties switcher', async ({
    page,
    request
  }) => {
    const user = await provisionUser(request, { name: 'E2E Contributor', types: ['contributor'] })

    await page.goto(`/#/users/${user.id}`)

    await expect(page.getByText('contributor', { exact: true })).toBeVisible()
    await expect(page.getByText('Services', { exact: true })).toBeVisible()
    await expect(page.getByText('Bounties', { exact: true })).toBeVisible()
    await expect(page.getByText('Payment links')).toBeVisible()
  })

  test('maintainer profile shows the projects grid and open bounties table', async ({
    page,
    request
  }) => {
    const user = await provisionUser(request, { name: 'E2E Maintainer', types: ['maintainer'] })
    const { projectName } = await seedMaintainerProject(pgClient, user.id)

    await page.goto(`/#/users/${user.id}`)

    await expect(page.getByText('maintainer', { exact: true })).toBeVisible()
    await expect(page.getByText('Projects maintained')).toBeVisible()
    // The project name legitimately appears twice: once in the projects grid card, once as
    // the bounty row's Project tag in the table below — scope to the first (the grid card).
    await expect(page.getByText(projectName).first()).toBeVisible()
    await expect(page.getByText('Open bounties · accepting work')).toBeVisible()
  })

  test('provider profile shows service packages and payment links', async ({ page, request }) => {
    const user = await provisionUser(request, { name: 'E2E Provider', types: ['provider'] })
    await seedServicePackage(pgClient, user.id)

    await page.goto(`/#/users/${user.id}`)

    await expect(page.getByText('service provider', { exact: true })).toBeVisible()
    await expect(page.getByText('Service packages')).toBeVisible()
    await expect(page.getByText('Payment links')).toBeVisible()
  })

  test('combined profile shows all role pills and the role switcher, including Funding', async ({
    page,
    request
  }) => {
    const user = await provisionUser(request, {
      name: 'E2E Combined',
      types: ['contributor', 'maintainer', 'provider']
    })

    await page.goto(`/#/users/${user.id}`)

    await expect(page.getByText('All roles enabled')).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Overview' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Funding' })).toBeVisible()

    // force: true — sidesteps the webpack-dev-server HMR overlay iframe that can sit over the
    // page in a long-lived local dev session; irrelevant to a real build/CI run.
    await page.getByRole('tab', { name: 'Funding' }).click({ force: true })
    // Appears twice by design: the stat tile label and the section divider heading.
    await expect(page.getByText('Projects sponsored').first()).toBeVisible()
  })
})
