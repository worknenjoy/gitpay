import { GithubConnect } from '../../client/provider/github'
import { parseAndValidatePullRequestUrl } from '../../utils/issue/parse-and-validate-pull-request-url'

// Overridable so the Playwright e2e suite can point this one real, server-side GitHub call
// at a local stub (playwright/github-stub-server.ts) instead of the real API — avoids
// depending on GitHub's unauthenticated rate limit (shared across CI's IP pool) for a test
// to pass. Defaults to the real API everywhere else.
function getGithubApiBaseUrl(): string {
  return (process.env.GITHUB_API_BASE_URL || 'https://api.github.com').replace(/\/$/, '')
}

export type PullRequestState = 'open' | 'closed' | 'merged'

export type FetchedPullRequest = {
  repo: string
  number: number
  title: string
  url: string
  state: PullRequestState
  authorLogin: string
}

function toPullRequestState(data: any): PullRequestState {
  if (data.state === 'closed' && data.merged) return 'merged'
  if (data.state === 'closed') return 'closed'
  return 'open'
}

export async function fetchPullRequestFromUrl(rawUrl: string): Promise<FetchedPullRequest> {
  const { userOrCompany, projectName, pullRequestId } = parseAndValidatePullRequestUrl(rawUrl)

  let data: any
  try {
    data = await GithubConnect({
      uri: `${getGithubApiBaseUrl()}/repos/${userOrCompany}/${projectName}/pulls/${pullRequestId}`
    })
  } catch (err: any) {
    if (err.statusCode === 404) {
      throw new Error('PULL_REQUEST_NOT_FOUND')
    }
    throw new Error('COULD_NOT_FETCH_PULL_REQUEST_DATA')
  }

  return {
    repo: `${userOrCompany}/${projectName}`,
    number: Number(pullRequestId),
    title: data.title,
    url: data.html_url,
    state: toPullRequestState(data),
    authorLogin: data.user?.login
  }
}

export default fetchPullRequestFromUrl
