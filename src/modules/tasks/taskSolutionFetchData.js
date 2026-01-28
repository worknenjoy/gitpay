const Promise = require('bluebird')
const models = require('../../models')
const requestPromise = require('request-promise')

function extractIssueReferences(text) {
  if (!text) return []
  const issueReferenceRegex = /#(\d+)/g
  const matches = text.match(issueReferenceRegex)
  return matches ? matches.map((match) => match.slice(1)) : [] // Remove the '#' prefix
}

function extractIssueReferenceByURL(content, url) {
  if (!content || !url) return false
  const regex = new RegExp(`\\b${url}\\b`, 'g')
  return regex.test(content)
}

function extractIssueNumberFromURL(url) {
  const match = url.match(/\/issues\/(\d+)(\/)?$/)
  return match ? match[1] : null
}

module.exports = Promise.method(async function fetchTaskSolutionData(solutionParams) {
  return requestPromise({
    uri: `https://api.github.com/repos/${solutionParams.owner}/${solutionParams.repositoryName}/pulls/${solutionParams.pullRequestId}`,
    headers: {
      'User-Agent': 'octonode/0.3 (https://github.com/pksunkara/octonode) terminal/0.0'
    }
  })
    .then(async (response) => {
      let isConnectedToGitHub = false
      let isAuthorOfPR = false
      let isPRMerged = false
      let isIssueClosed = false
      let hasIssueReference = false
      const pullRequestData = JSON.parse(response)

      const user = await models.User.findOne({
        where: { id: solutionParams.userId }
      })

      const task = await models.Task.findOne({
        where: { id: solutionParams.taskId }
      })

      const taskAssignment = await models.Assign.findOne({
        where: { userId: solutionParams.userId, TaskId: task.dataValues.id }
      })

      const taskUrl = task.url
      const taskRepo = taskUrl.split('/')[4]
      const taskOwner = taskUrl.split('/')[3]
      const pullRequestUrl = pullRequestData.html_url
      const pullRequestRepo = pullRequestUrl.split('/')[4]
      const pullRequestOwner = pullRequestUrl.split('/')[3]
      const isTheSameRepo = taskRepo === pullRequestRepo && taskOwner === pullRequestOwner

      // Verify if the current user is the owner of PR (currently used to verify if user is authenticated to GitHub too)
      if (user.dataValues.provider === 'github') {
        isConnectedToGitHub = true
      }

      if (user.dataValues.provider_username === pullRequestData.user.login) {
        isAuthorOfPR = true
      }

      // Verify if PR is closed/merged
      if (isTheSameRepo && pullRequestData.state === 'closed' && pullRequestData.merged) {
        isPRMerged = true
      }

      if (pullRequestData.title.includes('#')) {
        const linkedPullRequestToIssueId = parseInt(pullRequestData.title.split('#')[1])
        const githubIssueId = parseInt(task.url.split('/')[6])

        // Verify if Issue is closed (first verify if the user accepted the assignment to the task)
        if (task.dataValues.assigned && taskAssignment.dataValues.status === 'accepted') {
          if (
            task.dataValues.provider === 'github' &&
            task.dataValues.status === 'closed' &&
            githubIssueId === linkedPullRequestToIssueId
          ) {
            isIssueClosed = true
          }
        }
      }
      const issueReferences = extractIssueReferences(pullRequestData.body)
      const issueNumber = extractIssueNumberFromURL(task.dataValues.url)
      const issueReferencesMatch = issueReferences.some(
        (issueReference) => issueNumber === issueReference
      )

      const issueReferencesByURL = extractIssueReferenceByURL(pullRequestData.body, task.url)
      if (issueReferencesByURL) {
        hasIssueReference = true
      }

      if (issueReferences.length && issueReferencesMatch) {
        hasIssueReference = true
      }

      // Verify if Issue is closed (trusting in the gitpay/github synchronization)
      if (task.dataValues.status === 'closed') {
        isIssueClosed = true
      }

      return {
        isConnectedToGitHub: isConnectedToGitHub,
        isAuthorOfPR: isAuthorOfPR,
        isPRMerged: isPRMerged,
        isIssueClosed: isIssueClosed,
        hasIssueReference: hasIssueReference
      }
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log('error to fetch pull request data', err)

      if (err.statusCode === 404) {
        throw new Error('PULL_REQUEST_NOT_FOUND')
      }

      throw new Error('COULD_NOT_FETCH_PULL_REQUEST_DATA')
    })
})
