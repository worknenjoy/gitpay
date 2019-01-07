if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const models = require('../../../loading/loading')
const SendMail = require('../../mail/mail')
const i18n = require('i18n')

const FAILED_REASON = {
  declined_by_network: 'Denied by card',
  not_sent_to_network: 'Hight risk card, please provide all the information'
}

const CURRENCIES = {
  brl: 'R$',
  usd: '$'
}

exports.github = async (req, res) => {
  if (req.body.installation && req.body.installation.id === parseInt(process.env.GITHUB_WEBHOOK_APP_ID)) {
    if (req.body.action === 'created') {
      try {
        const user = await models.User.findOne({
          where: {
            username: req.body.issue.user.login
          }
        })
        const userData = user && user.dataValues
        const task = await models.Task.build(
          {
            title: req.body.issue.title,
            provider: 'github',
            url: req.body.issue.html_url,
            userId: userData ? userData.id : null
          }
        ).save()
        const taskData = task.dataValues
        const taskUrl = `${process.env.FRONTEND_HOST}/#/task/${taskData.id}`
        SendMail.success(
          userData,
          i18n.__('mail.webhook.github.issue.new.subject', {
            title: req.body.issue.title
          }),
          i18n.__('mail.webhook.github.issue.new.message', {
            task: taskUrl,
            issue: req.body.issue.html_url,
            repo: req.body.repository.html_url
          })
        )
        return res.json({ ...req.body,
          task: {
            id: taskData.id,
            url: taskUrl,
            title: taskData.title,
            userId: userData ? userData.id : null
          } })
      }
      catch (e) {
        // eslint-disable-next-line no-console
        console.log('error', e)
        return res.json({})
      }
    }
  }
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
