import {
  buildBountyAddedCommentBody,
  isGitHubCommentingEnabled,
  postGitHubIssueComment
} from './postGitHubIssueComment'

export async function comment(offer: any, task: any) {
  const { provider, url, id } = task.dataValues
  if (!isGitHubCommentingEnabled(provider)) return
  const { currency, amount } = offer

  return postGitHubIssueComment({
    issueUrl: url,
    commentBody: buildBountyAddedCommentBody({
      taskId: id,
      amount,
      currency
    }),
    logContext: 'bounty'
  })
}
