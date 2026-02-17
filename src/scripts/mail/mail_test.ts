/*
	Mail preview script

	Usage examples:
    - tsx src/scripts/mail/mail_test.ts paymentRequest.paymentRequestInitiated
    - tsx src/scripts/mail/mail_test.ts paymentRequest.sendConfirmationWithInstructions --out tmp/mail-previews

	It will render the selected mail method with sample data and save an HTML file
	you can open in a browser.
*/

import * as fs from 'fs'
import * as path from 'path'
// i18n has no bundled typings in this project; import via require to avoid TS errors
// eslint-disable-next-line @typescript-eslint/no-var-requires
const i18n = require('i18n') as any
import { disputeCreated } from '../data/stripe.webhook.charge.dispute.created'

// Ensure we never actually send emails while previewing
process.env.NODE_ENV = 'test'

// Resolve repo root from this file location: src/scripts/mail -> repo root
const repoRoot = path.resolve(__dirname, '../../..')

// Configure i18n for rendering templates
i18n.configure({
  directory: path.join(repoRoot, 'locales'),
  locales: ['en', 'br'],
  defaultLocale: 'en',
  updateFiles: false,
  logWarnFn: (msg: unknown) => console.warn('WARN:', msg),
  logErrorFn: (msg: unknown) => console.error('ERROR:', msg)
})
i18n.setLocale('en')

type PreviewResult = {
  htmlPath: string
  subject?: string
}

function parseArgs(argv: string[]) {
  const args = argv.slice(2)
  if (args.length === 0 || args[0].startsWith('-')) {
    printHelp()
    process.exit(1)
  }
  const methodPath = args[0]
  const outDirArg = args.find((a) => a.startsWith('--out='))
  const outDir = outDirArg ? outDirArg.split('=')[1] : path.join(repoRoot, 'tmp', 'mail-previews')
  return { methodPath, outDir }
}

function printHelp() {
  console.log('Usage: tsx src/scripts/mail/mail_test.ts <ModuleOrFile>.<method> [--out=dir]')
  console.log('Examples:')
  console.log('  tsx src/scripts/mail/mail_test.ts paymentRequest.paymentRequestInitiated')
  console.log(
    '  tsx src/scripts/mail/mail_test.ts PaymentRequestMail.transferInitiatedForPaymentRequest --out tmp/mail-previews'
  )
}

function normalizeModuleName(raw: string): string {
  // Accept either: paymentRequest or PaymentRequestMail; remove trailing 'Mail'
  const base = raw.replace(/Mail$/i, '')
  // lower-case first char to match file naming (e.g., PaymentRequest -> paymentRequest)
  return base.charAt(0).toLowerCase() + base.slice(1)
}

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true })
}

function safeFileName(input: string) {
  return input.replace(/[^a-zA-Z0-9._-]/g, '_')
}

