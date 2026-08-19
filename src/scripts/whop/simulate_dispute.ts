/**
 * Sign and deliver a synthetic Whop dispute.created / dispute.updated webhook
 * against a running server (local, ngrok tunnel, or deployed sandbox).
 *
 * Whop's sandbox cannot generate a real chargeback (disputes are bank/card-network
 * driven — there's no Stripe-CLI-style `stripe trigger` for Whop), so this is the
 * only way to exercise the *deployed* code path (real signature verification via
 * WHOP_WEBHOOK_SECRET, real DB writes, real email sending) without a live chargeback.
 *
 * Usage:
 *   npx tsx src/scripts/whop/simulate_dispute.ts --type=dispute.created --payment-id=pay_xxx --url=https://your-host/webhooks/whop
 *   npx tsx src/scripts/whop/simulate_dispute.ts --type=dispute.updated --status=won --payment-id=pay_xxx --url=https://your-host/webhooks/whop
 *
 * --payment-id should be a real Whop `payment.id` (e.g. from an actual sandbox
 * checkout) so it correlates to an existing PaymentRequestPayment.source.
 *
 * Options:
 *   --type          dispute.created | dispute.updated (default: dispute.created)
 *   --payment-id    Whop payment id to attach the dispute to (required)
 *   --amount        Dispute amount in major units, e.g. 49.95 (default: 49.95)
 *   --status        Dispute status (default: needs_response for created, won for updated)
 *   --reason        Dispute reason (default: product_not_received)
 *   --dispute-id    Synthetic dispute id (default: disp_sim_<timestamp>)
 *   --company-id    Whop company id (default: WHOP_COMPANY_ID env)
 *   --url           Target webhook URL (default: http://localhost:3000/webhooks/whop)
 */
import dotenv from 'dotenv'
import { Webhook } from 'standardwebhooks'

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

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

async function main() {
  const args = parseArgs(process.argv.slice(2))

  const type = args.type || 'dispute.created'
  if (type !== 'dispute.created' && type !== 'dispute.updated') {
    console.error(`Unsupported --type: ${type} (expected dispute.created or dispute.updated)`)
    process.exit(1)
  }

  const paymentId = args['payment-id']
  if (!paymentId) {
    console.error('--payment-id is required (a real Whop payment.id, e.g. pay_xxx)')
    process.exit(1)
  }

  const secret = process.env.WHOP_WEBHOOK_SECRET
  if (!secret) {
    console.error('WHOP_WEBHOOK_SECRET is not set')
    process.exit(1)
  }

  const url = args.url || 'http://localhost:3000/webhooks/whop'
  const companyId = args['company-id'] || process.env.WHOP_COMPANY_ID || 'biz_test_platform'
  const amount = args.amount ? Number(args.amount) : 49.95
  const reason = args.reason || 'product_not_received'
  const disputeId = args['dispute-id'] || `disp_sim_${Date.now()}`
  const defaultStatus = type === 'dispute.created' ? 'needs_response' : 'won'
  const status = args.status || defaultStatus

  const messageId = `msg_sim_${Date.now()}`
  const nowIso = new Date().toISOString()

  const payload = {
    id: messageId,
    api_version: 'v1',
    type,
    timestamp: nowIso,
    company_id: companyId,
    data: {
      id: disputeId,
      amount,
      currency: 'usd',
      status,
      reason,
      created_at: nowIso,
      payment: { id: paymentId }
    }
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
