const Promise = require('bluebird')
const models = require('../../models')
const secrets = require('../../config/secrets')
const url = require('url')
const requestPromise = require('request-promise')
const constants = require('../mail/constants')
const TaskMail = require('../mail/task')
const roleExists = require('../roles').roleExists
const userExists = require('../users').userExists
// const memberExists = require('../members').memberExists

module.exports = Promise.method(function taskBuilds (taskParameters) {
  const repoUrl = taskParameters.url
  const githubClientId = secrets.github.id
  const githubClientSecret = secrets.github.secret
  const splitIssueUrl = url.parse(repoUrl).path.split('/')
  const userOrCompany = splitIssueUrl[1]
  const projectName = splitIssueUrl[2]
  const issueId = splitIssueUrl[4]
  const userId = taskParameters.userId

  if (!userId) return false

  switch (taskParameters.provider) {
    case 'github':
      return requestPromise({
        uri: `https://api.github.com/repos/${userOrCompany}/${projectName}/issues/${issueId}?client_id=${githubClientId}&client_secret=${githubClientSecret}`,
        headers: {
          'User-Agent': 'octonode/0.3 (https://github.com/pksunkara/octonode) terminal/0.0'
        }
      }).then(response => {
        const issueDataJsonGithub = JSON.parse(response)
        if (!taskParameters.title) taskParameters.title = issueDataJsonGithub.title
        return models.Task
          .build(
            taskParameters
          )
          .save()
          .then(async task => {
            const role = await roleExists({ name: 'admin' })
            if (role.dataValues && role.dataValues.id) {
              const userInfo = await requestPromise({
                uri: `https://api.github.com/users/${userOrCompany}?client_id=${githubClientId}&client_secret=${githubClientSecret}`,
                headers: {
                  'User-Agent': 'octonode/0.3 (https://github.com/pksunkara/octonode) terminal/0.0'
                }
              })
              const userInfoJSON = JSON.parse(userInfo)
              const userExist = await userExists({ email: userInfoJSON.email })
              if (userExist.dataValues && userExist.dataValues.id) {
                const taskWithMember = await task.createMember({ userId: userExist.dataValues.id, roleId: role.dataValues.id })
                // eslint-disable-next-line no-console
                console.log('taskWithMember', taskWithMember)
              }
            }
            const taskData = task.dataValues
            const userData = await task.getUser()
            TaskMail.send(userData, {
              task: {
                title: taskData.title,
                issue_url: taskData.url,
                url: constants.taskUrl(taskData.id)
              }
            })
            TaskMail.notify(userData, {
              task: {
                title: taskData.title,
                issue_url: taskData.url,
                url: constants.taskUrl(taskData.id)
              }
            })
            return taskData
          })
      })
    case 'bitbucket':
      return requestPromise({
        uri: `https://api.bitbucket.org/1.0/repositories/${userOrCompany}/${projectName}/issues/${issueId}`
      }).then(response => {
        return models.Task
          .build(
            taskParameters
          )
          .save()
          .then(data => {
            return data.dataValues
          })
      })

    default:
      return models.Task
        .build(
          taskParameters,
          {
            include: [models.User, models.Member]
          }
        )
        .save()
        .then(data => {
          return data.dataValues
        })
  }
})
