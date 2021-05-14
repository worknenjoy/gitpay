const Promise = require('bluebird')
const models = require('../../models')
const requestPromise = require('request-promise')

module.exports = Promise.method(async function fetchTaskSolutionData (solutionParams) {
  return requestPromise({
    uri: `https://api.github.com/repos/${solutionParams.owner}/${solutionParams.repositoryName}/pulls/${solutionParams.pullRequestId}`,
    headers: {
      'User-Agent':
        'octonode/0.3 (https://github.com/pksunkara/octonode) terminal/0.0'
    }
  }).then(async response => {
    let isConnectedToGitHub = false
    let isAuthorOfPR = false
    let isPRMerged = false
    let isIssueClosed = false
    const pullRequestData = JSON.parse(response)

    const user = await models.User.findOne({
      where: { id: solutionParams.userId }
    })

    const task = await models.Task.findOne({
      where: { id: solutionParams.taskId }
    })

    const taskAssignment = await models.Assign.findOne({
      where: { id: solutionParams.userId, TaskId: task.dataValues.id }
    })

    // Verify if the current user is the owner of PR (currently used to verify if user is authenticated to GitHub too)
    if (user.dataValues.provider === 'github' && user.dataValues.provider_username === pullRequestData.user.login) {
      isAuthorOfPR = true
      isConnectedToGitHub = true
    }

    // Verify if PR is closed/merged
    if (pullRequestData.state === 'closed' && pullRequestData.merged) {
      isPRMerged = true
    }

    if (pullRequestData.title.includes('#')) {
      const linkedPullRequestToIssueId = parseInt(pullRequestData.title.split('#')[1])
      const githubIssueId = parseInt(task.url.split('/')[6])

      // Verify if Issue is closed (first verify if the user accepted the assignment to the task)
      if (task.dataValues.assigned && taskAssignment.dataValues.status === 'accepted') {
        if (task.dataValues.provider === 'github' && task.dataValues.status === 'closed' && githubIssueId === linkedPullRequestToIssueId) {
          isIssueClosed = true
        }
      }
    }

    return {
      isConnectedToGitHub: isConnectedToGitHub,
      isAuthorOfPR: isAuthorOfPR,
      isPRMerged: isPRMerged,
      isIssueClosed: isIssueClosed
    }
  })
})
