import readline from 'readline'
import { Op } from 'sequelize'
import { i18nConfigure } from '../../shared/i18n/i18n'
import { balanceAdjustmentService } from '../../services/paymentRequest/balanceAdjustmentService'
import { calculateAmountWithPercent } from '../../utils/amount/handle-amount'
import models from '../../models'

const currentModels = models as any

function prompt(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve))
}

function parseArgs() {
  const args = process.argv.slice(2)
  const result: Record<string, string> = {}
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--') && args[i + 1]) {
      result[args[i].slice(2)] = args[i + 1]
      i++
    }
  }
  return result
}

function formatCents(cents: number, currency: string): string {
  const { decimal } = calculateAmountWithPercent(cents, 0, 'centavos', currency)
  return `${decimal} ${currency.toUpperCase()}`
}

function printDebtTable(rows: Array<{ index: number; id: number; email: string; balance: number; currency: string }>) {
  const COL = { idx: 4, id: 12, email: 30, balance: 20 }
  const sep = `${'─'.repeat(COL.idx + 2)}┼${'─'.repeat(COL.id + 2)}┼${'─'.repeat(COL.email + 2)}┼${'─'.repeat(COL.balance + 2)}`
  const header =
    ` ${'#'.padEnd(COL.idx)} │ ${'Balance ID'.padEnd(COL.id)} │ ${'User Email'.padEnd(COL.email)} │ ${'Balance'.padEnd(COL.balance)}`
  console.log('\nAccounts with balance in debt:\n')
  console.log(header)
  console.log(sep)
  for (const r of rows) {
    const balStr = formatCents(r.balance, r.currency)
    console.log(
      ` ${String(r.index).padEnd(COL.idx)} │ ${String(r.id).padEnd(COL.id)} │ ${r.email.padEnd(COL.email)} │ ${balStr.padStart(COL.balance)}`
    )
  }
  console.log('')
}

async function selectBalance(
  rl: readline.Interface,
  rows: Array<{ index: number; id: number; email: string; balance: number; currency: string }>
): Promise<typeof rows[0] | null> {
  const input = await prompt(rl, 'Enter number to select (or q to quit): ')
  if (input.trim().toLowerCase() === 'q') return null
  const n = parseInt(input.trim(), 10)
  if (isNaN(n) || n < 1 || n > rows.length) {
    console.error(`Invalid selection. Enter a number between 1 and ${rows.length}.`)
    return selectBalance(rl, rows)
  }
  return rows[n - 1]
}

async function main() {
  i18nConfigure()

  const args = parseArgs()
  const currency = args.currency || 'usd'

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

  try {
    let balanceId: number
    let balanceCurrency: string = currency

    if (args.paymentRequestBalanceId) {
      balanceId = parseInt(args.paymentRequestBalanceId, 10)

      const balance = await currentModels.PaymentRequestBalance.findByPk(balanceId, {
        include: [{ model: currentModels.User }]
      })
      if (!balance) {
        console.error(`No PaymentRequestBalance found with id ${balanceId}`)
        process.exit(1)
      }

      const b = balance.dataValues ?? balance
      const user = balance.User?.dataValues ?? balance.User
      const currentBalance = Number(b.balance)
      balanceCurrency = b.currency || currency

      console.log('\n--- Balance ---')
      console.log(`  id:              ${b.id}`)
      console.log(`  user:            ${user?.email ?? '(unknown)'}`)
      console.log(`  current balance: ${currentBalance} cents (${formatCents(currentBalance, balanceCurrency)})`)
      console.log('---------------')
    } else {
      const debtBalances = await currentModels.PaymentRequestBalance.findAll({
        where: { balance: { [Op.lt]: 0 } },
        include: [{ model: currentModels.User }],
        order: [['balance', 'ASC']]
      })

      if (!debtBalances || debtBalances.length === 0) {
        console.log('\nNo accounts with balance in debt found.')
        process.exit(0)
      }

      const rows = debtBalances.map((b: any, i: number) => {
        const data = b.dataValues ?? b
        const user = b.User?.dataValues ?? b.User
        return {
          index: i + 1,
          id: data.id,
          email: user?.email ?? '(unknown)',
          balance: Number(data.balance),
          currency: data.currency || 'usd'
        }
      })

      printDebtTable(rows)

      const selected = await selectBalance(rl, rows)
      if (!selected) {
        console.log('Aborted.')
        process.exit(0)
      }

      balanceId = selected.id
      balanceCurrency = selected.currency

      console.log(`\nSelected: Balance ID ${selected.id} — ${selected.email} — ${formatCents(selected.balance, selected.currency)}`)
    }

    let amount: number

    if (args.amount !== undefined) {
      amount = parseInt(args.amount, 10)
      if (isNaN(amount) || amount <= 0) {
        console.error('--amount must be a positive integer (cents)')
        process.exit(1)
      }
    } else {
      const balance = await currentModels.PaymentRequestBalance.findByPk(balanceId)
      const currentBalance = Number((balance.dataValues ?? balance).balance)
      balanceCurrency = (balance.dataValues ?? balance).currency || balanceCurrency

      if (currentBalance < 0) {
        const needed = Math.abs(currentBalance)
        const autoConfirm = await prompt(
          rl,
          `\nBalance due is ${needed} cents (${formatCents(needed, balanceCurrency)}). Apply credit of ${needed} cents to zero it? (y/n): `
        )
        if (autoConfirm.trim().toLowerCase() === 'y') {
          amount = needed
        } else {
          const manualInput = await prompt(rl, 'Enter amount in cents to apply as credit: ')
          amount = parseInt(manualInput.trim(), 10)
          if (isNaN(amount) || amount <= 0) {
            console.error('Invalid amount. Aborted.')
            process.exit(1)
          }
        }
      } else {
        console.log(
          `\nBalance is ${currentBalance} cents — no debt to clear. Use --amount to apply a manual credit anyway.`
        )
        process.exit(0)
      }
    }

    console.log('\n--- Adjustment to apply ---')
    console.log(`  paymentRequestBalanceId: ${balanceId}`)
    console.log(`  type:                    CREDIT`)
    console.log(`  reason:                  ADJUSTMENT`)
    console.log(`  reason_details:          manual_payment_for_credit_due`)
    console.log(`  amount:                  ${amount} cents (${formatCents(amount, balanceCurrency)})`)
    console.log('---------------------------')

    const confirm = await prompt(rl, '\nApply this adjustment? (y/n): ')
    if (confirm.trim().toLowerCase() !== 'y') {
      console.log('Aborted.')
      process.exit(0)
    }

    console.log('\nApplying balance adjustment...')
    const result = await balanceAdjustmentService({ paymentRequestBalanceId: balanceId, amount, currency: balanceCurrency })

    const newBalance = Number(result.balance.balance)
    console.log('\n--- Result ---')
    console.log(`  Transaction ID:  ${result.balanceTransaction.id}`)
    console.log(`  Credit applied:  ${amount} cents (${formatCents(amount, balanceCurrency)})`)
    console.log(`  New balance:     ${newBalance} cents (${formatCents(newBalance, result.balance.currency || balanceCurrency)})`)
    console.log(`  User notified:   ${result.user.email}`)
    console.log('\nDone.')
  } catch (err: any) {
    console.error('\nError:', err.message || err)
    process.exit(1)
  } finally {
    rl.close()
  }
}

main()
