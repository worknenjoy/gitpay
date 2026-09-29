import requestPromise from 'request-promise'
import { parseAndValidatePullRequestUrl } from '../utils/issue/parse-and-validate-pull-request-url'
import { isGitHubCommentingEnabled } from './postGitHubIssueComment'

const githubApiEndpoint = 'https://api.github.com'

type PostGitHubPullRequestCommentParams = {
  pullRequestUrl: string
  commentBody: string
  logContext: string
  /** The user's own GitHub OAuth access token (public_repo scope) — the comment is posted as them, not as the Gitpay bot. */
  githubAccessToken?: string | null
}

type GitHubIssueCommentResponse = {
  id: number
  html_url: string
  body: string
}

export function getGitHubPullRequestContext(pullRequestUrl: string) {
  const { userOrCompany, projectName, pullRequestId } =
    parseAndValidatePullRequestUrl(pullRequestUrl)

  return {
    owner: userOrCompany,
    repo: projectName,
    pullRequestNumber: pullRequestId
  }
}

export async function postGitHubPullRequestComment({
  pullRequestUrl,
  commentBody,
  logContext,
  githubAccessToken
}: PostGitHubPullRequestCommentParams) {
  if (!githubAccessToken) {
    console.log(`[GitHub] Skipping ${logContext} comment: no user GitHub access token`)
    return
  }

  const { owner, repo, pullRequestNumber } = getGitHubPullRequestContext(pullRequestUrl)
  // GitHub treats pull requests as issues for commenting purposes — same endpoint shape.
  const commentIssueEndpoint = `${githubApiEndpoint}/repos/${owner}/${repo}/issues/${pullRequestNumber}/comments`

  try {
    const response = (await requestPromise({
      method: 'POST',
      uri: commentIssueEndpoint,
      headers: {
        'User-Agent': 'gitpay',
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        Authorization: 'token ' + githubAccessToken,
        'X-GitHub-Api-Version': '2022-11-28'
      },
      json: true,
      body: {
        body: commentBody
      }
    })) as GitHubIssueCommentResponse

    console.log(`[GitHub] Posted ${logContext} comment`, {
      id: response.id,
      html_url: response.html_url
    })

    return response
  } catch (error) {
    console.log(`[GitHub] Error posting ${logContext} comment`, error)
    throw error
  }
}

export { isGitHubCommentingEnabled }
