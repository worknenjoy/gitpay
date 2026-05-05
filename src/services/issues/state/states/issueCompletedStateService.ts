import { markIssueStateAsCompleted } from '../../../../mutations/issue/state/markIssueStateAsCompleted'
import { fillIssueTimestampFromTransfer } from '../../../../mutations/issue/state/fillIssueTimestampFromTransfer'
import findNewClaimedToCompletedIssues from '../../../../queries/issue/claims/findNewClaimedToCompletedIssues'
import findCompletedIssuesWithoutCompletedAt from '../../../../queries/issue/state/findCompletedIssuesWithoutCompletedAt'

export const issueCompletedStateService = async () => {
  const claimedStatesToCheck = await findNewClaimedToCompletedIssues()
  const markedAsCompleted = []
  for (const issue of claimedStatesToCheck) {
    const completed = await markIssueStateAsCompleted(issue.id)
    markedAsCompleted.push(completed)
  }

  const issuesWithoutCompletedAt = await findCompletedIssuesWithoutCompletedAt()
  for (const issue of issuesWithoutCompletedAt) {
    await fillIssueTimestampFromTransfer(issue, 'completed_at')
  }

  return markedAsCompleted
}
