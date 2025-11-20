import Stripe from '../../modules/shared/stripe/stripe'
import Models from '../../models'
import { UUIDV4 } from 'sequelize'
import { handleAmount } from '../../modules/util/handle-amount/handle-amount'

const models = Models as any

const stripe = Stripe() as any

// --- Pretty console helpers ---
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  gray: '\x1b[90m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
}
function color(s: string, col: string) {
  return `${col}${s}${c.reset}`
}
function bold(s: string) {
  return color(s, c.bold)
}
function dim(s: string) {
  return color(s, c.gray)
}
function section(title: string) {
  console.log(`\n${bold(title)}\n${'-'.repeat(title.length)}`)
}
function kv(key: string, value: unknown) {
  const v = value === null || value === undefined || value === '' ? '-' : String(value)
  console.log(`${color(key.padEnd(24), c.cyan)} ${v}`)
}
function check(label: string, ok: boolean) {
  const sym = ok ? color('✓', c.green) : color('✗', c.red)
  console.log(`${sym} ${label}`)
}
function hasFlag(...names: string[]) {
  return process.argv.some((a) => names.includes(a))
}
function formatAmount(amount?: number, currency?: string) {
  if (typeof amount !== 'number') return '-'
  const cur = (currency ?? '').toUpperCase()
  const noMinor = ['JPY', 'KRW', 'VND']
  const out = noMinor.includes(cur) ? `${amount}` : (amount / 100).toFixed(2)
  return `${out} ${cur || ''}`.trim()
}
function formatDate(ts?: number) {
  if (!ts) return '-'
  return new Date(ts * 1000).toLocaleString()
}
// --- end pretty console helpers ---

type CliParams = {
  paymentIntentId: string | null
  userId: string | null
  paymentRequestId: string | null
}

function readArg(names: string[]): string | null {
  const withEq = process.argv.find((a) => names.some((n) => a.startsWith(`${n}=`)))
  if (withEq) return withEq.split('=')[1]

  const idx = process.argv.findIndex((a) => names.includes(a))
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1]

  return null
}

function getCliParams(): CliParams {
  const paymentIntentId =
    readArg(['--paymentIntentId', '-p']) ?? process.env.PAYMENT_INTENT_ID ?? null

  const userId = readArg(['--userId', '-u']) ?? process.env.USER_ID ?? null

  const paymentRequestId =
    readArg(['--paymentRequestId', '-r', '-pr']) ?? process.env.PAYMENT_REQUEST_ID ?? null

  return { paymentIntentId, userId, paymentRequestId }
}

// Backward compatible: keep existing function name/signature
function getPaymentIntentIdFromArgs(): string | null {
  return getCliParams().paymentIntentId
}

// Optional helpers for new params (available for future use)
function getUserIdFromArgs(): string | null {
  return getCliParams().userId
}

function getPaymentRequestIdFromArgs(): string | null {
  return getCliParams().paymentRequestId
}

async function listPaymentIntentsByID(paymentIntentId: string): Promise<any> {
  const result = await (stripe as any).paymentIntents.retrieve(paymentIntentId, {
    expand: [
      'customer',
      'payment_method',
      'charges',
      'latest_charge.refunds',
      'charges.data.refunds',
      'latest_charge',
    ],
  })
  console.log('PaymentIntent', result)
  return result
}

const getStatus = (intent: any) => {
  if (!intent) return null
  if (intent?.latest_charge?.refunded === true) return 'refunded'
  if (intent?.latest_charge?.status === 'failed') return 'failed'
  if (intent.status === 'succeeded') return 'paid'
  return intent.status
}

