import { findUnclaimedBountiesWithMergedPrs } from '../../../queries/issue/bounty/findUnclaimedBountiesWithMergedPrs'
import ClaimMail from '../../../modules/mail/templates/issue/claim'

export const notifyUnclaimedBounties = async () => {
  const unclaimedBountiesWithMergedPrs = await findUnclaimedBountiesWithMergedPrs()
  for (const { issue, providerIssues, user } of unclaimedBountiesWithMergedPrs) {
    if (user) {
      console.log(
        `Notify user ${user.username} (${user.email}) about unclaimed bounty on issue ${issue.id}`
      )
      await ClaimMail.notifyUnclaimedBounties(user, issue, providerIssues[0].pull_request)
    } else {
      console.log(`No GitPay user found for issue ${issue.id} author.`)
    }
  }
  return unclaimedBountiesWithMergedPrs
}
