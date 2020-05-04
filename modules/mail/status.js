const Signatures = require('./content')
const request = require('./request')
const constants = require('./constants')
// const dateFormat = require('dateformat')
const moment = require('moment')
const ptLocale = require('moment/locale/pt-br')
const i18n = require('i18n')

moment.locale('pt-br', ptLocale)

const StatusMail = {
  update: (to, task, name) => {},
  error: (msg) => {}
}

const STATUSES = {
  'open': i18n.__('mail.status.open'),
  'OPEN': i18n.__('mail.status.open'),
  'in_progress': i18n.__('mail.status.progress'),
  'closed': i18n.__('mail.status.closed'),
  '': i18n.__('mail.status.notefined'),
  null: i18n.__('mail.status.notefined'),
  undefined: i18n.__('mail.status.notefined')
}

if (constants.canSendEmail) {
  StatusMail.update = (user, task, name) => {
    const to = user.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    request(
      to,
      i18n.__('mail.status.subject'),
      [
        {
          type: 'text/html',
          value: `
          <p>Olá ${i18n.__('mail.hello', { name: name })}</p>
          <p>${i18n.__('mail.status.message.first', { title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}</p>
          <p>${i18n.__('mail.status.message.second', { status: STATUSES[task.status] })}</p>
          <p>${Signatures.sign(language)}</p>`
        },
      ]
    )
  }

  StatusMail.error = (msg) => {
    request(
      constants.notificationEmail,
      i18n.__('mail.status.error'),
      [
        {
          type: 'text/html',
          value: msg
        },
      ]
    )
  }
}

module.exports = StatusMail
