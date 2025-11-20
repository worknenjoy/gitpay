const Signatures = require('./content')
const request = require('./request')
const constants = require('./constants')
const i18n = require('i18n')
const emailTemplate = require('./templates/base-content')

const TransferMail = {
  success: (to, task, value) => {},
  notifyOwner: (to, task, value) => {},
  error: (to, task, value) => {},
  paymentForInvalidAccount: (to) => {},
  futurePaymentForInvalidAccount: (to) => {},
  transferBounty: (order, taskFrom, taskTo, user) => {},
  paymentRequestInitiated: async (user, paymentRequest) => {},
}

if (constants.canSendEmail) {
  TransferMail.success = (user, task, value) => {
    const to = user.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    user?.receiveNotifications &&
      request(to, i18n.__('mail.transfer.new.subject.success'), [
        {
          type: 'text/html',
          value: emailTemplate.baseContentEmailTemplate(`
            <p>${i18n.__('mail.transfer.new.message.success', { value: value, title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}<p>`),
        },
      ])
  }

  TransferMail.notifyOwner = (user, task, value) => {
    const to = user.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    user?.receiveNotifications &&
      request(to, i18n.__('mail.transfer.notify.subject.success'), [
        {
          type: 'text/html',
          value: emailTemplate.baseContentEmailTemplate(
            `<p>${i18n.__('mail.transfer.notify.message.success', { value: value, title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}<p>`,
          ),
        },
      ])
  }

  TransferMail.error = (user, task, value) => {
    const to = user.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    user?.receiveNotifications &&
      request(to, i18n.__('mail.transfer.error.subject'), [
        {
          type: 'text/html',
          value: emailTemplate.baseContentEmailTemplate(`
          <p>${i18n.__('mail.transfer.error.message', { value: value, title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}<p>`),
        },
      ])
  }

  TransferMail.paymentForInvalidAccount = (user) => {
    const to = user.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    user?.receiveNotifications &&
      request(to, i18n.__('mail.transfer.missing.subject'), [
        {
          type: 'text/html',
          value: emailTemplate.baseContentEmailTemplate(
            `<p>${i18n.__('mail.transfer.missing.message')}</p>`,
          ),
        },
      ])
  }

  TransferMail.futurePaymentForInvalidAccount = (user) => {
    const to = user.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    user?.receiveNotifications &&
      request(to, i18n.__('mail.transfer.missing.subject'), [
        {
          type: 'text/html',
          value: emailTemplate.baseContentEmailTemplate(
            `<p>${i18n.__('mail.transfer.invalid.message')}</p>`,
          ),
        },
      ])
  }

  TransferMail.transferBounty = (order, taskFrom, taskTo, user) => {
    const to = user.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    user?.receiveNotifications &&
      request(to, i18n.__('mail.transfer.bounty.subject'), [
        {
          type: 'text/html',
          value: emailTemplate.baseContentEmailTemplate(`
          <p>${i18n.__('mail.transfer.bounty.message', {
            taskFromTitle: taskFrom.title,
            taskFromUrl: taskFrom.url,
            taskToTitle: taskTo.title,
            taskToUrl: taskTo.url,
            amount: order.amount,
          })}</p>`),
        },
      ])
  }
}

module.exports = TransferMail
