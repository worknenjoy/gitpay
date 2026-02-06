import models from '../../models'
import * as url from 'url'
import requestPromise from 'request-promise'
import TaskMail from '../../mail/task'
import { roleExists } from '../roles'
import { userExists } from '../users'
import project from '../projectHelpers'
import { issueAddedComment } from '../../bot/issueAddedComment'
import { notifyNewIssue } from '../../shared/slack'
import { GithubConnect } from '../../client/provider/github'

const currentModels = models as any

function parseAndValidateIssueUrl(
  rawUrl: string,
  provider: string
): { userOrCompany: string; projectName: string; issueId: string } {
  if (!rawUrl || typeof rawUrl !== 'string') {
    throw new Error('Invalid repository URL')
  }

  const parsed = url.parse(rawUrl)
  const hostname = (parsed.hostname || '').toLowerCase()
  const path = parsed.pathname || parsed.path || ''

  // Only allow expected hosts for supported providers
  const isGithubHost = hostname === 'github.com' || hostname === 'www.github.com'
  const isBitbucketHost = hostname === 'bitbucket.org' || hostname === 'www.bitbucket.org'

  if (provider === 'github' && !isGithubHost) {
    throw new Error('URL host is not allowed for GitHub provider')
  }
  if (provider === 'bitbucket' && !isBitbucketHost) {
    throw new Error('URL host is not allowed for Bitbucket provider')
  }

  // Basic path validation: /owner/repo/issues/number
  const segments = path.split('/').filter(Boolean) // removes empty segments
  if (segments.length < 4 || segments[2] !== 'issues') {
    throw new Error('Repository URL does not match expected issue pattern')
  }

  const userOrCompany = segments[0]
  const projectName = segments[1]
  const issueId = segments[3]

  // Disallow path traversal-like segments and ensure basic integrity
  if (!userOrCompany || !projectName || !issueId) {
    throw new Error('Repository URL is missing required components')
  }
  if (userOrCompany === '..' || projectName === '..' || issueId === '..') {
    throw new Error('Repository URL contains invalid path segments')
  }
  if (!/^[0-9]+$/.test(issueId)) {
    throw new Error('Issue id in URL is not a valid number')
  }

  // Additional safety: restrict owner and repository name to expected patterns
  // GitHub owners and repo names are typically alphanumeric with dashes/underscores and dots.
  const ownerRepoPattern = /^[A-Za-z0-9][A-Za-z0-9-_.]*$/
  if (!ownerRepoPattern.test(userOrCompany)) {
    throw new Error('Repository URL contains an invalid owner/organization name')
  }
  if (!ownerRepoPattern.test(projectName)) {
    throw new Error('Repository URL contains an invalid project name')
  }

  return { userOrCompany, projectName, issueId }
}

export async function taskBuilds(taskParameters: any) {
  const repoUrl = taskParameters.url
  const provider = taskParameters.provider
  const { userOrCompany, projectName, issueId } = parseAndValidateIssueUrl(repoUrl, provider)
  const userId = taskParameters.userId
  const token = taskParameters.token

  if (!userId) return false

  switch (taskParameters.provider) {
    case 'github': {
      const uri = `https://api.github.com/repos/${userOrCompany}/${projectName}/issues/${issueId}`

      const issueDataJsonGithub = await GithubConnect({
        uri,
        token
      })

      if (!issueDataJsonGithub || !issueDataJsonGithub.title) return false
      if (!taskParameters.title) taskParameters.title = issueDataJsonGithub.title
      if (!taskParameters.description) taskParameters.description = issueDataJsonGithub.body

      const programmingLanguagesUri = `https://api.github.com/repos/${userOrCompany}/${projectName}/languages`
      let programmingLanguagesResponse = {}
      try {
        programmingLanguagesResponse = await GithubConnect({
          uri: programmingLanguagesUri,
          token: taskParameters.token
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
        const userInfo = await GithubConnect({
          uri: `https://api.github.com/users/${userOrCompany}`
        })
        const userExist = userExists && (await userExists({ email: userInfo.email }))
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
      await notifyNewIssue(taskData, userData)

      return { ...taskData, ProjectId: taskData.ProjectId }
    }

    case 'bitbucket': {
      await requestPromise({
        uri: `https://api.bitbucket.org/2.0/repositories/${userOrCompany}/${projectName}/issues/${issueId}`
      })

      const p = await project(userOrCompany, projectName, userId, 'bitbucket')
      const task = await p.createTask({ ...taskParameters, private: true })
      return task.dataValues
    }

    default: {
      const data = await currentModels.Task.build(taskParameters, {
        include: [currentModels.User, currentModels.Member]
      }).save()
      return data.dataValues
    }
  }
}
