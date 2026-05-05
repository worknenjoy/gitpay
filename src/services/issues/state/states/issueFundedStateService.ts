import { fillIssueFundedAt } from '../../../../mutations/issue/state/fillIssueFundedAt'
import findFundedIssuesWithoutFundedAt from '../../../../queries/issue/state/findFundedIssuesWithoutFundedAt'

export const issueFundedStateService = async () => {
  const fundedIssues = await findFundedIssuesWithoutFundedAt()
  const filled = []
  for (const issue of fundedIssues) {
    const result = await fillIssueFundedAt(issue)
    if (result) filled.push(result)
  }
  return filled
}
