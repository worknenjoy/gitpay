/* eslint-disable no-console */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

import i18n from 'i18n'
const dateFormat = require('dateformat')
import moment from 'moment'
import models from '../../../models'
const constants = require('../../../mail/constants')
const TaskMail = require('../../../mail/task')
const SendMail = require('../../../mail/mail')
const IssueClosedMail = require('../../../mail/issueClosed')
import type { Request, Response } from 'express'

export const github = async (req: Request, res: Response) => {
  const response = req.body || (res as any).body
  const labels = response && response.issue && response.issue.labels
  if (req.headers.authorization === `Bearer ${process.env.GITHUB_WEBHOOK_APP_TOKEN}`) {
    // below would update issue status if someone updates it on Github
    if (
      response.action === 'reopened' ||
      response.action === 'opened' ||
      response.action === 'closed'
    ) {
      const status = response.issue.state
      const dbUrl = response.issue.html_url
      const updated = await models.Task.update(
        { status: status },
        {
          where: {
            url: dbUrl
          },
          returning: true
        }
      )
      const updatedTaskRecord = updated?.[1]?.[0]
      if (!updatedTaskRecord) return res.status(404).json({})

      const updatedTask = updatedTaskRecord.dataValues
      const user = await models.User.findOne({
        where: {
          id: updatedTask.userId
        }
      })
      if (updatedTask) {
        if (updatedTask.status === 'closed') {
          if (user) {
            IssueClosedMail.success(user.dataValues, {
              name: user.dataValues.name,
              url: updatedTask.url,
              title: updatedTask.title
            })
          }
        }
        return res.json({
          ...response,
          task: updatedTask
        })
      } else return res.status(500).json({})
    }
    if (response.action === 'labeled') {
      try {
        const totalLabelResponse: any[] = []
        await Promise.all(
          labels.map(async (label: any) => {
            let persistedLabel = await models.Label.findOne({
              where: {
                name: label.name
              }
            })
            if (persistedLabel === null) {
              persistedLabel = await models.Label.create({
                name: label.name
              })
            }
            const labelId = persistedLabel.dataValues.id
            if (label.name === 'notify') {
              let finalResponse: any = {}
              try {
                console.log('it is labeled notify')
                const user = await models.User.findOne({
                  where: {
                    username: response.issue.user.login
                  }
                })
                const userData = user?.dataValues
                const task = await models.Task.findOne({
                  where: {
                    url: response.issue.html_url
                  }
                })
                const taskData = task?.dataValues
                if (!taskData) {
                  finalResponse = { task: { status: 404 } }
                  return
                }
                const taskUrl = `${process.env.FRONTEND_HOST}/#/task/${taskData.id}`

                if (userData && !taskData.notified) {
                  const language = userData.language || 'en'
                  i18n.setLocale(language)
                  SendMail.success(
                    userData,
                    i18n.__('mail.webhook.github.issue.new.subject', {
                      title: response.issue.title
                    }),
                    i18n.__('mail.webhook.github.issue.new.message', {
                      task: taskUrl,
                      issue: response.issue.html_url,
                      repo: response.repository.html_url
                    })
                  )
                  await (task as any).addLabels(labelId)
                }
                if (userData) {
                  TaskMail.notify(userData, {
                    task: {
                      title: taskData.title,
                      issue_url: taskData.url,
                      url: constants.taskUrl(taskData.id),
                      value: taskData.value > 0 ? taskData.value : null,
                      deadline: taskData.deadline
                        ? `${dateFormat(taskData.deadline, constants.dateFormat)} (${moment(taskData.deadline).fromNow()})`
                        : null
                    }
                  })
                }

                const taskUpdate = await models.Task.update(
                  {
                    notified: true
                  },
                  {
                    where: {
                      url: response.issue.html_url
                    }
                  }
                )

                if (!taskUpdate) {
                  SendMail.error(
                    'notifications@gitpay.me',
                    'Error to update task',
                    `An error occurred to update the task ${task}`
                  )
                }
                finalResponse = {
                  task: {
                    id: taskData.id,
                    url: taskUrl,
                    title: taskData.title,
                    value: taskData.value > 0 ? taskData.value : null,
                    deadline: taskData.deadline
                      ? `${dateFormat(taskData.deadline, constants.dateFormat)} (${moment(taskData.deadline).fromNow()})`
                      : null,
                    userId: userData ? userData.id : null,
                    label: label.name,
                    status: !taskUpdate ? 404 : 200
                  }
                }
              } catch (e) {
                finalResponse = {}
              }
              totalLabelResponse.push(finalResponse.task)
            }
            if (label.name === 'gitpay') {
              // eslint-disable-next-line no-console
              console.log('it is labeled Gitpay')
              let finalResponse: any = {}
              try {
                const user = await models.User.findOne({
                  where: {
                    username: response.issue.user.login
                  }
                })
                const userData = user?.dataValues
                const taskExist = await models.Task.findOne({
                  where: {
                    url: response.issue.html_url
                  }
                })
                const task =
                  taskExist ||
                  (await models.Task.build({
                    title: response.issue.title,
                    provider: 'github',
                    url: response.issue.html_url,
                    userId: userData ? userData.id : null
                  }).save())
                await (task as any).addLabels(labelId)
                const taskData = task.dataValues
                const taskUrl = `${process.env.FRONTEND_HOST}/#/task/${taskData.id}`
                if (userData) {
                  const language = userData.language || 'en'
                  i18n.setLocale(language)
                  SendMail.success(
                    userData,
                    i18n.__('mail.webhook.github.issue.new.subject', {
                      title: response.issue.title
                    }),
                    i18n.__('mail.webhook.github.issue.new.message', {
                      task: taskUrl,
                      issue: response.issue.html_url,
                      repo: response.repository.html_url
                    })
                  )
                }
                finalResponse = {
                  task: {
                    id: taskData.id,
                    url: taskUrl,
                    title: taskData.title,
                    userId: userData ? userData.id : null,
                    label: label.name,
                    status: 200
                  }
                }
              } catch (e) {
                // eslint-disable-next-line no-console
                console.log('error to build task from github webhook on label gitpay', e)
                finalResponse = {}
              }
              totalLabelResponse.push(finalResponse.task)
            }
          })
        )
        const allResponse = { ...response, totalLabelResponse }
        return res.json({ ...allResponse })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('error to build task from github webhook on label gitpay', e)
        return res.json({})
      }
    }
  } else {
    console.log('send req body that as it is.....')
    return res.status(200).json(req.body)
  }
  // eslint-disable-next-line no-console
}
