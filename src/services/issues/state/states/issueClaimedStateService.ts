import { markIssueAsClaimed } from '../../../../mutations/issue/state/markIssueStateAsClaimed'
import { fillIssueTimestampFromTransfer } from '../../../../mutations/issue/state/fillIssueTimestampFromTransfer'
import findNewClaimedIssues from '../../../../queries/issue/claims/findNewClaimedIssues'
import findClaimedIssuesWithoutClaimedAt from '../../../../queries/issue/state/findClaimedIssuesWithoutClaimedAt'

export const issueClaimedStateService = async () => {
  const claimedStatesToCheck = await findNewClaimedIssues()
  const markedAsClaimed = []
  for (const issue of claimedStatesToCheck) {
    const claimed = await markIssueAsClaimed(issue.id)
    markedAsClaimed.push(claimed)
  }

  const issuesWithoutClaimedAt = await findClaimedIssuesWithoutClaimedAt()
  for (const issue of issuesWithoutClaimedAt) {
    await fillIssueTimestampFromTransfer(issue, 'claimed_at')
  }

  return markedAsClaimed
}
