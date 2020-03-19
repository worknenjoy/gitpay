const Signatures = require('./content')
const request = require('./request')
const constants = require('./constants')
const moment = require('moment')
const ptLocale = require('moment/locale/pt-br')
const i18n = require('i18n')

moment.locale('pt-br', ptLocale)

const IssueClosedMail = {
  success: (to, data) => {},
  error: (msg) => {}
}

if (constants.canSendEmail) {
  IssueClosedMail.success = (user, data) => {
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
          <p>${i18n.__('mail.hello', { name: data.name })}</p>
          ${i18n.__('mail.status.when.closed', { url: data.url, title: data.title })}
          <p>${Signatures.sign(language)}</p>`
        },
      ]
    )
  }

  IssueClosedMail.error = (msg) => {
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

module.exports = IssueClosedMail
