const Promise = require('bluebird')
const models = require('../../models')
const secrets = require('../../config/secrets')
const url = require('url')
const requestPromise = require('request-promise')

module.exports = Promise.method(function taskFetch (taskParams) {
  return models.Task.findOne({
    where: {
      id: taskParams.id
    },
    include: [
      models.User,
      {
        model: models.Order,
        include: [models.User]
      },
      {
        model: models.Assign,
        include: [models.User]
      },
      {
        model: models.Member,
        include: [models.User, models.Role]
      }
    ]
  })
    .then(data => {
      const githubClientId = secrets.github.id
      const githubClientSecret = secrets.github.secret
      const issueUrl = data.dataValues.url
      const splitIssueUrl = url.parse(issueUrl).path.split('/')
      const userOrCompany = splitIssueUrl[1]
      const projectName = splitIssueUrl[2]
      const issueId = splitIssueUrl[4]

      switch (data.dataValues.provider) {
        case 'github':
          return requestPromise({
            uri: `https://api.github.com/repos/${userOrCompany}/${projectName}/issues/${issueId}?client_id=${githubClientId}&client_secret=${githubClientSecret}`,
            headers: {
              'User-Agent':
                'octonode/0.3 (https://github.com/pksunkara/octonode) terminal/0.0'
            }
          })
            .then(async response => {
              const issueDataJsonGithub = JSON.parse(response)

              const assigned = await models.Assign.findOne(
                {
                  where: {
                    id: data.assigned
                  },
                  include: [models.User]
                }
              ).catch(e => {})

              const responseGithub = {
                id: data.dataValues.id,
                url: issueUrl,
                title: data.dataValues.title,
                value: data.dataValues.value || 0,
                deadline: data.dataValues.deadline,
                status: data.dataValues.status,
                assigned: data.dataValues.assigned,
                assignedUser: assigned && assigned.dataValues.User.dataValues,
                userId: data.dataValues.userId,
                paid: data.dataValues.paid,
                transfer_id: data.dataValues.transfer_id,
                provider: data.dataValues.provider,
                metadata: {
                  id: issueId,
                  user: userOrCompany,
                  company: userOrCompany,
                  projectName: projectName,
                  issue: issueDataJsonGithub
                },
                orders: data.dataValues.Orders,
                assigns: data.dataValues.Assigns,
                members: data.dataValues.Members
              }

              if (!data.title && data.title !== issueDataJsonGithub.title) {
                /* eslint-disable no-unused-vars */
                data
                  .updateAttributes({ title: issueDataJsonGithub.title })
                  .then(task => responseGithub)
              }
              return responseGithub
            })
            .catch(e => {
              // eslint-disable-next-line no-console
              console.log('github response error')
              // eslint-disable-next-line no-console
              console.log(e)
            })

        case 'bitbucket':
          return requestPromise({
            uri: `https://api.bitbucket.org/1.0/repositories/${userOrCompany}/${projectName}/issues/${issueId}`
          })
            .then(response => {
              const issueDataJsonBitbucket = JSON.parse(response)

              const responseBitbucket = {
                id: data.dataValues.id,
                url: issueUrl,
                title: data.dataValues.title,
                value: data.dataValues.value || 0,
                deadline: data.dataValues.deadline,
                status: data.dataValues.status,
                assigned: data.dataValues.assigned,
                userId: data.dataValues.userId,
                paid: data.dataValues.paid,
                transfer_id: data.dataValues.transfer_id,
                provider: data.dataValues.provider,
                metadata: {
                  id: issueId,
                  user: userOrCompany,
                  company: userOrCompany,
                  projectName: projectName,
                  provider: data.provider,
                  issue: {
                    state: issueDataJsonBitbucket.status,
                    body: issueDataJsonBitbucket.content,
                    user: {
                      login: issueDataJsonBitbucket.reported_by.username,
                      avatar_url: issueDataJsonBitbucket.reported_by.avatar
                    }
                  }
                },
                orders: data.dataValues.Orders,
                assigns: data.dataValues.Assigns
              }

              if (!data.title && data.title !== issueDataJsonBitbucket.title) {
                /* eslint-disable no-unused-vars */
                data
                  .updateAttributes({ title: issueDataJsonBitbucket.title })
                  .then(task => responseBitbucket)
              }
              return responseBitbucket
            })
            .catch(e => {
              // eslint-disable-next-line no-console
              console.log('github response error')
              // eslint-disable-next-line no-console
              console.log(e)
            })

        default:
          return data.dataValues
      }
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      return false
    })
})
