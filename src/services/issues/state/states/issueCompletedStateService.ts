import { TaskStates } from '../../../../constants/task'
import { markIssueAsClaimed } from '../../../../mutations/issue/state/markIssueStateAsClaimed'
import { markIssueStateAsCompleted } from '../../../../mutations/issue/state/markIssueStateAsCompleted'
import findNewClaimedToCompletedIssues from '../../../../queries/issue/claims/findNewClaimedToCompletedIssues'

export const issueCompletedStateService = async () => {
  const claimedStatesToCheck = await findNewClaimedToCompletedIssues()
  const markedAsCompleted = []
  for (const issue of claimedStatesToCheck) {
    const completed = await markIssueStateAsCompleted(issue.id)
    markedAsCompleted.push(completed)
  }
  return markedAsCompleted
}
