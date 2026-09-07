import requestPromise from 'request-promise'

type CodebergConnectProps = {
  uri: string
}

export const codebergIssueUri = (owner: string, repo: string, issueId: string) =>
  `https://codeberg.org/api/v1/repos/${owner}/${repo}/issues/${issueId}`

export const codebergRepoUri = (owner: string, repo: string) =>
  `https://codeberg.org/api/v1/repos/${owner}/${repo}`

export const codebergLanguagesUri = (owner: string, repo: string) =>
  `https://codeberg.org/api/v1/repos/${owner}/${repo}/languages`

export const CodebergConnect = async ({ uri }: CodebergConnectProps) => {
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
