const Signatures = require('./content')
const request = require('./request')
const constants = require('./constants')
const i18n = require('i18n')
const emailTemplate = require('./templates/base-content')

const PaymentMail = {
  success: (user, task, value) => {},
  assigned: (user, task, value) => {},
  error: (user, task, value) => {},
  cancel: (user, task, order) => {},
  support: (user, task, order) => {},
  refund: (user, task, order) => {},
}

if (constants.canSendEmail) {
  PaymentMail.success = (user, task, value) => {
    const to = user.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    user?.receiveNotifications &&
      request(to, i18n.__('mail.payment.success.subject'), [
        {
          type: 'text/html',
          value: emailTemplate.baseContentEmailTemplate(`
          <p>${i18n.__('mail.payment.success.content.main', { value: value, title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}</p>`),
        },
      ])
  }

  PaymentMail.support = (user, task, order) => {
    i18n.setLocale('en')
    user?.receiveNotifications &&
      request(constants.notificationEmail, i18n.__('mail.payment.support'), [
        {
          type: 'text/html',
          value:
            emailTemplate.baseContentEmailTemplate(`Support was requested by the user ${user.name}, (${user.email})
          for the task: ${task.id}, order: ${order.id}, for the value of ${order.amount}.`),
        },
      ])
  }

  PaymentMail.assigned = (user, task, value) => {
    const to = user.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    user?.receiveNotifications &&
      request(to, i18n.__('mail.payment.assigned.subject'), [
        {
          type: 'text/html',
          value: emailTemplate.baseContentEmailTemplate(
            `
          <p>${i18n.__('mail.payment.assigned.content.main', { value: value, title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}</p>`,
            `<p>${i18n.__('mail.payment.assigned.content.secondary')}</p>`,
          ),
        },
      ])
  }

  PaymentMail.error = (user, task, value) => {
    const to = user.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    user?.receiveNotifications &&
      request(to, i18n.__('mail.payment.subject.error'), [
        {
          type: 'text/html',
          value: emailTemplate.baseContentEmailTemplate(`
            <p>${i18n.__('mail.payment.content.error', { value: value, title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}</p>`),
        },
      ])
  }

  PaymentMail.cancel = (user, task, order) => {
    const to = user.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    user?.receiveNotifications &&
      request(to, i18n.__('mail.payment.subject.cancel'), [
        {
          type: 'text/html',
          value: emailTemplate.baseContentEmailTemplate(`
          <p>${i18n.__('mail.payment.content.cancel', { value: order.amount, title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}</p>`),
        },
      ])
  }

  PaymentMail.refund = (user, task, order) => {
    const to = user.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    user?.receiveNotifications &&
      request(to, i18n.__('mail.payment.subject.refund'), [
        {
          type: 'text/html',
          value: emailTemplate.baseContentEmailTemplate(
            `<p>${i18n.__('mail.payment.content.refund', { value: order.amount, title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}</p>`,
          ),
        },
      ])
  }
}
module.exports = PaymentMail
