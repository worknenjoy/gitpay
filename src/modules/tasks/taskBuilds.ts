import requestPromise from 'request-promise'
import models from '../../models'
import { GithubConnect } from '../../client/provider/github'
import TaskMail from '../../mail/task'
import { roleExists } from '../roles'
import { userExists } from '../users'
import project from '../../utils/project/projectHelpers'
import { issueAddedComment } from '../../bot/issueAddedComment'
import { notifyNewIssue } from '../../shared/slack'
import { parseAndValidateIssueUrl } from '../../utils/issue/parse-and-validate-issue-url'

const currentModels = models as any

export async function taskBuilds(taskParameters: any) {
  const repoUrl = taskParameters.url
  const provider = taskParameters.provider
  const { userOrCompany, projectName, issueId } = parseAndValidateIssueUrl(repoUrl, provider)
  const userId = taskParameters.userId

  if (!userId) return false

  let uri: string

  switch (taskParameters.provider) {
    case 'github': {
      uri = `https://api.github.com/repos/${userOrCompany}/${projectName}/issues/${issueId}`

      const response = await GithubConnect({ uri })

      if (!response && !response.title) return false
      const issueDataJsonGithub = response as any
      if (!taskParameters.title) taskParameters.title = issueDataJsonGithub.title
      if (!taskParameters.description) taskParameters.description = issueDataJsonGithub.body

      const programmingLanguagesUri = `https://api.github.com/repos/${userOrCompany}/${projectName}/languages`
      let programmingLanguagesResponse = {}
      try {
        programmingLanguagesResponse = await GithubConnect({ uri: programmingLanguagesUri })
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
        const userURI = `https://api.github.com/users/${userOrCompany}`
        const userInfo = await GithubConnect({ uri: userURI })
        const userInfoJSON = userInfo as any
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
      await notifyNewIssue(taskData, userData)

      return { ...taskData, ProjectId: taskData.ProjectId }
    }

    case 'bitbucket': {
      const response = await requestPromise({
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
