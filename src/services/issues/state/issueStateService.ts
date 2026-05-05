import { issueFundedStateService } from './states/issueFundedStateService'
import { issueClaimedStateService } from './states/issueClaimedStateService'
import { issueCompletedStateService } from './states/issueCompletedStateService'

export async function syncAllIssuesStates(): Promise<any> {
  const resultFunded = await issueFundedStateService()
  const resultClaimed = await issueClaimedStateService()
  const resultCompleted = await issueCompletedStateService()
  return [...resultFunded, ...resultClaimed, ...resultCompleted]
}
