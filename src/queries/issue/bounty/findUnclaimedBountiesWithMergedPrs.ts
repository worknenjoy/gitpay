import { type Issue } from '../../../types/issue'
import { findUnclaimedBounties } from './findUnclaimedBounties'
import { findIssueLinkedPullRequest } from '../../issue/pull-request/findIssueLinkedPullRequest'
import { findUsersByProvider } from '../../user/findUsersByProvider'

export const findUnclaimedBountiesWithMergedPrs = async () => {
  const unclaimedBounties = await findUnclaimedBounties()

  const results = await Promise.all(
    unclaimedBounties.map(async (issue: Issue) => {
      try {
        const linkedPrs = await findIssueLinkedPullRequest(issue.id)
        const mergedPrs = (linkedPrs ?? []).filter((pr: any) => pr?.pull_request?.merged_at != null)

        const entriesForIssue = await Promise.all(
          mergedPrs.map(async (pr: any) => {
            const usersOnGitpay = await findUsersByProvider({
              provider: 'github',
              provider_id: String(pr?.user?.id),
              provider_username: pr?.user?.login,
              provider_email: pr?.user?.email
            })

            return (usersOnGitpay ?? [])
              .filter((u: any) => u?.id)
              .map((user: any) => ({
                issue,
                providerIssues: mergedPrs,
                user
              }))
          })
        )

        return entriesForIssue.flat()
      } catch (err) {
        console.error('Error processing issue', issue.id, err)
        return false
      }
    }).filter(Boolean)
  )
  return results.flat()
}
