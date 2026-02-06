import secrets from '../../config/secrets'
import requestPromise from 'request-promise'

type GithubConnectProps = {
  uri: string
  token?: string
}

export const GithubConnect = async ({ uri, token }: GithubConnectProps) => {
  const githubClientId = secrets.github.id
  const githubClientSecret = secrets.github.secret

  const headers: any = {
    'User-Agent': 'octonode/0.3 (https://github.com/pksunkara/octonode) terminal/0.0'
  }

  // Use token authentication if provided, otherwise use client_id/client_secret
  if (token) {
    headers.Authorization = `token ${token}`
  }

  const response = await requestPromise({
    uri,
    headers,
    qs: token
      ? {}
      : {
          client_id: githubClientId,
          client_secret: githubClientSecret
        },
    json: true
  })

  return response
}
