// @ts-ignore - @sendgrid/mail types may not be properly exported
import sgMail from '@sendgrid/mail'
import { sendgrid } from '../config/secrets'
import handleResponse from './handleResponse'
import handleError from './handleError'
import { copyEmail, notificationEmail, fromEmail } from './constants'
import emailTemplate from './templates/default'
import { env } from 'process'

const request = async (to: string, subject: string, content: any[], replyEmail?: string) => {
  if (!sendgrid.apiKey && env.NODE_ENV !== 'test') {
    console.warn('SendGrid API key is missing')
  }

  if (sendgrid.apiKey) {
    sgMail.setApiKey(sendgrid.apiKey)

    try {
      const msg = {
        to,
        bcc: copyEmail,
        from: notificationEmail,
        replyTo: replyEmail || fromEmail,
        subject,
        html: emailTemplate.defaultEmailTemplate(content[0].value)
      }

      const response = await sgMail.send(msg)
      return handleResponse(response)
    } catch (err) {
      return handleError(err)
    }
  } else {
    if (env.NODE_ENV !== 'test') {
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
    }
    return [
      {
        statusCode: 202,
        type: 'text/html',
        to,
        subject,
        value: content
      }
    ]
  }
}

export default request

module.exports = request
