const Promise = require('bluebird')
const models = require('../../models')
const secrets = require('../../config/secrets')
const url = require('url')
const requestPromise = require('request-promise')
const constants = require('../mail/constants')
const TaskMail = require('../mail/task')
const roleExists = require('../roles').roleExists
const userExists = require('../users').userExists
// const userOrganizations = require('../users/userOrganizations')
const project = require('../projectHelpers')
const issueAddedComment = require('../bot/issueAddedComment')
const { notifyNewIssue } = require('../slack')

module.exports = Promise.method(async function taskBuilds(taskParameters) {
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

  let uri, headers
  switch (taskParameters.provider) {
    case 'github':
      uri = taskParameters.token
        ? `https://api.github.com/repos/${userOrCompany}/${projectName}/issues/${issueId}`
        : `https://api.github.com/repos/${userOrCompany}/${projectName}/issues/${issueId}?client_id=${githubClientId}&client_secret=${githubClientSecret}`
      headers = {
        'User-Agent': 'octonode/0.3 (https://github.com/pksunkara/octonode) terminal/0.0'
      }
      if (taskParameters.token) headers.Authorization = `token ${token}`
      return requestPromise({
        uri,
        headers
      }).then(async (response) => {
        if (!response && !response.title) return false
        const issueDataJsonGithub = JSON.parse(response)
        if (!taskParameters.title) taskParameters.title = issueDataJsonGithub.title
        if (!taskParameters.description) taskParameters.description = issueDataJsonGithub.body

        const programmingLanguagesUri = `https://api.github.com/repos/${userOrCompany}/${projectName}/languages?client_id=${githubClientId}&client_secret=${githubClientSecret}`
        const programmingLanguagesResponse = await requestPromise({
          uri: programmingLanguagesUri,
          headers: {
            'User-Agent': 'octonode/0.3 (https://github.com/pksunkara/octonode) terminal/0.0'
          },
          json: true
        })

        const languages = Object.keys(programmingLanguagesResponse)

        return project(userOrCompany, projectName, userId, 'github').then((p) => {
          return p.createTask(taskParameters).then(async (task) => {
            for (const language of languages) {
              // Check if the language exists
              let programmingLanguage = await models.ProgrammingLanguage.findOne({
                where: { name: language }
              })

              // If it doesn't exist, create it
              if (!programmingLanguage) {
                programmingLanguage = await models.ProgrammingLanguage.create({
                  name: language
                })
              }

              // Associate the programming language with the task
              await models.ProjectProgrammingLanguage.create({
                projectId: task.ProjectId,
                programmingLanguageId: programmingLanguage.id
              })
            }

            const role = await roleExists({ name: 'company_owner' })
            if (role.dataValues && role.dataValues.id) {
              const userInfo = await requestPromise({
                uri: `https://api.github.com/users/${userOrCompany}?client_id=${githubClientId}&client_secret=${githubClientSecret}`,
                headers: {
                  'User-Agent': 'octonode/0.3 (https://github.com/pksunkara/octonode) terminal/0.0'
                }
              })
              const userInfoJSON = JSON.parse(userInfo)
              const userExist = userExists && (await userExists({ email: userInfoJSON.email }))
              if (userExist && userExist.dataValues && userExist.dataValues.id) {
                await task.createMember({
                  userId: userExist.dataValues.id,
                  roleId: role.dataValues.id
                })
              } else {
                // send an email
              }
            }

            const taskData = task.dataValues
            const userData = await task.getUser()

            if (userData.receiveNotifications) {
              TaskMail.new(userData, taskData)
            }

            // Skip Slack notifications for private or not_listed tasks
            const isTaskPublic = !(taskData.not_listed === true || taskData.private === true)
            if (isTaskPublic) {
              issueAddedComment(task)
              notifyNewIssue(taskData, userData)
            }

            return { ...taskData, ProjectId: taskData.ProjectId }
          })
        })
      })
    case 'bitbucket':
      return requestPromise({
        uri: `https://api.bitbucket.org/2.0/repositories/${userOrCompany}/${projectName}/issues/${issueId}`
      }).then((response) => {
        return project(userOrCompany, projectName, userId, 'bitbucket').then((p) => {
          return p.createTask({ ...taskParameters, private: true }).then((task) => {
            return task.dataValues
          })
        })
      })

    default:
      return models.Task.build(taskParameters, {
        include: [models.User, models.Member]
      })
        .save()
        .then((data) => {
          return data.dataValues
        })
  }
})
