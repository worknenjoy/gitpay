import url from 'url'

export type ParsedIssueUrl = {
  userOrCompany: string
  projectName: string
  issueId: string
  projectPath: string
}

export function parseKdeBugUrl(rawUrl: string): ParsedIssueUrl {
  if (!rawUrl || typeof rawUrl !== 'string') {
    throw new Error('Invalid repository URL')
  }

  const parsed = url.parse(rawUrl, true)
  const hostname = (parsed.hostname || '').toLowerCase()
  const isKdeHost = hostname === 'bugs.kde.org' || hostname === 'www.bugs.kde.org'
  if (!isKdeHost) {
    throw new Error('URL host is not allowed for KDE Bugzilla provider')
  }

  let issueId = ''
  const queryId = parsed.query && (parsed.query as { id?: string | string[] }).id
  if (Array.isArray(queryId)) {
    issueId = String(queryId[0] || '')
  } else if (queryId) {
    issueId = String(queryId)
  }

  if (!issueId) {
    const segments = (parsed.pathname || '').split('/').filter(Boolean)
    const last = segments[segments.length - 1]
    if (last && /^[0-9]+$/.test(last)) {
      issueId = last
    }
  }

  if (!issueId) {
    throw new Error('Repository URL does not match expected issue pattern')
  }
  if (!/^[0-9]+$/.test(issueId)) {
    throw new Error('Issue id in URL is not a valid number')
  }

  return {
    userOrCompany: 'kde',
    projectName: 'bugs',
    issueId,
    projectPath: 'kde/bugs'
  }
}

export function parseAndValidateIssueUrl(rawUrl: string, provider: string): ParsedIssueUrl {
  if (provider === 'kde') {
    return parseKdeBugUrl(rawUrl)
  }

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

  return {
    userOrCompany,
    projectName,
    issueId,
    projectPath: `${userOrCompany}/${projectName}`
  }
}
