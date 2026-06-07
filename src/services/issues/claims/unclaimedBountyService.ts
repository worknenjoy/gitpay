import { findUnclaimedBountiesWithMergedPrs } from '../../../queries/issue/bounty/findUnclaimedBountiesWithMergedPrs'
import ClaimMail from '../../../mail/templates/issue/claim'
import { incrementIssueClaimRetries } from '../../../mutations/issue/state/incrementIssueClaimRetries'
import { markIssueStateAsClosed } from '../../../mutations/issue/state/markIssueStateAsClosed'

const CLAIM_RETRY_LIMIT = 2

export const notifyUnclaimedBounties = async () => {
  const unclaimedBountiesWithMergedPrs = await findUnclaimedBountiesWithMergedPrs()
  for (const { issue, providerIssues, user } of unclaimedBountiesWithMergedPrs) {
    const retries = issue.claim_retries ?? 0

    if (retries >= CLAIM_RETRY_LIMIT) {
      console.log(
        `Issue ${issue.id} reached retry limit (${retries}). Auto-donating to platform fund.`
      )
      await markIssueStateAsClosed(issue.id)
      if (user) {
        await ClaimMail.notifyDonatedBountyToGitpay(user, issue)
      }
    } else if (user) {
      console.log(
        `Notify user ${user.username} (${user.email}) about unclaimed bounty on issue ${issue.id}`
      )
      await ClaimMail.notifyUnclaimedBounties(user, issue, providerIssues[0].pull_request)
      await incrementIssueClaimRetries(issue.id)
    } else {
      console.log(`No GitPay user found for issue ${issue.id} author.`)
    }
  }
  return unclaimedBountiesWithMergedPrs
}