async function createPaymentRequestPayment(
  intent: any,
  userId: any,
  paymentRequestId: any,
): Promise<any> {
  const customer = intent.customer_details || intent.payment_method?.billing_details || {}
  if (!customer?.email) {
    console.error('Cannot create Payment Request Payment without customer email')
    process.exit(1)
  }
  const paymentRequestCreatedCustomer = await models.PaymentRequestCustomer.findOrCreate({
    where: {
      email: customer?.email,
    },
    defaults: {
      userId: userId,
      sourceId: intent.customer?.id || 'gc_' + UUIDV4(),
      email: customer?.email,
      name: customer?.name || null,
    },
  })
  const amount = intent.amount_received
    ? handleAmount(intent.amount_received, 0, 'centavos')
    : handleAmount(intent.amount, '0', 'centavos')

  const amountDecimal = amount.decimal
  const createdPaymentRequestPayment = await models.PaymentRequestPayment.create({
    source: intent.id,
    amount: amountDecimal,
    currency: intent.currency,
    status: getStatus(intent),
    customerId: paymentRequestCreatedCustomer[0].id,
    paymentRequestId: paymentRequestId,
    userId: userId,
    createdAt: new Date(intent.created * 1000),
  })
  return createdPaymentRequestPayment
}

const updateMetadata = async (intentId: string, metadata: any) => {
  return await stripe.paymentIntents.update(intentId, { metadata })
}

async function main() {
  const paymentIntentId = getPaymentIntentIdFromArgs()
  if (!paymentIntentId) {
    console.error('Usage: ts-node sync_payment_requests.ts --paymentIntentId <pi_...>')
    process.exit(1)
  }

  try {
    const intent = await listPaymentIntentsByID(paymentIntentId)

    // --- Friendly, structured console output ---
    console.log('\n' + bold('Stripe Payment Intent Summary'))
    console.log('='.repeat(32))

    section('Summary')
    kv('ID', intent.id)
    kv('Status', intent.status)
    kv('Amount', formatAmount(intent.amount, intent.currency))
    kv('Created', formatDate(intent.created))
    kv('Live mode', String(!!intent.livemode))
    kv(
      'Customer',
      intent.customer ??
        intent.customer_details ??
        intent.payment_method?.billing_details?.email ??
        '-',
    )

    const metadata = intent.metadata || {}
    const paymentRequestId = metadata?.payment_request_id || getPaymentRequestIdFromArgs()
    const userId = metadata?.user_id || getUserIdFromArgs()
    const paymentRequestPaymentId = metadata?.payment_request_payment_id
    section('Metadata')
    const mdKeys = Object.keys(metadata || {})
    if (mdKeys.length) {
      mdKeys.forEach((k) => kv(k, metadata[k]))
    } else {
      console.log(dim('No metadata'))
    }

    section('Metadata checks')
    check('payment_request_id', !!paymentRequestId)
    check('user_id', !!userId)
    check('payment_request_payment_id', !!paymentRequestPaymentId)

    if (paymentRequestPaymentId) {
      kv('We have a Payment Request Payment ID', paymentRequestPaymentId)
      kv('Skipping further checks as Payment Request Payment ID is present', 'Done')
    } else {
      kv('Start to create a new Payment Request Payment for this Payment Intent', intent.id)
      if (!paymentRequestId || !userId) {
        console.error('Cannot create Payment Request Payment without paymentRequestId and userId')
        process.exit(1)
      }
      const prPayment = await createPaymentRequestPayment(intent, userId, paymentRequestId)
      if (prPayment.id) {
        const updatedMetadata: any = await updateMetadata(intent.id, {
          payment_request_payment_id: prPayment.id,
          user_id: userId,
          payment_request_id: paymentRequestId,
        })
        kv('Updated Payment Intent metadata with payment_request_payment_id', prPayment.id)
        kv('Created Payment Request Payment ID', prPayment.id)
        kv('Created Payment Request Payment', JSON.stringify(prPayment, null, 2))
        kv('Updated Payment Intent metadata', JSON.stringify(updatedMetadata, null, 2))
      }
    }

    if (hasFlag('--json', '-j')) {
      section('Raw PaymentIntent JSON')
      console.log(JSON.stringify(intent, null, 2))
    }
    // --- end friendly output ---
  } catch (err: any) {
    console.error('Error listing payment intents:', err?.message ?? err)
    process.exit(1)
  }
}

if (require.main === module) {
  // Run only when invoked directly
  main()
}