function nowStamp() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`
}

// Build sample data for common mailers
function buildSamples(moduleName: string, methodName: string): any[] {
  const user = {
    email: 'preview@example.com',
    language: 'en',
    receiveNotifications: true
  }

  if (moduleName === 'paymentRequest') {
    const paymentRequest = {
      title: 'Sample payment request',
      description: 'This is a preview of the payment request email.',
      send_instructions_email: true,
      instructions_content: 'Follow these instructions:\n\n1) Step one\n2) Step two\n\nThanks!',
      amount: 123.45,
      custom_amount: false,
      currency: 'USD',
      payment_url: 'https://example.com/pay/req_123'
    }
    const paymentRequestPayment = {
      amount: 123.45,
      currency: 'USD',
      status: 'paid',
      PaymentRequestCustomer: {
        name: 'John Doe',
        email: 'john.doe@example.com'
      },
      PaymentRequest: paymentRequest
    }
    const paymentRequestTransaction = {
      amount: -5000,
      currency: 'USD',
      type: 'DEBIT',
      reason: 'DISPUTE',
      reason_details: 'product_not_received',
      status: 'lost',
      openedAt: new Date(123),
      closedAt: new Date(456),
      PaymentRequestBalance: {
        userId: 1,
        balance: -5000
      }
    }
    if (/transferInitiated/i.test(methodName)) {
      return [user, paymentRequest, 100, 92]
    }
    if (/paymentMadeForPaymentRequest/i.test(methodName)) {
      return [user, paymentRequestPayment]
    }

    if (/sendConfirmationWithInstructions/i.test(methodName)) {
      return [paymentRequestPayment]
    }
    if (/newBalanceTransactionForPaymentRequest/i.test(methodName)) {
      return [user, paymentRequestPayment, paymentRequestTransaction]
    }
    if (/newDisputeCreatedForPaymentRequest/i.test(methodName)) {
      return [user, disputeCreated, paymentRequestPayment]
    }
    if (/newDisputeClosedForPaymentRequest/i.test(methodName)) {
      return [user, 'lost', disputeCreated, paymentRequestPayment]
    }
  }

  if (moduleName === 'payout') {
    const payout = {
      amount: 1000,
      currency: 'usd',
      arrival_date: Math.floor(Date.now() / 1000) + 86400
    }
    if (/payoutCreated/i.test(methodName)) {
      return [user, payout]
    }

    if (/payoutUpdated/i.test(methodName)) {
      return [user, { ...payout, reference_number: 'tr_1234567890' }]
    }

    if (/payoutFailed/i.test(methodName)) {
      return [user, payout]
    }

    if (/payoutPaid/i.test(methodName)) {
      return [user, { ...payout, reference_number: 'tr_1234567890' }]
    }
  }

  // Generic 2-arg default: (user, context)
  return [user, { id: 1, title: 'Sample', description: 'Preview content' }]
}

async function run(): Promise<PreviewResult> {
  const { methodPath, outDir } = parseArgs(process.argv)
  const [rawModuleToken, rawMethod] = methodPath.split('.')
  if (!rawModuleToken || !rawMethod) {
    printHelp()
    process.exit(1)
  }

  const moduleFile = normalizeModuleName(rawModuleToken)
  const mailModulePath = path.join(repoRoot, 'src', 'mail', `${moduleFile}.ts`)

  if (!fs.existsSync(mailModulePath)) {
    throw new Error(`Mail module not found: ${mailModulePath}`)
  }

  // Load mail module (CommonJS export)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mailModule = require(mailModulePath)
  const mailExports = mailModule?.default || mailModule
  const fn = mailExports?.[rawMethod]

  if (typeof fn !== 'function') {
    throw new Error(`Method not found on module export: ${rawMethod}`)
  }

  // Build inputs and execute the mail method (NODE_ENV=test prevents actual send)
  const args = buildSamples(moduleFile, rawMethod)
  const result = await fn(...args)

  // The request fallback returns an array with content passed to it
  // We also want to wrap with the default template to produce full HTML
  const defaultTemplatePath = path.join(
    repoRoot,
    'src',
    'mail',
    'templates',
    'default.js'
  )
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const defaultTemplate = require(defaultTemplatePath)

  // Try to extract subject and raw content
  let subject: string | undefined
  let rawContent = ''

  // New robust extraction covering common shapes returned by mail methods
  const tryExtract = (res: any) => {
    if (!res) return
    // Direct string HTML
    if (typeof res === 'string') {
      rawContent = res
      return
    }
    // Object with common HTML fields
    if (typeof res === 'object') {
      subject = subject || res.subject || res.title
      rawContent =
        rawContent ||
        res.html ||
        res.body ||
        res.content ||
        (Array.isArray(res.value) && res.value[0] && (res.value[0].value || res.value[0].html)) ||
        (typeof res.value === 'string' ? res.value : '')
    }
    // Array from request() helper or other wrappers
    if (Array.isArray(res)) {
      // First element might be envelope with subject/value
      const first = res[0]
      if (first && typeof first === 'object') {
        subject = subject || first.subject || first.title
        if (Array.isArray(first.value)) {
          const v0 = first.value[0]
          if (v0 && typeof v0 === 'object') {
            rawContent = rawContent || v0.value || v0.html || v0.body || v0.content || ''
          }
        } else if (typeof first.value === 'string') {
          rawContent = rawContent || first.value
        }
      }
      // Or any element that might contain html/body
      for (const el of res) {
        if (typeof el === 'string') {
          rawContent = rawContent || el
        } else if (el && typeof el === 'object') {
          subject = subject || el.subject || el.title
          rawContent =
            rawContent ||
            el.html ||
            el.body ||
            el.content ||
            (Array.isArray(el.value) && el.value[0] && (el.value[0].value || el.value[0].html)) ||
            (typeof el.value === 'string' ? el.value : '')
        }
        if (rawContent) break
      }
    }
  }

  tryExtract(result)

  if (!rawContent) {
    throw new Error(
      'Could not extract email HTML content from the result. Ensure NODE_ENV=test and that the mail method uses the request() helper.'
    )
  }

  const fullHtml: string = defaultTemplate.defaultEmailTemplate(rawContent)

  ensureDir(outDir)
  const baseName = `${safeFileName(moduleFile)}.${safeFileName(rawMethod)}.${nowStamp()}`
  const htmlPath = path.join(outDir, `${baseName}.html`)
  fs.writeFileSync(htmlPath, fullHtml, 'utf8')

  console.log('Saved mail preview:')
  console.log(htmlPath)
  if (subject) console.log(`Subject: ${subject}`)

  return { htmlPath, subject }
}

run().catch((err) => {
  console.error('Mail preview failed:', err)
  process.exit(1)
})
