import { fillIssueFundedAt } from '../../../../mutations/issue/state/fillIssueFundedAt'
import { markIssueStateAsFunded } from '../../../../mutations/issue/state/markIssueStateAsFunded'
import findFundedIssuesWithoutFundedAt from '../../../../queries/issue/state/findFundedIssuesWithoutFundedAt'
import findNewFundedIssues from '../../../../queries/issue/state/findNewFundedIssues'

export const issueFundedStateService = async () => {
  const newlyFundedIssues = await findNewFundedIssues()
  const markedAsFunded = []
  for (const issue of newlyFundedIssues) {
    const result = await markIssueStateAsFunded(issue.id)
    markedAsFunded.push(result)
  }

  const issuesWithoutFundedAt = await findFundedIssuesWithoutFundedAt()
  const filled = []
  for (const issue of issuesWithoutFundedAt) {
    const result = await fillIssueFundedAt(issue)
    if (result) filled.push(result)
  }

  return [...markedAsFunded, ...filled]
}
