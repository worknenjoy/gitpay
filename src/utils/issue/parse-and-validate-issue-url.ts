import url from 'url'

export function parseAndValidateIssueUrl(
  rawUrl: string,
  provider: string
): { userOrCompany: string; projectName: string; issueId: string } {
  if (!rawUrl || typeof rawUrl !== 'string') {
    throw new Error('Invalid repository URL')
  }

  const parsed = url.parse(rawUrl)
  const hostname = (parsed.hostname || '').toLowerCase()
  const path = parsed.pathname || parsed.path || ''

  // Only allow expected hosts for supported providers
  const isGithubHost = hostname === 'github.com' || hostname === 'www.github.com'
  const isBitbucketHost = hostname === 'bitbucket.org' || hostname === 'www.bitbucket.org'

  if (provider === 'github' && !isGithubHost) {
    throw new Error('URL host is not allowed for GitHub provider')
  }
  if (provider === 'bitbucket' && !isBitbucketHost) {
    throw new Error('URL host is not allowed for Bitbucket provider')
  }

  // Basic path validation: /owner/repo/issues/number
  const segments = path.split('/').filter(Boolean) // removes empty segments
  if (segments.length < 4 || segments[2] !== 'issues') {
    throw new Error('Repository URL does not match expected issue pattern')
  }

  const userOrCompany = segments[0]
  const projectName = segments[1]
  const issueId = segments[3]

  // Disallow path traversal-like segments and ensure basic integrity
  if (!userOrCompany || !projectName || !issueId) {
    throw new Error('Repository URL is missing required components')
  }
  if (userOrCompany === '..' || projectName === '..' || issueId === '..') {
    throw new Error('Repository URL contains invalid path segments')
  }
  if (!/^[0-9]+$/.test(issueId)) {
    throw new Error('Issue id in URL is not a valid number')
  }

  // Additional safety: restrict owner and repository name to expected patterns
  // GitHub owners and repo names are typically alphanumeric with dashes/underscores and dots.
  const ownerRepoPattern = /^[A-Za-z0-9][A-Za-z0-9-_.]*$/
  if (!ownerRepoPattern.test(userOrCompany)) {
    throw new Error('Repository URL contains an invalid owner/organization name')
  }
  if (!ownerRepoPattern.test(projectName)) {
    throw new Error('Repository URL contains an invalid project name')
  }

  return { userOrCompany, projectName, issueId }
}
