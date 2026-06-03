import readline from 'readline'
import { i18nConfigure } from '../../shared/i18n/i18n'
import {
  transferManualService,
  getRecipientFromPR
} from '../../services/transfers/transferManualService'

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

async function main() {
  i18nConfigure()

  const args = parseArgs()

  if (!args.taskId || !args.pullRequestURL) {
    console.error('Usage: create_manual_transfer --taskId <n> --pullRequestURL <url> [--userId <n>]')
    process.exit(1)
  }

  const taskId = parseInt(args.taskId, 10)
  const pullRequestURL = args.pullRequestURL
  const userIdArg = args.userId ? parseInt(args.userId, 10) : undefined

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

  try {
    console.log(`\nLooking up recipient for PR: ${pullRequestURL}`)
    const { prAuthorLogin, user } = await getRecipientFromPR(pullRequestURL)

    if (!user) {
      console.error(`No platform user found matching GitHub login '${prAuthorLogin}'`)
      rl.close()
      process.exit(1)
    }

    const u = (user as any).dataValues ?? user
    console.log('\n--- Recipient User ---')
    console.log(`  id:               ${u.id}`)
    console.log(`  email:            ${u.email}`)
    console.log(`  username:         ${u.username}`)
    console.log(`  provider_username: ${u.provider_username}`)
    console.log(`  account_id:       ${u.account_id ?? '(none)'}`)
    console.log('----------------------')

    const confirm = await prompt(rl, '\nIs this the correct recipient? (y/n): ')
    if (confirm.trim().toLowerCase() !== 'y') {
      console.log('Aborted.')
      rl.close()
      process.exit(0)
    }

    const resolvedUserId = userIdArg ?? u.id

    console.log('\nCreating manual transfer...')
    const result = await transferManualService({ taskId, pullRequestURL, userId: resolvedUserId })

    console.log('\n--- Validation Flags ---')
    Object.entries(result.validationFlags).forEach(([key, val]) => {
      console.log(`  ${key}: ${val ? '✓' : '✗'}`)
    })

    console.log('\n--- Result ---')
    console.log(`  Transfer ID:   ${result.transfer.id}`)
    console.log(`  transfer_method: ${result.transfer.transfer_method}`)
    console.log(`  status:        ${result.transfer.status}`)
    console.log(`  value:         ${result.transfer.value}`)
    console.log(`  recipient:     ${result.recipientUser.email}`)
    console.log(`  TaskSolution:  ${result.taskSolution.id}`)
    console.log('\nDone. Task marked as paid and claimed.')
  } catch (err: any) {
    console.error('\nError:', err.message || err)
    process.exit(1)
  } finally {
    rl.close()
  }
}

main()
