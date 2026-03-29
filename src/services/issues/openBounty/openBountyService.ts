import { findOpenBountiesWithMergedPRs } from '../../../queries/issue/bounty/findOpenBountiesWithMergedPRs'
import OpenBountyMail from '../../../mail/openBounty'

export const notifyOpenBountiesWithMergedPRs = async () => {
  const openBountiesWithMergedPrs = await findOpenBountiesWithMergedPRs()
  for (const { issue, providerIssues, user } of openBountiesWithMergedPrs) {
    if (user) {
      console.log(
        `Notify user ${user.username} (${user.email}) about open bounty on issue ${issue.id}`
      )
      await OpenBountyMail.notifyOpenBountyWithMergedPR(user, issue, providerIssues[0])
    } else {
      console.log(`No GitPay user found for issue ${issue.id}.`)
    }
  }
  return openBountiesWithMergedPrs
}
