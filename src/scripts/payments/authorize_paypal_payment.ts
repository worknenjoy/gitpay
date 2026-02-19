import { authorizePaypalOrder } from '../../services/payments/authorizations/authorizePaypalOrder'
import { authorizePaypalPayment } from '../../services/payments/authorizations/authorizePaypalPayment'

function readArg(names: string[]): string | null {
  const withEq = process.argv.find((a) => names.some((n) => a.startsWith(`${n}=`)))
  if (withEq) return withEq.split('=')[1]

  const idx = process.argv.findIndex((a) => names.includes(a))
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1]

  return null
}

function printHelp() {
  console.log('Authorize a PayPal order (default) or capture an authorization (optional)')
  console.log('')
  console.log('Usage:')
  console.log('  # Authorize an order (recommended)')
  console.log('  npm run paypal:authorize -- <orderId>')
  console.log('  npm run paypal:authorize -- --orderId=<orderId>')
  console.log('')
  console.log('  # Capture an authorization (explicit)')
  console.log('  npm run paypal:authorize -- --capture --authorizationId=<authorizationId>')
  console.log('')
  console.log('Env:')
  console.log('  PAYPAL_HOST, PAYPAL_CLIENT, PAYPAL_SECRET')
}

function hasFlag(...names: string[]) {
  return process.argv.some((a) => names.includes(a))
}

function formatPaypalError(err: any) {
  const raw = err?.error
  const parsed = typeof raw === 'string' ? safeJsonParse(raw) : raw
  if (parsed?.name || parsed?.message) {
    return {
      name: parsed?.name,
      message: parsed?.message,
      details: parsed?.details,
      debug_id: parsed?.debug_id
    }
  }
  return null
}

function safeJsonParse(s: string) {
  try {
    return JSON.parse(s)
  } catch {
    return null
  }
}

async function main() {
  const positional = process.argv[2] && !process.argv[2].startsWith('-') ? process.argv[2] : null
  const captureMode = hasFlag('--capture')

  if (captureMode) {
    const authorizationId =
      readArg(['--authorizationId', '--auth', '-a']) ?? positional ?? process.env.AUTHORIZATION_ID

    if (!authorizationId) {
      printHelp()
      process.exit(1)
    }

    const result = await authorizePaypalPayment({ authorizationId })
    console.log(JSON.stringify(result, null, 2))
    return
  }

  const orderId = readArg(['--orderId', '--order', '-o']) ?? positional ?? process.env.ORDER_ID

  if (!orderId) {
    printHelp()
    process.exit(1)
  }

  const { result, authorizationId } = await authorizePaypalOrder({ orderId })
  console.log(JSON.stringify({ authorizationId, result }, null, 2))
}

main().catch((err) => {
  const pretty = formatPaypalError(err)
  if (pretty) {
    console.error('PayPal error:', JSON.stringify(pretty, null, 2))
  } else {
    console.error(err)
  }
  process.exit(1)
})
