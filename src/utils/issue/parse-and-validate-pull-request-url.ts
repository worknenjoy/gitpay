import url from 'url'

export function parseAndValidatePullRequestUrl(rawUrl: string): {
  userOrCompany: string
  projectName: string
  pullRequestId: string
} {
  if (!rawUrl || typeof rawUrl !== 'string') {
    throw new Error('Invalid repository URL')
  }

  const parsed = url.parse(rawUrl)
  const hostname = (parsed.hostname || '').toLowerCase()
  const path = parsed.pathname || parsed.path || ''

  const isGithubHost = hostname === 'github.com' || hostname === 'www.github.com'
  if (!isGithubHost) {
    throw new Error('URL host is not allowed for GitHub provider')
  }

  // Basic path validation: /owner/repo/pull/number
  const segments = path.split('/').filter(Boolean)
  if (segments.length < 4 || segments[2] !== 'pull') {
    throw new Error('Repository URL does not match expected pull request pattern')
  }

  const userOrCompany = segments[0]
  const projectName = segments[1]
  const pullRequestId = segments[3]

  if (!userOrCompany || !projectName || !pullRequestId) {
    throw new Error('Repository URL is missing required components')
  }
  if (userOrCompany === '..' || projectName === '..' || pullRequestId === '..') {
    throw new Error('Repository URL contains invalid path segments')
  }
  if (!/^[0-9]+$/.test(pullRequestId)) {
    throw new Error('Pull request id in URL is not a valid number')
  }

  const ownerRepoPattern = /^[A-Za-z0-9][A-Za-z0-9-_.]*$/
  if (!ownerRepoPattern.test(userOrCompany)) {
    throw new Error('Repository URL contains an invalid owner/organization name')
  }
  if (!ownerRepoPattern.test(projectName)) {
    throw new Error('Repository URL contains an invalid project name')
  }

  return { userOrCompany, projectName, pullRequestId }
}
