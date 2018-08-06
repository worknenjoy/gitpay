const { sendgrid } = require('../../config/secrets')
const sg = require('sendgrid')(sendgrid.apiKey)
const handleResponse = require('./handleResponse')
const handleError = require('./handleError')
const { notificationEmail, fromEmail } = require('./constants')

module.exports = (to, subject, content) => {
  return sendgrid.apiKey && sg.API(sg.emptyRequest({
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
          bcc: [
            {
              email: notificationEmail
            }
          ],
          subject
        },
      ],
      from: {
        email: fromEmail
      },
      content: content,
    },
  })).then(handleResponse).catch(handleError)
}
