import requestPromise from 'request-promise'

export async function comment(offer: any, task: any) {
  const { provider, url, id } = task.dataValues
  if (provider !== 'github' || process.env.NODE_ENV !== 'production') return
  const { currency, amount } = offer
  const [, , , owner, repo, , issueNumber] = url.split('/')

  const githubApiEndpoint = 'https://api.github.com'

  const commentIssueEndpoint = `${githubApiEndpoint}/repos/${owner}/${repo}/issues/${issueNumber}/comments`

  const gitPayURL = `${process.env.FRONTEND_HOST}/#/task/${id}`

  try {
    const req = await requestPromise({
      method: 'POST',
      uri: `${commentIssueEndpoint}`,
      headers: {
        'User-Agent': 'gitpaybot',
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        Authorization: 'token ' + process.env.GITHUB_BOT_ACCESS_TOKEN,
        'X-GitHub-Api-Version': '2022-11-28'
      },
      json: true,
      body: {
        body: `A bounty of *${amount} ${currency}* was added to this issue. See task on [GitPay](${gitPayURL})`
      }
    })
    console.log('bounty comment posted to GitHub issue', req)
    return req
  } catch (e) {
    console.log('error posting bounty comment to GitHub', e)
  }
}
