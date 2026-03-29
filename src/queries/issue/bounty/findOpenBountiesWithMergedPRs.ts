import { Op } from 'sequelize'
import { type IssueStatus } from '../../../types/issue'
import Models from '../../../models'
import { IssueStatuses } from '../../../constants/issue'
import { findIssueLinkedPullRequest } from '../pull-request/findIssueLinkedPullRequest'
import { findUsersByProvider } from '../../user/findUsersByProvider'

const models = Models as any

const ONE_YEAR_AGO = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)

export const findOpenBountiesWithMergedPRs = async () => {
  const tasks = await models.Task.findAll({
    where: {
      [Op.and]: [
        { value: { [Op.gt]: 0 } },
        { status: IssueStatuses.OPEN as IssueStatus },
        { paid: false },
        { createdAt: { [Op.lt]: ONE_YEAR_AGO } }
      ]
    },
    include: [models.Order]
  })

  const results = await Promise.all(
    tasks.map(async (issue: any) => {
      try {
        const linkedPrs = await findIssueLinkedPullRequest(issue.id)
        const mergedPrs = linkedPrs.filter((pr: any) => pr?.pull_request?.merged_at != null)
        if (mergedPrs.length === 0) {
          return false
        }
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
        if (entriesForIssue.length === 0) {
          return false
        }

        return entriesForIssue.flat()
      } catch (err) {
        console.error('Error processing issue', issue.id, err)
        return false
      }
    })
  )

  const resultsFlat = results.flat().filter(Boolean) as any[]

  const seenIds = new Set<string | number>()
  const deduped = resultsFlat.filter((entry: any) => {
    const issueId = entry?.issue?.id
    const userId = entry?.user?.id
    if (issueId == null || userId == null) return false
    const key = `${issueId}:${userId}`
    if (seenIds.has(key)) return false
    seenIds.add(key)
    return true
  })
  return deduped
}
