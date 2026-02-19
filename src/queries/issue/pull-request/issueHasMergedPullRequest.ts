import { findIssueLinkedPullRequest } from './findIssueLinkedPullRequest'

export const issueHasMergedPullRequest = async (issueId: number) => {
  const linkedPrs = await findIssueLinkedPullRequest(issueId)
  return linkedPrs.some((pr: any) => pr?.pull_request?.merged_at != null)
}
