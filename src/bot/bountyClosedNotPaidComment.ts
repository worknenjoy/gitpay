import requestPromise from 'request-promise'

export async function bountyClosedNotPaidComment(task: any, userAssigned: any) {
  const { provider, url, id: issueId, value: amount } = task.dataValues
  const { provider_username: githubUser } = userAssigned
  if (provider !== 'github' || process.env.NODE_ENV !== 'production') return
  const [, , , owner, repo, , issueNumber] = url.split('/')

  const githubApiEndpoint = 'https://api.github.com'

  const commentIssueEndpoint = `${githubApiEndpoint}/repos/${owner}/${repo}/issues/${issueNumber}/comments`

  const gitPayURL = `${process.env.FRONTEND_HOST}/#/task/${issueId}`

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
        body: `hello ${githubUser || ''},

Here's is Gitpaybot with good news! You have a bounty to claim :-)

There's a bounty of $ ${amount} for a task you solved on Gitpay.

If you have a Pull Request merged, please claim on Gitpay (https://gitpay.me) on the issue:
${gitPayURL}

Please set the title of your pull request to *issue#${issueId}* and go in _Solve issue_ and send your Pull Request URL.
If you already received your bounty, please ignore this message.`
      }
    })
    console.log('bounty closed comment posted to GitHub issue', req)
    return req
  } catch (e) {
    console.log('error posting bounty closed comment to GitHub', e)
  }
}
