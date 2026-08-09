/**
 * Diagnose Whop API key vs WHOP_COMPANY_ID and a connected company.
 *
 * Usage:
 *   npx tsx src/scripts/whop/verify_whop_key.ts
 *   npx tsx src/scripts/whop/verify_whop_key.ts biz_childCompanyId
 */
import dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

async function get(base: string, apiKey: string, path: string) {
  const res = await fetch(`${base}${path}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json'
    }
  })
  const text = await res.text()
  let body: any
  try {
    body = JSON.parse(text)
  } catch {
    body = text
  }
  return { status: res.status, body }
}

async function post(base: string, apiKey: string, path: string, body: object) {
  const res = await fetch(`${base}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  const text = await res.text()
  let data: any
  try {
    data = JSON.parse(text)
  } catch {
    data = text
  }
  return { status: res.status, body: data }
}

async function main() {
  const apiKey = process.env.WHOP_API_KEY
  const companyId = process.env.WHOP_COMPANY_ID
  const childId = process.argv[2]
  const base =
    process.env.WHOP_API_BASE_URL ||
    (process.env.WHOP_SANDBOX === 'true' || process.env.WHOP_SANDBOX === '1'
      ? 'https://sandbox-api.whop.com/api/v1'
      : 'https://api.whop.com/api/v1')

  if (!apiKey) {
    console.error('WHOP_API_KEY is not set')
    process.exit(1)
  }

  console.log('Base URL:', base)
  console.log('WHOP_COMPANY_ID:', companyId || '(unset)')
  console.log('Child company arg:', childId || '(none)')
  console.log('WHOP_API_KEY: (set)')

  const me = await get(base, apiKey, '/accounts/me')
  console.log('\n=== GET /accounts/me ===', me.status)
  if (me.status === 200 && me.body?.id) {
    console.log('Key belongs to account/company:', me.body.id)
    if (companyId && me.body.id !== companyId) {
      console.log(
        '⚠️  MISMATCH: WHOP_COMPANY_ID does not match key company. Fix .env WHOP_COMPANY_ID to',
        me.body.id
      )
    } else if (companyId) {
      console.log('✓ WHOP_COMPANY_ID matches key company')
    }
  } else {
    console.log(JSON.stringify(me.body, null, 2).slice(0, 800))
    console.log(
      '⚠️  Could not resolve key company via /accounts/me. Key may be App-scoped or invalid.'
    )
  }

  if (companyId) {
    const parent = await get(base, apiKey, `/companies/${companyId}`)
    console.log('\n=== GET /companies/' + companyId + ' ===', parent.status)
    console.log(JSON.stringify(parent.body, null, 2).slice(0, 600))
  }

  if (childId) {
    const child = await get(base, apiKey, `/companies/${childId}`)
    console.log('\n=== GET /companies/' + childId + ' ===', child.status)
    console.log(JSON.stringify(child.body, null, 2).slice(0, 1000))

    const list = await get(
      base,
      apiKey,
      `/companies?parent_company_id=${encodeURIComponent(companyId || '')}`
    )
    console.log('\n=== LIST children of platform ===', list.status)
    const data = list.body?.data || list.body
    if (Array.isArray(data)) {
      const ids = data.map((c: any) => c.id)
      console.log('Child ids sample:', ids.slice(0, 20))
      console.log(
        ids.includes(childId)
          ? '✓ Child is listed under parent_company_id'
          : '⚠️  Child NOT listed under parent — not a sub-merchant of this platform key'
      )
    } else {
      console.log(JSON.stringify(list.body, null, 2).slice(0, 800))
    }

    const link = await post(base, apiKey, '/account_links', {
      company_id: childId,
      refresh_url: 'https://example.com/refresh',
      return_url: 'https://example.com/return',
      use_case: 'account_onboarding'
    })
    console.log('\n=== POST /account_links (test) ===', link.status)
    console.log(JSON.stringify(link.body, null, 2).slice(0, 800))
  }

  console.log(`
Notes:
- Use Company/Account API key for platform biz (${companyId}), Admin role.
- Platforms API (connected accounts) can be invite-only: contact sales@whop.com if parent/child works but account_links always fails.
- App API keys often return company:balance:read errors on account_links.
`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
