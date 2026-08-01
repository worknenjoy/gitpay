import { findUnclaimedBountiesWithMergedPrs } from '../../../queries/issue/bounty/findUnclaimedBountiesWithMergedPrs'
import ClaimMail from '../../../mail/templates/issue/claim'
import { incrementIssueClaimRetries } from '../../../mutations/issue/state/incrementIssueClaimRetries'
import { refundUnclaimedBountyOrders } from './refundUnclaimedBountyOrders'

const CLAIM_RETRY_LIMIT = 2

export type UnclaimedBountyAction =
  | 'notified'
  | 'refunded'
  | 'skipped_no_user'
  | 'skipped_notifications_disabled'
  | 'notify_failed'
  | 'refund_failed'

export interface UnclaimedBountyResult {
  issue: any
  providerIssues: any[]
  user: any | null
  action: UnclaimedBountyAction
  claimRetriesBefore: number
  claimRetriesAfter?: number
  error?: string
}

export const notifyUnclaimedBounties = async (): Promise<UnclaimedBountyResult[]> => {
  const unclaimedBountiesWithMergedPrs = await findUnclaimedBountiesWithMergedPrs()
  const results: UnclaimedBountyResult[] = []

  for (const { issue, providerIssues, user } of unclaimedBountiesWithMergedPrs) {
    const claimRetriesBefore = issue.claim_retries ?? 0
    const base = {
      issue,
      providerIssues,
      user: user ?? null,
      claimRetriesBefore
    }

    if (claimRetriesBefore >= CLAIM_RETRY_LIMIT) {
      console.log(
        `Issue ${issue.id} reached retry limit (${claimRetriesBefore}). Refunding orders to original sponsors.`
      )
      try {
        await refundUnclaimedBountyOrders(issue.id)
        results.push({ ...base, action: 'refunded' })
      } catch (err: any) {
        const error = err?.message || String(err)
        console.error(`Failed to refund unclaimed bounty for issue ${issue.id}:`, err)
        results.push({ ...base, action: 'refund_failed', error })
      }
      continue
    }

    if (!user) {
      console.log(`No GitPay user found for issue ${issue.id} author.`)
      results.push({ ...base, action: 'skipped_no_user' })
      continue
    }

    if (user.receiveNotifications === false) {
      console.log(
        `Skip notify for issue ${issue.id}: user ${user.username} has notifications disabled.`
      )
      results.push({ ...base, action: 'skipped_notifications_disabled' })
      continue
    }

    console.log(
      `Notify user ${user.username} (${user.email}) about unclaimed bounty on issue ${issue.id}`
    )
    try {
      await ClaimMail.notifyUnclaimedBounties(user, issue, providerIssues[0].pull_request)
      const updatedIssue = await incrementIssueClaimRetries(issue.id)
      results.push({
        ...base,
        action: 'notified',
        claimRetriesAfter: updatedIssue.claim_retries ?? claimRetriesBefore + 1
      })
    } catch (err: any) {
      const error = err?.message || String(err)
      console.error(`Failed to notify unclaimed bounty for issue ${issue.id}:`, err)
      results.push({ ...base, action: 'notify_failed', error })
    }
  }

  return results
}

export { CLAIM_RETRY_LIMIT }
