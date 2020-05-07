/* eslint-disable no-console */
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
const IssueClosedMail = require('../../mail/issueClosed')

const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_KEY)

const FAILED_REASON = {
  declined_by_network: 'Denied by card',
  not_sent_to_network: 'Hight risk card, please provide all the information'
}

const CURRENCIES = {
  aud: '$',
  eur: '€',
  brl: 'R$',
  cad: 'C$',
  czk: 'Kč',
  dkk: 'DK',
  hkd: 'HK$',
  inr: '₹',
  jpy: '¥',
  myr: 'RM',
  mxn: 'Mex$',
  nzd: 'NZ$',
  nok: 'kr',
  isk: 'kr',
  pln: 'zł',
  ron: 'lei',
  sgd: 'S$',
  sek: 'kr',
  chf: 'fr',
  gbp: '£',
  usd: '$'
}

i18n.configure({
  directory: process.env.NODE_ENV !== 'production' ? `${__dirname}/locales` : `${__dirname}/locales/result`,
  locales: process.env.NODE_ENV !== 'production' ? ['en'] : ['en', 'br'],
  defaultLocale: 'en',
  updateFiles: false
})

i18n.init()

exports.github = async (req, res) => {
  const response = req.body || res.body
  const labels = response && response.issue && response.issue.labels
  if (req.headers.authorization === `Bearer ${process.env.GITHUB_WEBHOOK_APP_TOKEN}`) {
    // below would update issue status if someone updates it on Github
    if (response.action === 'reopened' || response.action === 'opened' || response.action === 'closed') {
      const status = response.issue.state
      const dbUrl = response.issue.html_url
      const updated = await models.Task.update({ status: status }, {
        where: {
          url: dbUrl
        },
        returning: true
      })
      const updatedTask = updated[1][0].dataValues
      const user = await models.User.findOne({
        where: {
          id: updatedTask.userId
        }
      })
      if (updated) {
        if (updatedTask.status === 'closed') {
          IssueClosedMail.success(user.dataValues, {
            name: user.dataValues.name,
            url: updatedTask.url,
            title: updatedTask.title
          }
          )
        }
        return res.json({ ...response,
          task: updatedTask })
      }
      else return res.status(500).json({})
    }
    if (response.action === 'labeled') {
      try {
        const totalLabelResponse = []
        await Promise.all(labels.map(async (label) => {
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
            let finalResponse = {}
            try {
              console.log('it is labeled notify')
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
              const taskData = task.dataValues
              const taskUrl = `${process.env.FRONTEND_HOST}/#/task/${taskData.id}`

              if (userData && !taskData.notified) {
                const language = user.language || 'en'
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
                await task.addLabels(labelId)
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
              }
              finalResponse = {
                task: {
                  id: taskData.id,
                  url: taskUrl,
                  title: taskData.title,
                  value: taskData.value > 0 ? taskData.value : null,
                  deadline: taskData.deadline ? `${dateFormat(taskData.deadline, constants.dateFormat)} (${moment(taskData.deadline).fromNow()})` : null,
                  userId: userData ? userData.id : null,
                  label: label.name,
                  status: !taskUpdate ? 404 : 200,
                } }
            }
            catch (e) {
              finalResponse = {}
            }
            totalLabelResponse.push(finalResponse.task)
          }
          if (label.name === 'gitpay') {
            // eslint-disable-next-line no-console
            console.log('it is labeled Gitpay')
            let finalResponse = {}
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
              await task.addLabels(labelId)
              const taskData = task.dataValues
              const taskUrl = `${process.env.FRONTEND_HOST}/#/task/${taskData.id}`
              if (userData) {
                const language = user.language || 'en'
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
                  status: 200,
                } }
            }
            catch (e) {
              // eslint-disable-next-line no-console
              console.log('error to build task from github webhook on label gitpay', e)
              finalResponse = {}
            }
            totalLabelResponse.push(finalResponse.task)
          }
        }))
        const allResponse = { ...response, totalLabelResponse }
        console.log(allResponse, 'response after executing labls')
        return res.json({ ...allResponse })
      }
      catch (e) {
        // eslint-disable-next-line no-console
        console.log('error to build task from github webhook on label gitpay', e)
        return res.json({})
      }
    }
  }
  else {
    console.log('send req body that as it is.....')
    return res.json(req.body)
  }
  // eslint-disable-next-line no-console
}

exports.updateWebhook = (req, res) => {
  // eslint-disable-next-line no-console
  console.log('webhook body', req.body)
  if (req.body.object === 'event') {
    const event = req.body
    const paid = event.data.object.paid || false
    const status = event.data.object.status

    switch (event.type) {
      case 'customer.source.created':
        return models.User.findOne({
          where: {
            customer_id: event.data.object.customer
          }
        }).then((user) => {
          if (!user) {
            return res.status(400).send({ errors: ['User not found'] })
          }
          const language = user.language || 'en'
          i18n.setLocale(language)
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
                      const language = user.language || 'en'
                      i18n.setLocale(language)
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
      case 'charge.refunded':
        return models.Order.update(
          {
            paid: false,
            status: 'refunded'
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
                      const language = user.language || 'en'
                      i18n.setLocale(language)
                      SendMail.success(
                        user.dataValues,
                        i18n.__('mail.webhook.payment.refund.subject'),
                        i18n.__('mail.webhook.payment.refund.message', { amount: event.data.object.amount / 100 })
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
                      const language = user.language || 'en'
                      i18n.setLocale(language)
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
                    const language = user.language || 'en'
                    i18n.setLocale(language)
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
                const language = assigned.dataValues.User.language || 'en'
                i18n.setLocale(language)
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
          else {
            stripe.accounts.retrieve(event.data.object.destination).then(async (account) => {
              const user = await models.User.findOne({
                where: {
                  email: account.email
                }
              })
              if (user) {
                const language = user.language || 'en'
                i18n.setLocale(language)
              }
              SendMail.success(
                account.email,
                i18n.__('mail.webhook.payment.transfer.subject'),
                i18n.__('mail.webhook.payment.transfer.message', {
                  amount: event.data.object.amount / 100,
                  url: `${event.data.object.id}`
                })
              )
              return res.json(req.body)
            }).catch(e => {
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
              const language = user.language || 'en'
              i18n.setLocale(language)
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
              const language = user.language || 'en'
              i18n.setLocale(language)
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
              const language = user.language || 'en'
              i18n.setLocale(language)
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
