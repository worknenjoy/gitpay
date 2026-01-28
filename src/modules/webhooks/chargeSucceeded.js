const models = require('../../models')
const i18n = require('i18n')
const SendMail = require('../mail/mail')

const sendEmailSuccess = (event, paid, status, order, req, res) => {
  return models.User.findOne({
    where: {
      id: order[1][0].dataValues.userId
    }
  })
    .then((user) => {
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
    .catch((e) => {
      return res.status(400).send(e)
    })
}

const updateOrder = (event, paid, status, req, res) => {
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
    .then((order) => {
      if (order[0]) {
        return sendEmailSuccess(event, paid, status, order, req, res)
      }
    })
    .catch((e) => {
      return res.status(400).send(e)
    })
}

const createOrder = (event) => {
  const taskId = event.data.object?.transfer_group?.split('_')[1]
  if (!taskId) return Promise.resolve()
  return models.Task.findOne({
    where: { id: taskId }
  }).then((task) => {
    return task.createOrder({
      id: event.data.object.metadata.order_id,
      source_id: event.data.object.source.id,
      currency: event.data.object.currency,
      amount: event.data.object.amount,
      source: event.data.object.id,
      userId: task.dataValues.userId
    })
  })
}

module.exports = (event, paid, status, req, res) => {
  const source_id = event?.data?.object?.source?.id
  if (source_id) {
    return models.Order.findOne({
      where: {
        source_id: event?.data?.object?.source?.id,
        source: event?.data?.object?.id
      }
    }).then((order) => {
      if (order) {
        return updateOrder(event, paid, status, req, res)
      } else {
        return createOrder(event).then((orderCreated) => {
          if (orderCreated) {
            return updateOrder(event, paid, status, req, res)
          }
        })
      }
    })
  }
  return res.json(req.body)
}
