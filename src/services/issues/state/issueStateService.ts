import Models from '../../../models'
import { issueClaimedStateService } from './states/issueClaimedStateService'

const models = Models as any


export async function syncAllIssuesStates(): Promise<any> {

  const result = await issueClaimedStateService()

  return result
}
