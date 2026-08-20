/**
 * Sign and deliver a synthetic Whop dispute / refund / dispute-alert webhook
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
 *   npx tsx src/scripts/whop/simulate_dispute.ts --type=refund.created --payment-id=pay_xxx --amount=49.95 --url=https://your-host/webhooks/whop
 *   npx tsx src/scripts/whop/simulate_dispute.ts --type=dispute_alert.created --payment-id=pay_xxx --charge-for-alert=true --url=https://your-host/webhooks/whop
 *
 * --payment-id should be a real Whop `payment.id` (e.g. from an actual sandbox
 * checkout) so it correlates to an existing PaymentRequestPayment.source.
 *
 * Options:
 *   --type              dispute.created | dispute.updated | refund.created | refund.updated
 *                        | dispute_alert.created (default: dispute.created)
 *   --payment-id        Whop payment id to attach the event to (required)
 *   --amount            Amount in major units, e.g. 49.95 (default: 49.95)
 *   --status             Dispute/refund status (default: needs_response for dispute.created,
 *                        won for dispute.updated, succeeded for refund.*)
 *   --reason            Dispute reason (default: product_not_received; dispute events only)
 *   --charge-for-alert  true | false — whether Whop billed for this alert (default: true;
 *                        dispute_alert.created only)
 *   --alert-type        dispute | dispute_rdr | fraud (default: dispute_rdr; dispute_alert.created only)
 *   --event-id          Synthetic event id (default: <prefix>_sim_<timestamp>)
 *   --company-id        Whop company id (default: WHOP_COMPANY_ID env)
 *   --url               Target webhook URL (default: http://localhost:3000/webhooks/whop)
 */
import dotenv from 'dotenv'
import { Webhook } from 'standardwebhooks'

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

const SUPPORTED_TYPES = [
  'dispute.created',
  'dispute.updated',
  'refund.created',
  'refund.updated',
  'dispute_alert.created'
] as const
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

function defaultStatusFor(type: SupportedType): string {
  if (type === 'dispute.created') return 'needs_response'
  if (type === 'dispute.updated') return 'won'
  return 'succeeded'
}

function idPrefixFor(type: SupportedType): string {
  if (type.startsWith('dispute_alert')) return 'dpal_sim_'
  if (type.startsWith('dispute')) return 'disp_sim_'
  return 're_sim_'
}

function buildData(type: SupportedType, args: Record<string, string>, nowIso: string) {
  const paymentId = args['payment-id']
  const amount = args.amount ? Number(args.amount) : 49.95
  const eventId = args['event-id'] || `${idPrefixFor(type)}${Date.now()}`

  if (type === 'dispute_alert.created') {
    return {
      id: eventId,
      alert_type: args['alert-type'] || 'dispute_rdr',
      amount,
      charge_for_alert: (args['charge-for-alert'] ?? 'true') === 'true',
      currency: 'usd',
      created_at: nowIso,
      payment: { id: paymentId }
    }
  }

  if (type === 'refund.created' || type === 'refund.updated') {
    return {
      id: eventId,
      amount,
      currency: 'usd',
      status: args.status || defaultStatusFor(type),
      payment: { id: paymentId }
    }
  }

  return {
    id: eventId,
    amount,
    currency: 'usd',
    status: args.status || defaultStatusFor(type),
    reason: args.reason || 'product_not_received',
    created_at: nowIso,
    payment: { id: paymentId }
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))

  const type = (args.type || 'dispute.created') as SupportedType
  if (!SUPPORTED_TYPES.includes(type)) {
    console.error(`Unsupported --type: ${type} (expected one of ${SUPPORTED_TYPES.join(', ')})`)
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

  const messageId = `msg_sim_${Date.now()}`
  const nowIso = new Date().toISOString()

  const payload = {
    id: messageId,
    api_version: 'v1',
    type,
    timestamp: nowIso,
    company_id: companyId,
    data: buildData(type, args, nowIso)
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
