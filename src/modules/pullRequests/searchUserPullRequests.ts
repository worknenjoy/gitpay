import { GithubConnect } from '../../client/provider/github'
import { PullRequestState } from './fetchPullRequestFromUrl'

export type PullRequestSearchRow = {
  repo: string
  number: number
  title: string
  when: string
  state: PullRequestState
}

export type SearchUserPullRequestsParams = {
  username: string
  /** Optional 'owner/repo' filter */
  repo?: string
  perPage?: number
}

function repoFromRepositoryUrl(repositoryUrl: string): string {
  const match = repositoryUrl?.match(/repos\/(.+)$/)
  return match ? match[1] : repositoryUrl
}

function toPullRequestState(item: any): PullRequestState {
  if (item.state === 'closed' && item.pull_request?.merged_at) return 'merged'
  if (item.state === 'closed') return 'closed'
  return 'open'
}

export async function searchUserPullRequests({
  username,
  repo,
  perPage = 50
}: SearchUserPullRequestsParams): Promise<PullRequestSearchRow[]> {
  const qParts = ['type:pr', `author:${username}`]
  if (repo) qParts.push(`repo:${repo}`)
  const q = encodeURIComponent(qParts.join(' '))

  let data: any
  try {
    data = await GithubConnect({
      uri: `https://api.github.com/search/issues?q=${q}&per_page=${perPage}&sort=created&order=desc`
    })
  } catch (err) {
    throw new Error('COULD_NOT_FETCH_PULL_REQUESTS')
  }

  const items = data?.items || []
  return items.map((item: any) => ({
    repo: repoFromRepositoryUrl(item.repository_url),
    number: item.number,
    title: item.title,
    when: item.created_at,
    state: toPullRequestState(item)
  }))
}

export default searchUserPullRequests
