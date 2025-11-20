const Promise = require('bluebird')
const models = require('../../models')
const secrets = require('../../config/secrets')
const url = require('url')
const requestPromise = require('request-promise')
const roleExists = require('../roles').roleExists
const { userExists } = require('../users')
const { not } = require('ip')
const memberExists = require('../members').memberExists

module.exports = Promise.method(function taskFetch(taskParams) {
  return models.Task.findOne({
    where: {
      id: taskParams.id,
    },
    include: [
      models.User,
      {
        model: models.Project,
        include: [models.Organization],
      },
      {
        model: models.Order,
        include: [models.User],
      },
      {
        model: models.Assign,
        include: [models.User],
      },
      {
        model: models.Member,
        include: [models.User, models.Role],
      },
      {
        model: models.Offer,
        include: [models.User, models.Task],
        order: [['createdAt', 'ASC']],
      },
      {
        model: models.History,
      },
      {
        model: models.Label,
      },
      {
        model: models.Transfer,
      },
    ],
  }).then((data) => {
    const githubClientId = secrets.github.id
    const githubClientSecret = secrets.github.secret
    const issueUrl = data?.dataValues?.url
    const splitIssueUrl = url.parse(issueUrl).path.split('/')
    const userOrCompany = splitIssueUrl[1]
    const projectName = splitIssueUrl[2]
    const issueId = splitIssueUrl[4]

    if (data.dataValues.private) return data.dataValues

    switch (data.dataValues.provider) {
      case 'github':
        return requestPromise({
          uri: `https://api.github.com/repos/${userOrCompany}/${projectName}/issues/${issueId}?client_id=${githubClientId}&client_secret=${githubClientSecret}`,
          headers: {
            'User-Agent': 'octonode/0.3 (https://github.com/pksunkara/octonode) terminal/0.0',
          },
        })
          .then(async (response) => {
            const issueDataJsonGithub = JSON.parse(response)

            const assigned = await models.Assign.findOne({
              where: {
                id: data.assigned,
              },
              include: [models.User],
            }).catch((e) => {})

            const role = await roleExists({ name: 'company_owner' })
            if (role.dataValues && role.dataValues.id) {
              const userInfo = await requestPromise({
                uri: `https://api.github.com/users/${userOrCompany}?client_id=${githubClientId}&client_secret=${githubClientSecret}`,
                headers: {
                  'User-Agent': 'octonode/0.3 (https://github.com/pksunkara/octonode) terminal/0.0',
                },
              })
              const userInfoJSON = JSON.parse(userInfo)
              const userExist = userExists && (await userExists({ email: userInfoJSON.email }))
              if (userExist && userExist.dataValues && userExist.dataValues.id) {
                const memberExist = await memberExists({
                  userId: userExist.dataValues.id,
                  taskId: data.id,
                })
                if (memberExist.dataValues && memberExist.dataValues.id) {
                  // already member
                } else {
                  // add member
                  const task = await models.Task.findOne({
                    where: {
                      id: data.id,
                    },
                  })
                  await task.createMember({
                    userId: userExist.dataValues.id,
                    roleId: role.dataValues.id,
                  })
                }
              } else {
                // send an email
              }
            }

            const repoInfo = await requestPromise({
              uri: `${issueDataJsonGithub.repository_url}?client_id=${githubClientId}&client_secret=${githubClientSecret}`,
              headers: {
                'User-Agent': 'octonode/0.3 (https://github.com/pksunkara/octonode) terminal/0.0',
              },
            })
            const repoInfoJSON = JSON.parse(repoInfo)
            const repoUrl = repoInfoJSON.html_url
            const ownerUrl = repoInfoJSON.owner.html_url
            let responseGithub = {
              id: data.dataValues.id,
              url: issueUrl,
              private: data.dataValues.private,
              not_listed: data.dataValues.not_listed,
              title: data.dataValues.title,
              description: data.dataValues.description,
              value: data.dataValues.value || 0,
              deadline: data.dataValues.deadline,
              level: data.dataValues.level,
              status: data.dataValues.status,
              assigned: data.dataValues.assigned,
              assignedUser: assigned && assigned.dataValues.User.dataValues,
              User: data.dataValues && data.dataValues.User && data.dataValues.User.dataValues,
              paid: data.dataValues.paid,
              transfer_id: data.dataValues.transfer_id,
              provider: data.dataValues.provider,
              metadata: {
                id: issueId,
                user: userOrCompany,
                company: userOrCompany,
                projectName: projectName,
                repoUrl: repoUrl,
                ownerUrl: ownerUrl,
                labels: issueDataJsonGithub.labels,
                issue: issueDataJsonGithub,
              },
              orders: data.dataValues.Orders,
              Transfer: data.dataValues.Transfer,
              Assigns: data.dataValues.Assigns,
              members: data.dataValues.Members,
              Offers: data.dataValues.Offers,
              histories: data.dataValues.Histories,
              Project: data.dataValues.Project && {
                ...data.dataValues.Project.dataValues,
                organization: data.dataValues.Project.dataValues.Organization.dataValues,
              },
            }

            if (!data.title || data.title !== issueDataJsonGithub.title) {
              const dataTitleUpdate = await // eslint-disable no-unused-vars
              data.update(
                { title: issueDataJsonGithub.title },
                {
                  where: {
                    id: data.id,
                  },
                },
              )
              responseGithub.title = dataTitleUpdate.title
            }
            if (data.status !== 'in_progress' && data.status !== issueDataJsonGithub.state) {
              // eslint-disable no-unused-vars
              const dataStatusUpdateInProgress = await data.update(
                { status: issueDataJsonGithub.state },
                {
                  where: {
                    id: data.id,
                  },
                  returning: true,
                },
              )
              responseGithub.status = dataStatusUpdateInProgress.status
            }
            if (issueDataJsonGithub.state === 'closed' && data.status !== 'closed') {
              // eslint-disable no-unused-vars
              const dataStatusUpdatedClosed = await data.update(
                { status: issueDataJsonGithub.state },
                {
                  where: {
                    id: data.id,
                  },
                  returning: true,
                },
              )
              responseGithub.status = dataStatusUpdatedClosed.status
            }
            if (data.Labels.length !== issueDataJsonGithub.labels.length) {
              // eslint-disable no-unused-vars
              try {
                const githubLabels = issueDataJsonGithub.labels
                const taskLabels = data.Labels
                githubLabels.forEach(async (l) => {
                  if (!taskLabels.includes(l['name'])) {
                    const label = await models.Label.findOrCreate({
                      where: {
                        name: l['name'],
                      },
                      include: [models.Task],
                    })
                    data.addLabel(label[0])
                  }
                })
              } catch (e) {
                console.log('error', e)
              }
            }
            return responseGithub
          })
          .catch((e) => {
            // eslint-disable-next-line no-console
            console.log('Github response error')
            // eslint-disable-next-line no-console
            console.log(e)
            return data.dataValues
          })

      case 'bitbucket':
        return requestPromise({
          uri: `https://api.bitbucket.org/2.0/repositories/${userOrCompany}/${projectName}/issues/${issueId}`,
        })
          .then((response) => {
            const issueDataJsonBitbucket = JSON.parse(response)
            const responseBitbucket = {
              id: data.dataValues.id,
              url: issueUrl,
              private: data.dataValues.private,
              not_listed: data.dataValues.not_listed,
              title: data.dataValues.title,
              value: data.dataValues.value || 0,
              deadline: data.dataValues.deadline,
              status: data.dataValues.status,
              assigned: data.dataValues.assigned,
              userId: data.dataValues.userId,
              paid: data.dataValues.paid,
              transfer_id: data.dataValues.transfer_id,
              provider: data.dataValues.provider,
              User: data.dataValues && data.dataValues.User && data.dataValues.User.dataValues,
              Project: data.dataValues.Project && {
                ...data.dataValues.Project.dataValues,
                organization: data.dataValues.Project.dataValues.Organization.dataValues,
              },
              metadata: {
                id: issueId,
                user: userOrCompany,
                company: userOrCompany,
                projectName: projectName,
                provider: data.provider,
                issue: {
                  state: issueDataJsonBitbucket.status,
                  body: issueDataJsonBitbucket.content.raw,
                  user: {
                    login: issueDataJsonBitbucket.reporter.username,
                    avatar_url: issueDataJsonBitbucket.reporter.links.avatar.href,
                  },
                },
              },
              orders: data.dataValues.Orders,
              Transfer: data.dataValues.Transfer,
              assigns: data.dataValues.Assigns,
              members: data.dataValues.Members,
              Offers: data.dataValues.Offers,
            }

            /*
              dont try to sync here too

              if (!data.title && data.title !== issueDataJsonBitbucket.title) {
                // eslint-disable no-unused-vars
                data
                  .updateAttributes({ title: issueDataJsonBitbucket.title })
                  .then(task => responseBitbucket)
              }

              */

            return responseBitbucket
          })
          .catch((e) => {
            // eslint-disable-next-line no-console
            console.log('Bitbucket response error')
            // eslint-disable-next-line no-console
            console.log(e)
            return data.dataValues
          })

      default:
        return data.dataValues
    }
  })
})
