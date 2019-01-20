if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const i18n = require('i18n')
const dateFormat = require('dateformat')
const moment = require('moment')

const models = require('../../../models')
const constants = require('../../mail/constants')
const TaskMail = require('../../mail/task')
const SendMail = require('../../mail/mail')

const FAILED_REASON = {
  declined_by_network: 'Denied by card',
  not_sent_to_network: 'Hight risk card, please provide all the information'
}

const CURRENCIES = {
  brl: 'R$',
  usd: '$'
}

exports.github = async (req, res) => {
  const response = req.body || res.body
  // eslint-disable-next-line no-console
  console.log('request from github started')
  // eslint-disable-next-line no-console
  console.log('response', response)
  if (req.headers.authorization === `Bearer ${process.env.GITHUB_WEBHOOK_APP_TOKEN}`) {
    // eslint-disable-next-line no-console
    console.log('request from webhook catched')
    if (response.action === 'labeled') {
      const labels = response.issue.labels
      const labelNotify = labels.filter(label => label.name === 'notify')
      if (labelNotify) {
        try {
          const user = await models.User.findOne({
            where: {
              username: response.issue.user.login
            }
          })
          const userData = user && user.dataValues
          const task = await models.Task.findOne({
            where: {
              url: response.issue.html_url
            }
          })

          // eslint-disable-next-line no-console
          console.log('a user was found inside the label', user)
          const taskData = task.dataValues
          // eslint-disable-next-line no-console
          console.log('it has task data inside the label', taskData)
          const taskUrl = `${process.env.FRONTEND_HOST}/#/task/${taskData.id}`

          if (userData && !taskData.notified) {
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
          TaskMail.notify(userData, {
            task: {
              title: taskData.title,
              issue_url: taskData.url,
              url: constants.taskUrl(taskData.id),
              value: taskData.value > 0 ? taskData.value : null,
              deadline: taskData.deadline ? `${dateFormat(taskData.deadline, constants.dateFormat)} (${moment(taskData.deadline).fromNow()})` : null
            }
          })

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
            SendMail.error('notifications@gitpay.me', 'Error to update task', `An error ocurred to update the task ${task}`)
            return res.status(404)
          }

          const finalResponse = { ...response,
            task: {
              id: taskData.id,
              url: taskUrl,
              title: taskData.title,
              value: taskData.value > 0 ? taskData.value : null,
              deadline: taskData.deadline ? `${dateFormat(taskData.deadline, constants.dateFormat)} (${moment(taskData.deadline).fromNow()})` : null,
              userId: userData ? userData.id : null
            } }
          // eslint-disable-next-line no-console
          console.log('finalResponse', finalResponse)
          return res.json(finalResponse)
        }
        catch (e) {
          // eslint-disable-next-line no-console
          console.log('error', e)
          return res.json({})
        }
      }
    }

    // eslint-disable-next-line no-console
    console.log('request from webhook catched')
    if (response.action === 'opened') {
      // eslint-disable-next-line no-console
      console.log('it is a opened Issue')
      try {
        const user = await models.User.findOne({
          where: {
            username: response.issue.user.login
          }
        })
        const userData = user && user.dataValues
        const taskExist = await models.Task.findOne({
          where: {
            url: response.issue.html_url
          }
        })

        const task = taskExist || await models.Task.build(
          {
            title: response.issue.title,
            provider: 'github',
            url: response.issue.html_url,
            userId: userData ? userData.id : null
          }
        ).save()

        // eslint-disable-next-line no-console
        console.log('a user was found', user)
        const taskData = task.dataValues
        // eslint-disable-next-line no-console
        console.log('it has task data', taskData)
        const taskUrl = `${process.env.FRONTEND_HOST}/#/task/${taskData.id}`
        if (userData) {
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
        const finalResponse = { ...response,
          task: {
            id: taskData.id,
            url: taskUrl,
            title: taskData.title,
            userId: userData ? userData.id : null
          } }
        // eslint-disable-next-line no-console
        console.log('finalResponse', finalResponse)
        return res.json(finalResponse)
      }
      catch (e) {
        // eslint-disable-next-line no-console
        console.log('error', e)
        return res.json({})
      }
    }
  }
  // eslint-disable-next-line no-console
  console.log('send req body that as it is')
  return res.json(req.body)
}

exports.updateWebhook = (req, res) => {
  if (req.body.object === 'event') {
    const event = req.body
    const paid = event.data.object.paid || false
    const status = event.data.object.status

    switch (event.type) {
      case 'customer.source.created':
        return models.User.findOne({
          where: {
            customer_id: event.data.object.customer
          },
          attributes: ['email']
        }).then((user) => {
          if (!user) {
            return res.status(400).send({ errors: ['User not found'] })
          }
          SendMail.success(
            user.dataValues,
            i18n.__('mail.webhook.payment.success.subject'),
            i18n.__('mail.webhook.payment.success.message', {
              name: event.data.object.name,
              number: event.data.object.last4
            })
          )
          return res.json(req.body)
        }).catch(error => res.status(400).send(error))
        /* eslint-disable no-unreachable */
        break
      case 'charge.updated':
        return models.Order.update(
          {
            paid: paid,
            status: status
          },
          {
            where: {
              source_id: event.data.object.source.id,
              source: event.data.object.id
            },
            returning: true
          }
        )
          .then(order => {
            if (order[0]) {
              return models.User.findOne({
                where: {
                  id: order[1][0].dataValues.userId
                }
              })
                .then(user => {
                  if (user) {
                    if (paid && status === 'succeeded') {
                      SendMail.success(
                        user.dataValues,
                        i18n.__('mail.webhook.payment.update.subject'),
                        i18n.__('mail.webhook.payment.update.message', { amount: event.data.object.amount / 100 })
                      )
                    }
                  }
                  return res.json(req.body)
                })
                .catch(e => {
                  return res.status(400).send(e)
                })
            }
          })
          .catch(e => {
            return res.status(400).send(e)
          })
        break
      case 'charge.succeeded':
        return models.Order.update(
          {
            paid: paid,
            status: status
          },
          {
            where: {
              source_id: event.data.object.source.id,
              source: event.data.object.id
            },
            returning: true
          }
        )
          .then(order => {
            if (order[0]) {
              return models.User.findOne({
                where: {
                  id: order[1][0].dataValues.userId
                }
              })
                .then(user => {
                  if (user) {
                    if (paid && status === 'succeeded') {
                      SendMail.success(
                        user.dataValues,
                        i18n.__('mail.webhook.payment.update.subject'),
                        i18n.__('mail.webhook.payment.approved.message', {
                          amount: event.data.object.amount / 100
                        })
                      )
                    }
                  }

                  return res.json(req.body)
                })
                .catch(e => {
                  return res.status(400).send(e)
                })
            }
          })
          .catch(e => {
            return res.status(400).send(e)
          })

        break
      case 'charge.failed':
        return models.Order.update(
          {
            paid: paid,
            status: status
          },
          {
            where: {
              source_id: event.data.object.source.id,
              source: event.data.object.id
            },
            returning: true
          }
        )
          .then(order => {
            if (order[0]) {
              models.User.findOne({
                where: {
                  id: order[1][0].dataValues.userId
                }
              }).then(user => {
                if (user) {
                  if (status === 'failed') {
                    SendMail.error(
                      user.dataValues,
                      i18n.__('mail.webhook.payment.unapproved.subject'),
                      i18n.__('mail.webhook.payment.unapproved.message', {
                        reason: FAILED_REASON[event.data.object.outcome.network_status],

                      })
                    )
                    return res.json(req.body)
                  }
                }
              })
            }
          })
          .catch(e => {
            return res.status(400).send(e)
          })

        break
      case 'transfer.created':
        return models.Task.findOne({
          where: {
            transfer_id: event.data.object.id
          },
          include: [models.User]
        }).then(task => {
          if (task) {
            return models.Assign.findOne({
              where: {
                id: task.dataValues.assigned
              },
              include: [models.User]
            })
              .then(assigned => {
                SendMail.success(
                  assigned.dataValues.User.dataValues,
                  i18n.__('mail.webhook.payment.transfer.subject'),
                  i18n.__('mail.webhook.payment.transfer.message', {
                    amount: event.data.object.amount / 100,
                    url: `${process.env.FRONTEND_HOST}/#/task/${task.id}`
                  })
                )
                return res.json(req.body)
              })
              .catch(e => {
                return res.status(400).send(e)
              })
          }
        })

        break
      case 'payout.created':
        return models.User.findOne({
          where: {
            account_id: event.account
          }
        })
          .then(user => {
            if (user) {
              const date = new Date(event.data.object.arrival_date * 1000)
              SendMail.success(
                user.dataValues,
                i18n.__('mail.webhook.payment.transfer.intransit.subject'),
                i18n.__('mail.webhook.payment.transfer.intransit.message', {
                  currency: CURRENCIES[event.data.object.currency],
                  amount: event.data.object.amount / 100,
                  date: date
                })
              )
              return res.json(req.body)
            }
          })
          .catch(e => {
            // eslint-disable-next-line no-console
            console.log('error on payout.created', e)
            return res.status(400).send(e)
          })

        break
      case 'payout.failed':
        return models.User.findOne({
          where: {
            account_id: event.account
          }
        })
          .then(user => {
            if (user) {
              SendMail.success(
                user.dataValues,
                i18n.__('mail.webhook.payment.transfer.intransit.fail.subject'),
                i18n.__('mail.webhook.payment.transfer.intransit.fail.message', {
                  currency: CURRENCIES[event.data.object.currency],
                  amount: event.data.object.amount / 100
                })
              )
              return res.json(req.body)
            }
          })
          .catch(e => {
            // eslint-disable-next-line no-console
            console.log('error on payout.failed', e)
            return res.status(400).send(e)
          })
        break
      case 'payout.paid':
        return models.User.findOne({
          where: {
            account_id: event.account
          }
        })
          .then(user => {
            if (user) {
              const date = new Date(event.data.object.arrival_date * 1000)
              SendMail.success(
                user.dataValues,
                i18n.__('mail.webhook.payment.transfer.finished.subject'),
                i18n.__('mail.webhook.payment.transfer.finished.message', {
                  currency: CURRENCIES[event.data.object.currency],
                  amount: event.data.object.amount / 100,
                  date: date
                })
              )
              return res.json(req.body)
            }
          })
          .catch(e => {
            // eslint-disable-next-line no-console
            console.log('error on payout.created', e)
            return res.status(400).send(e)
          })

        break
      case 'balance.available':
        SendMail.success(
          'tarefas@gitpay.me',
          'New balance on your account',
          `
                  <p>We have a new balance:</p>
                  <ul>
                  ${event.data.object.available.map(b => `<li>${b.currency}: ${b.amount}</li>`).join('')}
                  </ul>              
              `)
        return res.json(req.body)
        break
      default:
        return res.status(400).send({
          error: {
            message: 'Not recognized event type'
          }
        })
        break
    }
  }
  else {
    return res.send(false)
  }
}
