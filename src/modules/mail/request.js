const sgMail = require('@sendgrid/mail')
const { sendgrid } = require('../../config/secrets')
const handleResponse = require('./handleResponse')
const handleError = require('./handleError')
const { copyEmail, notificationEmail, fromEmail, canSendEmail } = require('./constants')
const emailTemplate = require('./templates/default')

module.exports = async (to, subject, content, replyEmail) => {
  if (!sendgrid.apiKey) {
    console.warn('SendGrid API key is missing')
  }

  if (canSendEmail && sendgrid.apiKey) {
    sgMail.setApiKey(sendgrid.apiKey)

    try {
      const msg = {
        to,
        bcc: copyEmail,
        from: notificationEmail,
        replyTo: replyEmail || fromEmail,
        subject,
        content: [
          {
            type: content[0].type || 'text/html',
            value: emailTemplate.defaultEmailTemplate(content[0].value),
          },
        ],
      }

      const response = await sgMail.send(msg)
      return handleResponse(response)
    } catch (err) {
      return handleError(err)
    }
  } else {
    // eslint-disable-next-line no-console
    console.log(' ----- email / subject ---- ')
    // eslint-disable-next-line no-console
    console.log(to)
    // eslint-disable-next-line no-console
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
    return [
      {
        statusCode: 202,
        type: 'text/html',
        to,
        subject,
        value: content,
      },
    ]
  }
}
