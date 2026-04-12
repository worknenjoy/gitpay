import Models from '../../../models'
import { issueClaimedStateService } from './states/issueClaimedStateService'
import { issueCompletedStateService } from './states/issueCompletedStateService'

const models = Models as any

export async function syncAllIssuesStates(): Promise<any> {
  const resultClaimed = await issueClaimedStateService()
  const resultCompleted = await issueCompletedStateService()
  return [...resultClaimed, ...resultCompleted]
}
