import readline from 'readline'
import { i18nConfigure } from '../../shared/i18n/i18n'
import { payoutManualService } from '../../services/payouts/payoutManualService'
import { payoutUpdateService } from '../../services/payouts/payoutUpdateService'
import { findPayoutById } from '../../queries/payout/findPayoutById'
import models from '../../models'

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

async function runCreate(args: Record<string, string>, rl: readline.Interface) {
  if (!args.userId || !args.amount) {
    console.error(
      'Usage (create): create_manual_payout --userId <n> --amount <n> [--currency usd] [--method manual] [--description "..."]'
    )
    process.exit(1)
  }

  const userId = parseInt(args.userId, 10)
  const amount = parseFloat(args.amount)
  const currency = args.currency || 'usd'
  const method = args.method || 'manual'
  const description = args.description

  const user = await (models as any).User.findByPk(userId)
  if (!user) {
    console.error(`No user found with id ${userId}`)
    process.exit(1)
  }

  const u = user.dataValues ?? user
  console.log('\n--- Recipient User ---')
  console.log(`  id:                ${u.id}`)
  console.log(`  email:             ${u.email}`)
  console.log(`  username:          ${u.username}`)
  console.log(`  provider_username: ${u.provider_username}`)
  console.log('----------------------')
  console.log(`\n  Amount:      ${amount} ${currency.toUpperCase()}`)
  console.log(`  Method:      ${method}`)
  if (description) console.log(`  Description: ${description}`)

  const confirm = await prompt(rl, '\nIs this correct? (y/n): ')
  if (confirm.trim().toLowerCase() !== 'y') {
    console.log('Aborted.')
    process.exit(0)
  }

  console.log('\nCreating manual payout...')
  const result = await payoutManualService({ userId, amount, currency, method, description })

  console.log('\n--- Result ---')
  console.log(`  Payout ID:  ${result.payout.id}`)
  console.log(`  Status:     ${result.payout.status}`)
  console.log(`  Amount:     ${result.payout.amount} ${result.payout.currency?.toUpperCase()}`)
  console.log(`  Method:     ${result.payout.method}`)
  console.log(`  Recipient:  ${result.user.email}`)
  console.log('\nDone. User notified.')
}

async function runUpdate(args: Record<string, string>, rl: readline.Interface) {
  const payoutId = parseInt(args.payoutId, 10)

  if (!args.status) {
    console.error(
      'Usage (update): create_manual_payout --payoutId <n> --status <status> [--paid true] [--arrival_date <unix>] [--reference_number <str>]'
    )
    console.error('  Valid statuses: initiated, in_transit, paid, pending, canceled, failed')
    process.exit(1)
  }

  const payout = await findPayoutById(payoutId)
  if (!payout) {
    console.error(`No payout found with id ${payoutId}`)
    process.exit(1)
  }

  const p = payout.dataValues ?? payout
  const user =
    payout.User?.dataValues ?? payout.User ?? (await (models as any).User.findByPk(p.userId))
  const u = user?.dataValues ?? user

  console.log('\n--- Payout ---')
  console.log(`  id:              ${p.id}`)
  console.log(`  current status:  ${p.status}`)
  console.log(`  amount:          ${p.amount} ${p.currency?.toUpperCase()}`)
  console.log(`  method:          ${p.method}`)
  console.log(`  recipient:       ${u?.email ?? '(unknown)'}`)
  console.log('---------------')
  console.log(`\n  New status:    ${args.status}`)
  if (args.paid) console.log(`  paid:          ${args.paid}`)
  if (args.arrival_date) console.log(`  arrival_date:  ${args.arrival_date}`)
  if (args.reference_number) console.log(`  reference_number: ${args.reference_number}`)

  const confirm = await prompt(rl, '\nApply this update? (y/n): ')
  if (confirm.trim().toLowerCase() !== 'y') {
    console.log('Aborted.')
    process.exit(0)
  }

  console.log('\nUpdating payout...')
  const updated = await payoutUpdateService({
    id: payoutId,
    status: args.status,
    paid: args.paid === 'true' ? true : args.paid === 'false' ? false : undefined,
    arrival_date: args.arrival_date ? parseInt(args.arrival_date, 10) : undefined,
    reference_number: args.reference_number
  })

  const up = updated.dataValues ?? updated
  console.log('\n--- Result ---')
  console.log(`  Payout ID:  ${up.id}`)
  console.log(`  Status:     ${up.status}`)
  console.log(`  paid:       ${up.paid}`)
  if (up.reference_number) console.log(`  reference:  ${up.reference_number}`)
  console.log('\nDone. User notified.')
}

async function main() {
  i18nConfigure()

  const args = parseArgs()

  if (!args.payoutId && !args.userId) {
    console.error('Usage:')
    console.error(
      '  Create: create_manual_payout --userId <n> --amount <n> [--currency usd] [--method manual] [--description "..."]'
    )
    console.error(
      '  Update: create_manual_payout --payoutId <n> --status <status> [--paid true] [--arrival_date <unix>] [--reference_number <str>]'
    )
    process.exit(1)
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

  try {
    if (args.payoutId) {
      await runUpdate(args, rl)
    } else {
      await runCreate(args, rl)
    }
  } catch (err: any) {
    console.error('\nError:', err.message || err)
    process.exit(1)
  } finally {
    rl.close()
  }
}

main()
