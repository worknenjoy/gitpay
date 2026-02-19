import { findIssuesCreatedBefore } from '../findIssuesCreatedBefore'
import { issueHasMergedPullRequest } from './issueHasMergedPullRequest'

type FindOldIssuesWithoutMergedPrsOptions = {
  now?: Date
  olderThanDays?: number
  findOptions?: any
}

export const findOldIssuesWithoutMergedPrs = async (
  options: FindOldIssuesWithoutMergedPrsOptions = {}
) => {
  const now = options.now ?? new Date()
  const olderThanDays = options.olderThanDays ?? 365
  const cutoffDate = new Date(now.getTime() - olderThanDays * 24 * 60 * 60 * 1000)

  const oldIssues = await findIssuesCreatedBefore(cutoffDate, options.findOptions)

  const results = await Promise.all(
    (oldIssues ?? []).map(async (issue: any) => {
      try {
        const hasMergedPr = await issueHasMergedPullRequest(issue.id)
        return hasMergedPr ? false : issue
      } catch (err) {
        // If we can't determine PR status (missing URL, API error, etc),
        // do not include the issue to avoid false positives.
        return false
      }
    })
  )

  return results.filter(Boolean)
}
