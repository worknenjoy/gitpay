import {
  buildIssueAddedCommentBody,
  isGitHubCommentingEnabled,
  postGitHubIssueComment
} from './postGitHubIssueComment'

export async function issueAddedComment(task: any) {
  const { provider, url, id } = task.dataValues
  if (!isGitHubCommentingEnabled(provider)) return

  return postGitHubIssueComment({
    issueUrl: url,
    commentBody: buildIssueAddedCommentBody(id),
    logContext: 'issue-linked'
  })
}
