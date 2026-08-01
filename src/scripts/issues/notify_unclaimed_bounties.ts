import { i18nConfigure } from '../../shared/i18n/i18n'
import {
  notifyUnclaimedBounties,
  type UnclaimedBountyAction,
  type UnclaimedBountyResult
} from '../../services/issues/claims/unclaimedBountyService'

const ACTION_LABELS: Record<UnclaimedBountyAction, string> = {
  notified: 'NOTIFIED (email sent, claim_retries incremented)',
  refunded: 'REFUNDED (retry limit reached, orders refunded, state closed)',
  skipped_no_user: 'SKIPPED (no GitPay user for PR author)',
  skipped_notifications_disabled: 'SKIPPED (user has receiveNotifications=false)',
  notify_failed: 'FAILED (notify)',
  refund_failed: 'FAILED (refund)'
}

const summarize = (results: UnclaimedBountyResult[]) => {
  const counts: Partial<Record<UnclaimedBountyAction, number>> = {}
  for (const r of results) {
    counts[r.action] = (counts[r.action] ?? 0) + 1
  }
  return counts
}

const notifyUnclaimedBountiesScript = async () => {
  i18nConfigure()
  const results = await notifyUnclaimedBounties()
  const counts = summarize(results)

  console.log('\n========== Unclaimed bounty notify run ==========')
  console.log(`Candidates: ${results.length}`)
  console.log(
    'Total amount:',
    results.reduce((sum, { issue }) => sum + (Number(issue.value) || 0), 0)
  )
  console.log('Outcome counts:', counts)
  console.log('=================================================\n')

  for (const result of results) {
    const { issue, providerIssues, user, action, claimRetriesBefore, claimRetriesAfter, error } =
      result
    console.log('------------------- Issue Details -------------------------')
    console.log(`Issue ID: ${issue.id}`)
    console.log(`Issue Title: ${issue.title}`)
    console.log(`Issue URL: ${issue.url}`)
    console.log(`Issue Bounty Value: ${issue.value}`)
    console.log(`claim_retries before: ${claimRetriesBefore}`)
    if (claimRetriesAfter != null) {
      console.log(`claim_retries after:  ${claimRetriesAfter}`)
    }
    console.log('------------------- Merged PRs Details --------------------')
    for (const pr of providerIssues) {
      console.log(`- Merged PR URL: ${pr.html_url}`)
      console.log(`- Merged PR Author: ${pr.user.login}`)
    }
    if (user) {
      console.log('------------------- GitPay User Details -------------------')
      console.log(`- GitPay User ID: ${user.id}`)
      console.log(`- GitPay User Email: ${user.email}`)
      console.log(`- GitPay User Username: ${user.username}`)
      console.log(`- receiveNotifications: ${user.receiveNotifications}`)
    } else {
      console.log('- No GitPay user found for this author.')
    }
    console.log('------------------- Outcome -----------------------------')
    console.log(`- ${ACTION_LABELS[action]}`)
    if (error) {
      console.log(`- Error: ${error}`)
    }
    console.log('-----------------------------------------------------------\n')
  }

  console.log('Done. Summary:', counts)
}

notifyUnclaimedBountiesScript().catch((err) => {
  console.error('notify_unclaimed_bounties failed:', err)
  process.exit(1)
})
