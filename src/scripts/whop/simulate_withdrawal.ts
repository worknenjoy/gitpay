/**
 * Sign and deliver a synthetic Whop withdrawal webhook against a running
 * server (local, ngrok tunnel, or deployed sandbox).
 *
 * Whop's sandbox doesn't support payouts (see docs/payments-providers.md), so
 * this is the only way to exercise the *deployed* code path (real signature
 * verification via WHOP_WEBHOOK_SECRET, real DB writes, real email sending)
 * for withdrawal events without a live payout.
 *
 * Usage:
 *   npx tsx src/scripts/whop/simulate_withdrawal.ts --type=withdrawal.created --withdrawal-id=wdrl_xxx --company-id=biz_xxx --status=pending
 *   npx tsx src/scripts/whop/simulate_withdrawal.ts --type=withdrawal.updated --withdrawal-id=wdrl_xxx --status=completed
 *
 * Options:
 *   --type              withdrawal.created | withdrawal.updated (default: withdrawal.created)
 *   --withdrawal-id     Whop withdrawal id (default: wdrl_sim_<timestamp>)
 *   --company-id        Whop company id, placed at the envelope top level
 *                        (matching Whop's real shape) — default: WHOP_COMPANY_ID env
 *   --status             requested | awaiting_payment | in_transit | completed | failed
 *                        | canceled | denied (default: pending)
 *   --amount             Amount in major units, e.g. 92.5 (default: 50)
 *   --currency           Default: usd
 *   --amount-shape        flat | nested — flat sends `amount` as a plain number
 *                        (the shape the code assumes); nested sends
 *                        `{ amount, currency }` instead, to probe for shape
 *                        mismatches (default: flat)
 *   --event-id           Synthetic message id (default: msg_sim_<timestamp>)
 *   --url                Target webhook URL (default: http://localhost:3000/webhooks/whop)
 */
import dotenv from 'dotenv'
import { Webhook } from 'standardwebhooks'

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

const SUPPORTED_TYPES = ['withdrawal.created', 'withdrawal.updated'] as const
type SupportedType = (typeof SUPPORTED_TYPES)[number]

function parseArgs(argv: string[]): Record<string, string> {
  const args: Record<string, string> = {}
  for (const arg of argv) {
    const match = /^--([^=]+)=(.*)$/.exec(arg)
    if (match) {
      args[match[1]] = match[2]
    }
  }
  return args
}

function buildData(args: Record<string, string>) {
  const withdrawalId = args['withdrawal-id'] || `wdrl_sim_${Date.now()}`
  const status = args.status || 'pending'
  const amount = args.amount ? Number(args.amount) : 50
  const currency = args.currency || 'usd'
  const amountShape = args['amount-shape'] || 'flat'

  return {
    id: withdrawalId,
    status,
    currency,
    amount: amountShape === 'nested' ? { amount, currency } : amount
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))

  const type = (args.type || 'withdrawal.created') as SupportedType
  if (!SUPPORTED_TYPES.includes(type)) {
    console.error(`Unsupported --type: ${type} (expected one of ${SUPPORTED_TYPES.join(', ')})`)
    process.exit(1)
  }

  const secret = process.env.WHOP_WEBHOOK_SECRET
  if (!secret) {
    console.error('WHOP_WEBHOOK_SECRET is not set')
    process.exit(1)
  }

  const url = args.url || 'http://localhost:3000/webhooks/whop'
  const companyId = args['company-id'] || process.env.WHOP_COMPANY_ID || 'biz_test_platform'

  const messageId = args['event-id'] || `msg_sim_${Date.now()}`
  const nowIso = new Date().toISOString()

  // Whop envelope: company_id is a sibling of `data`, not nested inside it —
  // this is the exact shape the production bug (fixed in whopHandlers.ts)
  // failed to read from.
  const payload = {
    id: messageId,
    api_version: 'v1',
    type,
    timestamp: nowIso,
    company_id: companyId,
    data: buildData(args)
  }

  const body = JSON.stringify(payload)
  const key = Buffer.from(secret, 'utf8').toString('base64')
  const wh = new Webhook(key)
  const timestamp = new Date()
  const signature = wh.sign(messageId, timestamp, body)

  console.log('Target URL:', url)
  console.log('Payload:', JSON.stringify(payload, null, 2))

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'webhook-id': messageId,
      'webhook-timestamp': String(Math.floor(timestamp.getTime() / 1000)),
      'webhook-signature': signature
    },
    body
  })

  const text = await res.text()
  console.log('\nResponse status:', res.status)
  console.log('Response body:', text)

  if (!res.ok) {
    process.exit(1)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
