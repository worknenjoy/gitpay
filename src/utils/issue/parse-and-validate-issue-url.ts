import url from 'url'

export type ParsedIssueUrl = {
  userOrCompany: string
  projectName: string
  issueId: string
  projectPath: string
}

const OWNER_REPO_PATTERN = /^[A-Za-z0-9][A-Za-z0-9-_.]*$/

const assertSafeSegment = (value: string, kind: 'owner' | 'project') => {
  if (!value || value === '..') {
    throw new Error('Repository URL contains invalid path segments')
  }
  if (!OWNER_REPO_PATTERN.test(value)) {
    throw new Error(
      kind === 'owner'
        ? 'Repository URL contains an invalid owner/organization name'
        : 'Repository URL contains an invalid project name'
    )
  }
}

export function parseGitlabIssuePath(rawUrl: string): ParsedIssueUrl {
  if (!rawUrl || typeof rawUrl !== 'string') {
    throw new Error('Invalid repository URL')
  }

  const parsed = url.parse(rawUrl)
  const hostname = (parsed.hostname || '').toLowerCase()
  const isGitlabHost = hostname === 'gitlab.com' || hostname === 'www.gitlab.com'
  if (!isGitlabHost) {
    throw new Error('URL host is not allowed for GitLab provider')
  }

  const path = parsed.pathname || parsed.path || ''
  const segments = path.split('/').filter(Boolean)

  let markerIndex = -1
  for (let i = 0; i < segments.length - 1; i++) {
    const isIssueMarker = segments[i] === 'issues' || segments[i] === 'work_items'
    if (isIssueMarker && /^[0-9]+$/.test(segments[i + 1])) {
      markerIndex = i
      break
    }
  }

  if (markerIndex < 1) {
    throw new Error('Repository URL does not match expected issue pattern')
  }

  let projectSegments = segments.slice(0, markerIndex)
  if (projectSegments[projectSegments.length - 1] === '-') {
    projectSegments = projectSegments.slice(0, -1)
  }

  if (projectSegments.length < 2) {
    throw new Error('Repository URL is missing required components')
  }

  const issueId = segments[markerIndex + 1]
  const userOrCompany = projectSegments[0]
  const projectName = projectSegments[projectSegments.length - 1]
  const projectPath = projectSegments.join('/')

  if (!userOrCompany || !projectName || !issueId) {
    throw new Error('Repository URL is missing required components')
  }
  if (!/^[0-9]+$/.test(issueId)) {
    throw new Error('Issue id in URL is not a valid number')
  }

  for (let i = 0; i < projectSegments.length; i++) {
    assertSafeSegment(projectSegments[i], i === projectSegments.length - 1 ? 'project' : 'owner')
  }

  return { userOrCompany, projectName, issueId, projectPath }
}

export function parseAndValidateIssueUrl(rawUrl: string, provider: string): ParsedIssueUrl {
  if (provider === 'gitlab') {
    return parseGitlabIssuePath(rawUrl)
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
  assertSafeSegment(userOrCompany, 'owner')
  assertSafeSegment(projectName, 'project')

  return {
    userOrCompany,
    projectName,
    issueId,
    projectPath: `${userOrCompany}/${projectName}`
  }
}
