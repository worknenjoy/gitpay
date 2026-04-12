import { markIssueAsClaimed } from "../../../../mutations/issue/state/markIssueStateAsClaimed"
import findNewClaimedIssues from "../../../../queries/issue/claims/findNewClaimedIssues"


export const issueClaimedStateService = async () => {
  const claimedStatesToCheck = await findNewClaimedIssues()
  const markedAsClaimed = []
  for (const issue of claimedStatesToCheck) {
    if (issue.state !== 'claimed') {
      const claimed = await markIssueAsClaimed(issue.id)
      markedAsClaimed.push(claimed)
    }
  }
  return markedAsClaimed
}
