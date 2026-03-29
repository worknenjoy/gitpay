import { Op } from 'sequelize'
import { type IssueStatus } from '../../../types/issue'
import Models from '../../../models'
import { IssueStatuses } from '../../../constants/issue'
import { getIssueTimeline } from '../../provider/github/getIssueTimeline'

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
    include: [models.Order, models.User]
  })

  const results = await Promise.all(
    tasks.map(async (issue: any) => {
      try {
        const timeline = await getIssueTimeline(issue.url)
        const extractPRs = (eventType: string) =>
          timeline
            .filter((event: any) => event.event === eventType)
            .filter((event: any) => event.source?.issue?.pull_request)
            .map((event: any) => event.source.issue)

        const connectedPrs = extractPRs('connected')
        const linkedPrs = connectedPrs.length > 0 ? connectedPrs : extractPRs('cross-referenced')
        const mergedPrs = linkedPrs.filter((pr: any) => pr?.pull_request?.merged_at != null)
        if (mergedPrs.length === 0) {
          return false
        }

        const user = issue.User ?? null

        return {
          issue,
          providerIssues: mergedPrs,
          user
        }
      } catch (err) {
        console.error('Error processing issue', issue.id, err)
        return false
      }
    })
  )

  const resultsFlat = results.filter(Boolean) as any[]

  const seenIds = new Set<string | number>()
  const deduped = resultsFlat.filter((entry: any) => {
    const issueId = entry?.issue?.id
    if (issueId == null) return false
    if (seenIds.has(issueId)) return false
    seenIds.add(issueId)
    return true
  })
  return deduped
}
