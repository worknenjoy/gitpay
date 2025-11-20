const requestPromise = require('request-promise')
const Promise = require('bluebird')

module.exports = Promise.method(async function issueAddedComment(task) {
  const { provider, url, id } = task.dataValues
  if (provider !== 'github' || process.env.NODE_ENV !== 'production') return
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
        'X-GitHub-Api-Version': '2022-11-28',
      },
      json: true,
      body: {
        body: `This issue was added to Gitpay, check the issue on [${gitPayURL}](${gitPayURL}) 💝
  
  [About Gitpay platform](https://gitpay.me).
  
  
  ### 🤔❓ Questions
  Leave a comment below!

  This issue was a comment made by our GitpayBot [Gitpay Bot](https://github.com/gitpaybot).`,
      },
    })
    console.log('req response from github issue comment', req)
    return req
  } catch (e) {
    console.log('error on comment to Github', e)
  }
})
