import models from '../../models'
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
const slack = require('../shared/slack')

const currentModels = models as any

export async function taskBuilds(taskParameters: any) {
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
      uri = token
        ? `https://api.github.com/repos/${userOrCompany}/${projectName}/issues/${issueId}`
        : `https://api.github.com/repos/${userOrCompany}/${projectName}/issues/${issueId}?client_id=${githubClientId}&client_secret=${githubClientSecret}`
      headers = {
        'User-Agent': 'octonode/0.3 (https://github.com/pksunkara/octonode) terminal/0.0'
      }
      if (token) headers.Authorization = `token ${token}`
      
      try {
        const response = await requestPromise({
          uri,
          headers
        })
        
        if (!response && !response.title) return false
        const issueDataJsonGithub = JSON.parse(response)
        if (!taskParameters.title) taskParameters.title = issueDataJsonGithub.title
        if (!taskParameters.description) taskParameters.description = issueDataJsonGithub.body

        const programmingLanguagesUri = `https://api.github.com/repos/${userOrCompany}/${projectName}/languages?client_id=${githubClientId}&client_secret=${githubClientSecret}`
        let programmingLanguagesResponse = {}
        try {
          programmingLanguagesResponse = await requestPromise({
            uri: programmingLanguagesUri,
            headers: {
              'User-Agent': 'octonode/0.3 (https://github.com/pksunkara/octonode) terminal/0.0',
              ...(taskParameters.token ? { Authorization: `token ${taskParameters.token}` } : {})
            },
            json: true
          })
        } catch (e) {
          programmingLanguagesResponse = {}
        }

        const languages = Object.keys(programmingLanguagesResponse || {})

        const p = await project(userOrCompany, projectName, userId, 'github')
        const task = await p.createTask(taskParameters)
        
        for (const language of languages) {
          // Check if the language exists
          let programmingLanguage = await currentModels.ProgrammingLanguage.findOne({
            where: { name: language }
          })

          // If it doesn't exist, create it
          if (!programmingLanguage) {
            programmingLanguage = await currentModels.ProgrammingLanguage.create({
              name: language
            })
          }

          // Associate the programming language with the task
          await currentModels.ProjectProgrammingLanguage.create({
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

        issueAddedComment(task)
        slack.notifyNewIssue(taskData, userData)

        return { ...taskData, ProjectId: taskData.ProjectId }
      } catch (error) {
        throw error
      }
      
    case 'bitbucket':
      try {
        const response = await requestPromise({
          uri: `https://api.bitbucket.org/2.0/repositories/${userOrCompany}/${projectName}/issues/${issueId}`
        })
        
        const p = await project(userOrCompany, projectName, userId, 'bitbucket')
        const task = await p.createTask({ ...taskParameters, private: true })
        return task.dataValues
      } catch (error) {
        throw error
      }

    default:
      try {
        const data = await currentModels.Task.build(taskParameters, {
          include: [currentModels.User, currentModels.Member]
        }).save()
        return data.dataValues
      } catch (error) {
        throw error
      }
  }
}
