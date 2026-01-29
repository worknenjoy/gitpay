import requestPromise from 'request-promise'

export async function bountyClosedNotPaidComment(task: any, userAssigned: any) {
  const { provider, url, id: issueId, value: amount } = task.dataValues
  const { provider_username: githubUser } = userAssigned
  if (provider !== 'github' || process.env.NODE_ENV !== 'production') return
  const [, , , owner, repo, , issueNumber] = url.split('/')

  const githubApiEndpoint = 'https://api.github.com'

  const commentIssueEndpoint = `${githubApiEndpoint}/repos/${owner}/${repo}/issues/${issueNumber}/comments`

  const gitPayURL = `${process.env.FRONTEND_HOST}/#/task/${issueId}`

  const req = await requestPromise({
    method: 'POST',
    uri: `${commentIssueEndpoint}`,
    headers: {
      'User-Agent': 'Gitpay',
      'Content-Type': 'application/json',
      Authorization: 'token ' + process.env.GITHUB_BOT_ACCESS_TOKEN
    },
    json: true,
    body: {
      body: `hello ${githubUser || ''},

Here's is Gitpaybot with good news! You have a bounty to claim :-)

There's a bounty of $ ${amount} for a task you solved on Gitpay.

If you have a Pull Request merged, please claim on Gitpay (https://gitpay.me) on the issue:
${gitPayURL}

Please set the title of your pull request to *issue#${issueId}* and go in _Solve issue_ and send your Pull Request URL.
If you already received your bounty, please ignore this message.`
    }
  })

  return req
}
