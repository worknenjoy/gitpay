import {
  buildClosedBountyReminderBody,
  getGitHubIssueContext,
  isGitHubCommentingEnabled,
  postGitHubIssueComment
} from './postGitHubIssueComment'

export async function bountyClosedNotPaidComment(task: any, userAssigned: any) {
  const { provider, url, id: taskId, value: amount } = task.dataValues
  const { provider_username: githubUser } = userAssigned
  if (!isGitHubCommentingEnabled(provider)) return

  const { issueNumber } = getGitHubIssueContext(url)

  return postGitHubIssueComment({
    issueUrl: url,
    commentBody: buildClosedBountyReminderBody({
      taskId,
      githubIssueNumber: issueNumber,
      amount,
      githubUsername: githubUser
    }),
    logContext: 'closed-unpaid-bounty'
  })
}
