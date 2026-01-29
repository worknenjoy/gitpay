import models from '../../models'
import requestPromise from 'request-promise'

const currentModels = models as any

function extractIssueReferences(text: string) {
  if (!text) return []
  const issueReferenceRegex = /#(\d+)/g
  const matches = text.match(issueReferenceRegex)
  return matches ? matches.map((match) => match.slice(1)) : [] // Remove the '#' prefix
}

function extractIssueReferenceByURL(content: string, url: string) {
  if (!content || !url) return false
  const regex = new RegExp(`\\b${url}\\b`, 'g')
  return regex.test(content)
}

function extractIssueNumberFromURL(url: string) {
  const match = url.match(/\/issues\/(\d+)(\/)?$/)
  return match ? match[1] : null
}

function validateGitHubParams(params: any) {
  const owner = params && params.owner
  const repositoryName = params && params.repositoryName
  const pullRequestId = params && params.pullRequestId

  // GitHub owner/repo names: letters, numbers, '.', '-', '_' only, at least 1 char
  const nameRegex = /^[A-Za-z0-9._-]+$/

  if (typeof owner !== 'string' || !nameRegex.test(owner)) {
    throw new Error('INVALID_GITHUB_OWNER')
  }

  if (typeof repositoryName !== 'string' || !nameRegex.test(repositoryName)) {
    throw new Error('INVALID_GITHUB_REPOSITORY_NAME')
  }

  // pullRequestId must be a positive integer
  const prNumber = typeof pullRequestId === 'string' ? Number(pullRequestId) : pullRequestId
  if (!Number.isInteger(prNumber) || prNumber <= 0) {
    throw new Error('INVALID_PULL_REQUEST_ID')
  }
}

export async function taskSolutionFetchData(solutionParams: any) {
  try {
    validateGitHubParams(solutionParams)

    const response = await requestPromise({
      uri: `https://api.github.com/repos/${solutionParams.owner}/${solutionParams.repositoryName}/pulls/${solutionParams.pullRequestId}`,
      headers: {
        'User-Agent': 'octonode/0.3 (https://github.com/pksunkara/octonode) terminal/0.0'
      }
    })

    let isConnectedToGitHub = false
    let isAuthorOfPR = false
    let isPRMerged = false
    let isIssueClosed = false
    let hasIssueReference = false
    const pullRequestData = JSON.parse(response)

    const user = await currentModels.User.findOne({
      where: { id: solutionParams.userId }
    })

    const task = await currentModels.Task.findOne({
      where: { id: solutionParams.taskId }
    })

    const taskAssignment = await currentModels.Assign.findOne({
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
      (issueReference: string) => issueNumber === issueReference
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
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.log('error to fetch pull request data', err)

    if (err.statusCode === 404) {
      throw new Error('PULL_REQUEST_NOT_FOUND')
    }

    throw new Error('COULD_NOT_FETCH_PULL_REQUEST_DATA')
  }
}
