const Promise = require('bluebird')
const models = require('../../loading/loading')
const secrets = require('../../config/secrets')
const url = require('url')
const requestPromise = require('request-promise')

module.exports = Promise.method(function taskBuilds (taskParameters) {
  const githubUrl = taskParameters.url
  const githubClientId = secrets.github.id
  const githubClientSecret = secrets.github.secret
  const splitIssueUrl = url.parse(githubUrl).path.split('/')
  const userOrCompany = splitIssueUrl[1]
  const projectName = splitIssueUrl[2]
  const issueId = splitIssueUrl[4]

  if (taskParameters.provider === 'github') {
    return requestPromise({
      uri: `https://api.github.com/repos/${userOrCompany}/${projectName}/issues/${issueId}?client_id=${githubClientId}&client_secret=${githubClientSecret}`,
      headers: {
        'User-Agent': 'octonode/0.3 (https://github.com/pksunkara/octonode) terminal/0.0'
      }
    }).then(response => {
      if (!taskParameters.title) taskParameters.title = response.title
      return models.Task
        .build(
          taskParameters
        )
        .save()
        .then(data => {
          return data.dataValues
        })
    })
  }
  return models.Task
    .build(
      taskParameters
    )
    .save()
    .then(data => {
      return data.dataValues
    })
})
