const requestPromise = require('request-promise')
const Promise = require('bluebird')

module.exports = Promise.method(async function issueAddedComment (task) {
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
        'Content-Type': 'application/json',
        'Authorization': 'token ' + process.env.GITHUB_BOT_ACCESS_TOKEN,
        //'X-GitHub-Api-Version': '2022-11-28'
      },
      json: true,
      body: {
        body: `This issue was added to Gitpay, check the task [${gitPayURL}](${gitPayURL}) 💝
  
  [About Gitpay platform](https://gitpay.me).
  
  For portuguese, you can [access the portuguese version](https://github.com/worknenjoy/gitpay-github-app/blob/master/first-comment.pt-br.md)
  
  ### 📋 Step by Step
  
  #### If you are the task owner who created this issue
  - [x] 🔔 ***Issue open*** an issue was created
  - [x] 👌 **Issue added on Gitpay** this issue was added on gitpay [${gitPayURL}](${gitPayURL})
  - [ ] 📝 **Add bounties** A bounty is added to get things done
  - [ ] 📝 **Set a deadline** A deadline to finish the task (optional)
  - [ ] 💾 **Choose a contributor interested** You can choose someone interested that will be able to solve your issue
  
  #### If you want to contribute and be rewarded
  - [ ] 💾 **A contributor is interested** You can show interest on the task page clicking in "I'm interested"
  - [ ] 💾 **You can offer** You can make an offer
  - [ ] 🔀 **You can be assigned**. You can be assigned, you should work on the task and send a Pull Request.
  - [ ] 💬 **Review** Ask in comments for a review :)
  - [ ] 🏁 **Approved** Once approved you will receive your payment
  
  ### 📋 Task status
  - [x] ***OPEN***
  - [ ] ***IN PROGRESS***
  - [ ] ***DONE***
  
  ### Good to know
  
  1. If you are familiar with the terminal or would like to learn it, [here is a great tutorial](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github) on how to send a pull request using the terminal.
  
  2. For a more compreenhensive guide to create the Pull Request properly, you can access: https://guides.github.com/activities/hello-world/
  
  3. You can [edit files directly in your browser](https://help.github.com/articles/editing-files-in-your-repository/)
  
  ### 🤔❓ Questions
  Leave a comment below!
  This issue was a comment made by our GitpayBot [Gitpay Bot](https://github.com/gitpaybot).`
      }
    })
    console.log('req response from github issue comment', req)
    return req
  } catch (e) {
    console.log('error on comment to Github', e)
  }
})
