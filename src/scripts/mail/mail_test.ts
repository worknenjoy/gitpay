/*
	Mail preview script

	Usage examples:
		- tsx src/scripts/mail/mail_test.ts paymentRequest.paymentRequestInitiated
		- tsx src/scripts/mail/mail_test.ts PaymentRequestMail.transferInitiatedForPaymentRequest --out tmp/mail-previews

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
    if (/newBalanceTransactionForPaymentRequest/i.test(methodName)) {
      return [user, paymentRequestPayment, paymentRequestTransaction]
    }
    if (/newDisputeCreatedForPaymentRequest/i.test(methodName)) {
      return [user, disputeCreated, paymentRequestPayment]
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
  const mailModulePath = path.join(repoRoot, 'src', 'modules', 'mail', `${moduleFile}.js`)

  if (!fs.existsSync(mailModulePath)) {
    throw new Error(`Mail module not found: ${mailModulePath}`)
  }

  // Load mail module (CommonJS export)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mailModule = require(mailModulePath)
  const fn = mailModule[rawMethod]
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
    'modules',
    'mail',
    'templates',
    'default.js'
  )
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const defaultTemplate = require(defaultTemplatePath)

  // Try to extract subject and raw content
  let subject: string | undefined
  let rawContent = ''

  if (Array.isArray(result) && result[0]) {
    subject = (result[0] as any).subject
    const valueArr = (result[0] as any).value
    if (Array.isArray(valueArr) && valueArr[0] && valueArr[0].value) {
      rawContent = valueArr[0].value
    }
  }

  if (!rawContent) {
    // Fallback: allow methods that return directly the HTML content
    if (typeof result === 'string') rawContent = result
  }

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
