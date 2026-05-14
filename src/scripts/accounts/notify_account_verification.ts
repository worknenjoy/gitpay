import { i18nConfigure } from '../../shared/i18n/i18n'
import { findUsersWithAccountId } from '../../queries/user/findUsersWithAccountId'
import { retrieveAccount } from '../../queries/provider/stripe/account'
import PayoutMail from '../../mail/payout'

const parseStatusFilter = (): string | null => {
  const idx = process.argv.indexOf('--status')
  if (idx === -1) return null
  const value = process.argv[idx + 1]
  if (!value || !['rejected', 'currently_due'].includes(value)) {
    console.error(`Invalid --status value: "${value}". Use "rejected" or "currently_due".`)
    process.exit(1)
  }
  return value
}

const notifyAccountVerificationScript = async () => {
  i18nConfigure()

  const statusFilter = parseStatusFilter()
  if (statusFilter) {
    console.log(`Filtering notifications by status: ${statusFilter}`)
  }

  const users = await findUsersWithAccountId()
  console.log(`Found ${users.length} users with a connected Stripe account.`)

  let countRejected = 0
  let countCurrentlyDue = 0
  let countOk = 0

  for (const user of users) {
    const { id, email, account_id } = user.dataValues

    let account: any
    try {
      account = await retrieveAccount(account_id)
    } catch (err) {
      console.error(`  [user ${id}] Could not retrieve Stripe account ${account_id}:`, err)
      continue
    }

    const disabledReason: string = account?.requirements?.disabled_reason || ''
    const currentlyDue: string[] = account?.requirements?.currently_due || []
    const ssnDue = currentlyDue.filter((r) => r === 'individual.ssn_last_4')

    if (disabledReason.startsWith('rejected')) {
      if (!statusFilter || statusFilter === 'rejected') {
        console.log(`  [user ${id} / ${email}] Status: REJECTED — sending rejected email.`)
        await PayoutMail.accountRejected(user.dataValues)
        countRejected++
      } else {
        console.log(`  [user ${id} / ${email}] Status: REJECTED — skipped by filter.`)
      }
    } else if (ssnDue.length > 0) {
      if (!statusFilter || statusFilter === 'currently_due') {
        console.log(
          `  [user ${id} / ${email}] Status: CURRENTLY_DUE (SSN last 4) — sending verification email.`
        )
        await PayoutMail.accountCurrentlyDue(user.dataValues, ssnDue)
        countCurrentlyDue++
      } else {
        console.log(`  [user ${id} / ${email}] Status: CURRENTLY_DUE — skipped by filter.`)
      }
    } else {
      console.log(`  [user ${id} / ${email}] Status: OK — no action needed.`)
      countOk++
    }
  }

  console.log('-----------------------------------------------------------')
  console.log(`Rejected accounts notified:      ${countRejected}`)
  console.log(`Currently-due accounts notified: ${countCurrentlyDue}`)
  console.log(`Accounts with no issues:         ${countOk}`)
}

notifyAccountVerificationScript()
