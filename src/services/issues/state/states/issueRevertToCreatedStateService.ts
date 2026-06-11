import findFundedIssuesToRevertToCreated from '../../../../queries/issue/state/findFundedIssuesToRevertToCreated'
import { markIssueStateAsCreated } from '../../../../mutations/issue/state/markIssueStateAsCreated'

export const issueRevertToCreatedStateService = async () => {
  const issues = await findFundedIssuesToRevertToCreated()
  const reverted = []
  for (const issue of issues) {
    const result = await markIssueStateAsCreated(issue.id)
    reverted.push(result)
  }
  return reverted
}
