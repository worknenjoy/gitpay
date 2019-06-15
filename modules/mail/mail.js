const Signatures = require('./content')
const request = require('./request')
const constants = require('./constants')
const i18n = require('i18n')

const Sendmail = {
  success: (user, subject, msg) => {},
  error: (to, subject, msg) => {}
}

if (constants.canSendEmail) {
  Sendmail.success = (user, subject, msg) => {
    const to = user.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    request(
      to,
      subject,
      [
        {
          type: 'text/html',
          value: `${msg}
          ${Signatures.sign()}`
        },
      ]
    )
  }

  Sendmail.error = (user, subject, msg) => {
    const to = user.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    request(
      to,
      subject,
      [
        {
          type: 'text/html',
          value: `${msg}
          ${Signatures.sign()}`
        },
      ]
    )
  }
}

module.exports = Sendmail
