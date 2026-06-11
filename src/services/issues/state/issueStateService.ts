import { issueRevertToCreatedStateService } from './states/issueRevertToCreatedStateService'
import { issueFundedStateService } from './states/issueFundedStateService'
import { issueClaimedStateService } from './states/issueClaimedStateService'
import { issueCompletedStateService } from './states/issueCompletedStateService'

export async function syncAllIssuesStates(): Promise<any[]> {
  const resultReverted = await issueRevertToCreatedStateService()
  const resultFunded = await issueFundedStateService()
  const resultClaimed = await issueClaimedStateService()
  const resultCompleted = await issueCompletedStateService()
  return [...resultReverted, ...resultFunded, ...resultClaimed, ...resultCompleted]
}
