import Models from '../../../models'
import { getIssueTimeline } from '../../provider/github/getIssueTimeline'

const models = Models as any

export const findIssueLinkedPullRequest = async (issueId: number) => {
  const issue = await models.Task.findByPk(issueId)
  if (!issue || !issue.url) {
    throw new Error('Issue not found or URL is missing')
  }
  try {
    const githubIssueTimelines = await getIssueTimeline(issue.url)
    const issueLinksEvent = githubIssueTimelines.filter(
      (event: any) => event.event === 'connected' || event.event === 'cross-referenced'
    )
    const onlyPR = issueLinksEvent.filter(
      (item: any) => item.source && item.source.issue.pull_request
    )
    if (!issueLinksEvent || !onlyPR) {
      return null
    }
    return onlyPR.map((pr: any) => pr.source.issue)
  } catch (err) {
    console.error('Error fetching issue timeline for issue', issueId)
    return null
  }
}
