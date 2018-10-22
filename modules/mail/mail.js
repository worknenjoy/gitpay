const Signatures = require('./content')
const request = require('./request')
const constants = require('./constants')

const Sendmail = {
  success: (to, subject, msg) => {},
  error: (to, subject, msg) => {}
}

if (constants.canSendEmail) {
  Sendmail.success = (to, subject, msg) => {
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

  Sendmail.error = (to, subject, msg) => {
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
