const Signatures = require('./content')
const request = require('./request')
const constants = require('./constants')
const i18n = require('i18n')

const PaymentMail = {
  success: (user, task, value) => {},
  assigned: (user, task, value) => {},
  error: (user, task, value) => {},
  cancel: (user, task, order) => {},
  support: (user, task, order) => {}
}

if (constants.canSendEmail) {
  PaymentMail.success = (user, task, value) => {
    const to = user.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    request(
      to,
      i18n.__('mail.payment.success.subject'),
      [
        {
          type: 'text/html',
          value: `
          <p>${i18n.__('mail.payment.success.content.main', { value: value, title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}</p>
          <p>${Signatures.sign(language)}</p>`
        },
      ]
    )
  }

  PaymentMail.support = (user, task, order) => {
    i18n.setLocale('en')
    request(
      constants.notificationEmail,
      i18n.__('mail.payment.support'),
      [
        {
          type: 'text/html',
          value: `Support was requested by the user ${user.name}, (${user.email})
          for the task: ${task.id}, order: ${order.id}, for the value of ${order.amount}.`
        },
      ]
    )
  }

  PaymentMail.assigned = (user, task, value) => {
    const to = user.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    request(
      to,
      i18n.__('mail.payment.assigned.subject'),
      [
        {
          type: 'text/html',
          value: `
          <p>${i18n.__('mail.payment.assigned.content.main', { value: value, title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}</p>
          <p>${i18n.__('mail.payment.assigned.content.secondary')}</p>
          <p>${Signatures.sign(language)}</p>`
        },
      ]
    )
  }

  PaymentMail.error = (user, task, value) => {
    const to = user.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    request(
      to,
      i18n.__('mail.payment.subject.error'),
      [
        {
          type: 'text/html',
          value: `
          <p>${i18n.__('mail.payment.content.error', { value: value, title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}</p>
          <p>${Signatures.sign(language)}</p>`
        },
      ]
    )
  }

  PaymentMail.cancel = (user, task, order) => {
    const to = user.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    request(
      to,
      i18n.__('mail.payment.subject.cancel'),
      [
        {
          type: 'text/html',
          value: `
          <p>${i18n.__('mail.payment.content.cancel', { value: order.amount, title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}</p>
          <p>${Signatures.sign(language)}</p>`
        },
      ]
    )
  }
}
module.exports = PaymentMail
