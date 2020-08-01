const Promise = require('bluebird')
const models = require('../../models')
const secrets = require('../../config/secrets')
const url = require('url')
const requestPromise = require('request-promise')
const constants = require('../mail/constants')
// const TaskMail = require('../mail/task')
const Sendmail = require('../mail/mail')
const roleExists = require('../roles').roleExists
const userExists = require('../users').userExists

module.exports = Promise.method(function taskBuilds (taskParameters) {
  const repoUrl = taskParameters.url
  const githubClientId = taskParameters.clientId || secrets.github.id
  const githubClientSecret = taskParameters.secret || secrets.github.secret
  const splitIssueUrl = url.parse(repoUrl).path.split('/')
  const userOrCompany = splitIssueUrl[1]
  const projectName = splitIssueUrl[2]
  const issueId = splitIssueUrl[4]
  const userId = taskParameters.userId
  const token = taskParameters.token

  if (!userId) return false

  switch (taskParameters.provider) {
    case 'github':
      const uri = taskParameters.token ? `https://api.github.com/repos/${userOrCompany}/${projectName}/issues/${issueId}` : `https://api.github.com/repos/${userOrCompany}/${projectName}/issues/${issueId}?client_id=${githubClientId}&client_secret=${githubClientSecret}`
      const headers = {
        'User-Agent': 'octonode/0.3 (https://github.com/pksunkara/octonode) terminal/0.0'
      }
      if (taskParameters.token) headers.Authorization = `token ${token}`
      return requestPromise({
        uri,
        headers
      }).then(response => {
        if (!response && !response.title) return false
        const issueDataJsonGithub = JSON.parse(response)
        if (!taskParameters.title) taskParameters.title = issueDataJsonGithub.title
        return models.Task
          .build(
            taskParameters
          )
          .save()
          .then(async task => {
            const role = await roleExists({ name: 'company_owner' })
            if (role.dataValues && role.dataValues.id) {
              const userInfo = await requestPromise({
                uri: `https://api.github.com/users/${userOrCompany}?client_id=${githubClientId}&client_secret=${githubClientSecret}`,
                headers: {
                  'User-Agent': 'octonode/0.3 (https://github.com/pksunkara/octonode) terminal/0.0'
                }
              })
              const userInfoJSON = JSON.parse(userInfo)
              const userExist = userExists && await userExists({ email: userInfoJSON.email })
              if (userExist && userExist.dataValues && userExist.dataValues.id) {
                await task.createMember({ userId: userExist.dataValues.id, roleId: role.dataValues.id })
              }
              else {
                // send an email
              }
            }

            const taskData = task.dataValues
            const userData = await task.getUser()
            /*
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
            */
            Sendmail.success({ email: constants.fromEmail }, `A task ${taskData.url} was created`, `A task ${taskData.id} from ${userData.email} was created just now`)
            return taskData
          })
      })
    case 'bitbucket':
      return requestPromise({
        uri: `https://api.bitbucket.org/2.0/repositories/${userOrCompany}/${projectName}/issues/${issueId}`
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
