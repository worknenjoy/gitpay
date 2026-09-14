import requestPromise from 'request-promise'

type GitlabConnectProps = {
  uri: string
}

export const gitlabProjectPathParam = (projectPath: string) => encodeURIComponent(projectPath)

export const gitlabIssueUri = (projectPath: string, issueId: string) =>
  `https://gitlab.com/api/v4/projects/${gitlabProjectPathParam(projectPath)}/issues/${issueId}`

export const gitlabProjectUri = (projectPath: string) =>
  `https://gitlab.com/api/v4/projects/${gitlabProjectPathParam(projectPath)}`

export const gitlabLanguagesUri = (projectPath: string) =>
  `https://gitlab.com/api/v4/projects/${gitlabProjectPathParam(projectPath)}/languages`

export const gitlabStateToGitpay = (state?: string | null): string => {
  if (state === 'opened' || state === 'reopened') return 'open'
  if (state === 'closed') return 'closed'
  return state || 'open'
}

export const GitlabConnect = async ({ uri }: GitlabConnectProps) => {
  const response = await requestPromise({
    uri,
    headers: {
      'User-Agent': 'gitpay',
      Accept: 'application/json'
    },
    json: true
  })

  return response
}
