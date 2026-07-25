import Models from '../../models'
import { i18nConfigure } from '../../shared/i18n/i18n'
import { refundWalletBalance } from '../../services/payments/refunds/refundWalletBalance'
import Decimal from 'decimal.js'

const models = Models as any

const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
}

function hasFlag(...names: string[]) {
  return process.argv.some((arg) =>
    names.some((name) => arg === name || arg.startsWith(`${name}=`))
  )
}

function getArgValue(...names: string[]): string | null {
  for (const arg of process.argv) {
    for (const name of names) {
      if (arg.startsWith(`${name}=`)) {
        return arg.slice(name.length + 1)
      }
    }
  }
  const idx = process.argv.findIndex((arg) => names.includes(arg))
  if (idx >= 0 && process.argv[idx + 1] && !process.argv[idx + 1].startsWith('-')) {
    return process.argv[idx + 1]
  }
  return null
}

function printHelp() {
  console.log(`${C.bold}Refund inactive wallet balances via Stripe${C.reset}`)
  console.log('')
  console.log('Zeros wallet balances by refunding against wallet orders (newest first).')
  console.log('If the latest wallet order amount is greater than the available balance, a partial')
  console.log('refund is created and the order status becomes "partially_refunded".')
  console.log('If the latest order is smaller than the balance, older orders are checked until one')
  console.log('can cover the refund (or refunds are cascaded as a fallback).')
  console.log('')
  console.log('Usage:')
  console.log(`  ${C.cyan}npm run scripts:wallet:refund-inactive -- --all${C.reset}`)
  console.log(`  ${C.cyan}npm run scripts:wallet:refund-inactive -- --all --execute${C.reset}`)
  console.log(
    `  ${C.cyan}npm run scripts:wallet:refund-inactive -- --wallet-id=123 --execute${C.reset}`
  )
  console.log('')
  console.log('Flags:')
  console.log('  --all              Process every wallet with a positive balance')
  console.log('  --wallet-id=N      Process a single wallet by id')
  console.log('  --execute          Actually create Stripe refunds, update DB, and notify users')
  console.log('                     (without this flag the script is a dry run)')
  console.log('  --help, -h         Show this help')
  console.log('')
  console.log('Env:')
  console.log('  STRIPE_KEY, FRONTEND_HOST, and DB connection variables')
}

async function resolveWalletIds(all: boolean, walletIdArg: string | null): Promise<number[]> {
  if (walletIdArg) {
    const id = Number(walletIdArg)
    if (!Number.isFinite(id) || id <= 0) {
      throw new Error(`Invalid --wallet-id value: ${walletIdArg}`)
    }
    return [id]
  }

  if (!all) {
    return []
  }

  console.log(`${C.cyan}[Scan] Loading all wallets to compute balances...${C.reset}`)
  // afterFind recalculates balance for each wallet
  const wallets = await models.Wallet.findAll({
    order: [['id', 'ASC']]
  })

  const positive: number[] = []
  for (const wallet of wallets) {
    const balance = new Decimal(wallet.balance || 0)
    console.log(
      `${C.gray}  Wallet #${wallet.id} userId=${wallet.userId} balance=${balance.toFixed(2)}${C.reset}`
    )
    if (balance.greaterThan(0)) {
      positive.push(wallet.id)
    }
  }

  console.log(
    `${C.cyan}[Scan] ${wallets.length} wallet(s) scanned, ${positive.length} with positive balance${C.reset}`
  )
  return positive
}

async function main() {
  i18nConfigure()

  if (hasFlag('--help', '-h')) {
    printHelp()
    return
  }

  const all = hasFlag('--all')
  const execute = hasFlag('--execute')
  const walletIdArg = getArgValue('--wallet-id', '--walletId')

  console.log(`${C.bold}${C.magenta}💸 Gitpay — Refund inactive wallet balances${C.reset}`)
  console.log(
    `${C.dim}Mode: ${execute ? 'EXECUTE (live refunds)' : 'DRY RUN (no changes)'}${C.reset}`
  )
  console.log('')

  if (!all && !walletIdArg) {
    printHelp()
    console.log('')
    console.log(`${C.yellow}Provide --all or --wallet-id=N to select wallets.${C.reset}`)
    return
  }

  const walletIds = await resolveWalletIds(all, walletIdArg)

  if (walletIds.length === 0) {
    console.log(`${C.yellow}No wallets selected or no positive balances found.${C.reset}`)
    return
  }

  console.log(
    `${C.bold}Processing ${walletIds.length} wallet(s): ${walletIds.join(', ')}${C.reset}`
  )
  console.log('')

  let ok = 0
  let skipped = 0
  let failed = 0
  let totalRefunded = new Decimal(0)

  for (const walletId of walletIds) {
    console.log(
      `${C.blue}${C.bold}─── Wallet #${walletId} ───────────────────────────────────${C.reset}`
    )
    try {
      const result = await refundWalletBalance({
        walletId,
        reason: 'inactivity',
        dryRun: !execute,
        onStep: (message) => {
          console.log(`${C.gray}  → ${message}${C.reset}`)
        }
      })

      if (result.skipped) {
        skipped += 1
        console.log(`${C.yellow}  ~ Skipped: ${result.skipReason || 'n/a'}${C.reset}`)
        continue
      }

      for (const step of result.steps) {
        console.log(
          `${C.green}  ✓ Order #${step.walletOrderId}: refund ${step.refundAmount} | ${step.previousStatus} → ${step.newStatus}${
            step.stripeRefundId ? ` | stripe=${step.stripeRefundId}` : ' | (dry-run)'
          }${C.reset}`
        )
      }

      console.log(
        `${C.green}${C.bold}  ✓ Wallet #${walletId}: refunded ${result.refundedTotal} | balance ${result.previousBalance} → ${result.resultingBalance}${C.reset}`
      )

      totalRefunded = totalRefunded.plus(result.refundedTotal)
      ok += 1
    } catch (err: any) {
      failed += 1
      const message = err?.message || String(err)
      console.error(`${C.red}  ✗ Wallet #${walletId} failed: ${message}${C.reset}`)
      if (err?.stack) {
        console.error(`${C.dim}${err.stack}${C.reset}`)
      }
    }
    console.log('')
  }

  console.log(`${C.bold}════════ Summary ════════${C.reset}`)
  console.log(`  Mode:           ${execute ? 'EXECUTE' : 'DRY RUN'}`)
  console.log(`  Wallets ok:     ${C.green}${ok}${C.reset}`)
  console.log(`  Wallets skipped:${C.yellow}${skipped}${C.reset}`)
  console.log(`  Wallets failed: ${failed > 0 ? C.red : C.gray}${failed}${C.reset}`)
  console.log(`  Total refunded: ${C.bold}${totalRefunded.toFixed(2)}${C.reset}`)
  if (!execute) {
    console.log('')
    console.log(
      `${C.yellow}Dry run only. Pass --execute to create Stripe refunds, update orders, and email users.${C.reset}`
    )
  }
  console.log(`${C.bold}═════════════════════════${C.reset}`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(async () => {
    if (models?.sequelize?.close) {
      await models.sequelize.close()
    }
  })
