const { sendgrid } = require('../../config/secrets')
const sg = require('sendgrid')(sendgrid.apiKey)
const handleResponse = require('./handleResponse')
const handleError = require('./handleError')
const Signatures = require('./content')
const { copyEmail, notificationEmail, fromEmail } = require('./constants')
const emailTemplate = require('./templates/default')

module.exports = async (to, subject, content, replyEmail) => {
  // eslint-disable-next-line no-console
  console.log(' ----- email / subject ---- ')
  // eslint-disable-next-line no-console
  console.log(to)
  console.log(subject)
  // eslint-disable-next-line no-console
  console.log(' ----- end email ---- ')
  // eslint-disable-next-line no-console
  console.log(' ----- email content ---- ')
  // eslint-disable-next-line no-console
  console.log(content)
  // eslint-disable-next-line no-console
  console.log(' ----- end email content ---- ')
  // eslint-disable-next-line no-console
  console.log(' ----- start email full content ---- ')
  // eslint-disable-next-line no-console
  console.log(emailTemplate.defaultEmailTemplate(content[0].value))
  // eslint-disable-next-line no-console
  console.log(' ----- end email full content ---- ')

  if (!sendgrid.apiKey) return

  try {
    const request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: {
        personalizations: [
          {
            to: [
              {
                email: to
              }
            ],
            bcc: [
              {
                email: copyEmail
              }
            ],
            subject
          }
        ],
        from: {
          email: notificationEmail
        },
        reply_to: {
          email: replyEmail || fromEmail
        },
        content: [
          {
            type: content[0].type,
            value: emailTemplate.defaultEmailTemplate(content[0].value)
          }
        ]
      }
    })

    const response = await sg.API(request)
    return handleResponse(response)
  } catch (err) {
    return handleError(err)
  }
}
