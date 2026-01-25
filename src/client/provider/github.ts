import secrets from '../../config/secrets'
import requestPromise from 'request-promise'

type GithubConnectProps = {
  uri: string
}

export const GithubConnect = async ({ uri }: GithubConnectProps) => {
  const githubClientId = secrets.github.id
  const githubClientSecret = secrets.github.secret

  const response = await requestPromise({
    uri,
    headers: {
      'User-Agent': 'octonode/0.3 (https://github.com/pksunkara/octonode) terminal/0.0'
    },
    qs: {
      client_id: githubClientId,
      client_secret: githubClientSecret
    },
    json: true
  })

  return response
}
