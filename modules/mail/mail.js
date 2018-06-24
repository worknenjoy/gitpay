const sg = require('sendgrid')(process.env.SENDGRID_API_KEY)
const Signatures = require('./content')

let Sendmail = {}
let bcc = []

if (process.env.NODE_ENV !== 'test') {
  bcc.push({
    email: 'notifications@gitpay.me'
  })
}

Sendmail.success = (to, subject, msg) => {
  const request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: {
      personalizations: [
        {
          to: [
            {
              email: to,
            },
          ],
          bcc: bcc,
          subject: subject
        },
      ],
      from: {
        email: 'tarefas@gitpay.me'
      },
      content: [
        {
          type: 'text/html',
          value: msg + Signatures.sign
        },
      ],
    },
  })

  sg.API(request)
    .then(response => {
      // eslint-disable-next-line no-console
      console.log(response.statusCode)
      // eslint-disable-next-line no-console
      console.log(response.body)
      // eslint-disable-next-line no-console
      console.log(response.headers)
    })
    .catch(error => {
      // error is an instance of SendGridError
      // The full response is attached to error.response
      // eslint-disable-next-line no-console
      console.log(error.response.body.errors)
      // eslint-disable-next-line no-console
      console.log(error.response.statusCode)
    })
}

Sendmail.error = (to, subject, msg) => {
  const request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: {
      personalizations: [
        {
          to: [
            {
              email: to,
            },
          ],
          subject: subject
        },
      ],
      from: {
        email: 'tarefas@gitpay.me'
      },
      content: [
        {
          type: 'text/html',
          value: msg + Signatures.sign
        },
      ],
    },
  })

  sg.API(request)
    .then(response => {
      // eslint-disable-next-line no-console
      console.log(response.statusCode)
      // eslint-disable-next-line no-console
      console.log(response.body)
      // eslint-disable-next-line no-console
      console.log(response.headers)
    })
    .catch(error => {
      // error is an instance of SendGridError
      // The full response is attached to error.response
      // eslint-disable-next-line no-console
      console.log(error.response.statusCode)
    })
}

module.exports = Sendmail
