const requestPromise = require('request-promise')
const Promise = require('bluebird')

module.exports = Promise.method(async function comment (offer, task) {
  const { provider, url, id } = task.dataValues
  if (provider !== 'github' || process.env.NODE_ENV !== 'production') return
  const { currency, amount } = offer
  const [, , , owner, repo, , issueNumber] = url.split('/')

  const githubApiEndpoint = 'https://api.github.com'

  const commentIssueEndpoint = `${githubApiEndpoint}/repos/${owner}/${repo}/issues/${issueNumber}/comments`

  const gitPayURL = `${process.env.FRONTEND_HOST}/#/task/${id}`

  const req = await requestPromise({
    method: 'POST',
    uri: `${commentIssueEndpoint}`,
    headers: {
      'User-Agent': 'Gitpay',
      'Content-Type': 'application/json',
      'Authorization': 'token ' + process.env.GITHUB_BOT_ACCESS_TOKEN
    },
    json: true,
    body: {
      body: `A bounty of *${amount} ${currency}* was added to this issue. See task on [GitPay](${gitPayURL})`
    }
  })

  return req
})
