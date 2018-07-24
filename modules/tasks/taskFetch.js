const Promise = require('bluebird')
const models = require('../../loading/loading')
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
      }
    ]
  })
    .then(async data => {
      if (data.provider === 'github') {
        const githubUrl = data.dataValues.url
        const githubClientId = secrets.github.id
        const githubClientSecret = secrets.github.secret
        const splitIssueUrl = url.parse(githubUrl).path.split('/')
        const userOrCompany = splitIssueUrl[1]
        const projectName = splitIssueUrl[2]
        const issueId = splitIssueUrl[4]
        const issueData = await requestPromise({
          uri: `https://api.github.com/repos/${userOrCompany}/${projectName}/issues/${issueId}?client_id=${githubClientId}&client_secret=${githubClientSecret}`,
          headers: {
            'User-Agent':
              'octonode/0.3 (https://github.com/pksunkara/octonode) terminal/0.0'
          }
        })
          .then(response => {
            return response
          })
          .catch(e => {
            // eslint-disable-next-line no-console
            console.log('github response error')
            // eslint-disable-next-line no-console
            console.log(e)
          })

        const issueDataJson = JSON.parse(issueData)

        if (!data.title && data.title !== issueDataJson.title) {
          /* eslint-disable no-unused-vars */
          const titleChange = await data
            .updateAttributes({ title: issueDataJson.title })
            .then(task => task)
        }

        return {
          id: data.dataValues.id,
          url: githubUrl,
          title: data.dataValues.title,
          value: data.dataValues.value || 0,
          deadline: data.dataValues.deadline,
          status: data.dataValues.status,
          assigned: data.dataValues.assigned,
          userId: data.dataValues.userId,
          paid: data.dataValues.paid,
          transfer_id: data.dataValues.transfer_id,
          metadata: {
            id: issueId,
            user: userOrCompany,
            company: userOrCompany,
            projectName: projectName,
            issue: issueDataJson
          },
          orders: data.dataValues.Orders,
          assigns: data.dataValues.Assigns
        }
      }
      return data.dataValues
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      return false
    })
})
