import { i18nConfigure } from '../../shared/i18n/i18n'
import { findUsersWithAccountId } from '../../queries/user/findUsersWithAccountId'
import { retrieveAccount } from '../../queries/provider/stripe/account'
import PayoutMail from '../../mail/payout'

const notifyAccountVerificationScript = async () => {
  i18nConfigure()

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
      console.log(`  [user ${id} / ${email}] Status: REJECTED — sending rejected email.`)
      await PayoutMail.accountRejected(user.dataValues)
      countRejected++
    } else if (ssnDue.length > 0) {
      console.log(
        `  [user ${id} / ${email}] Status: CURRENTLY_DUE (SSN last 4) — sending verification email.`
      )
      await PayoutMail.accountCurrentlyDue(user.dataValues, ssnDue)
      countCurrentlyDue++
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
