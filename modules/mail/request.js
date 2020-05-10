const { sendgrid } = require('../../config/secrets')
const sg = require('sendgrid')(sendgrid.apiKey)
const handleResponse = require('./handleResponse')
const handleError = require('./handleError')
const Signatures = require('./content')
const { notificationEmail, fromEmail } = require('./constants')

module.exports = (to, subject, content, replyEmail) => {
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
        email: replyEmail || notificationEmail
      },
      reply_to: {
        email: replyEmail || fromEmail
      },
      content:
      [{
        type: content[0].type,
        value: `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
   <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Gitpay mail notification</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  </head>
  
  <body style="margin: 0; padding: 0;">
   <table color: #153643; font-family: Arial, sans-serif; font-size: 32px; cellpadding="0" cellspacing="0" width="100%">
    <tr>
     <td>
     ${Signatures.header()}
     </td>
    </tr>
    <tr>
      <td bgcolor="#fff" style="padding: 40px 30px 40px 30px;">
      <table cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td>
            <h2>${subject}</h2>
          </td>
        </tr>
        <tr>
          <td>
            ${content[0].value}
          </td>
        </tr>
      </table>
      </td>
    </tr>
   </table>
  </body>
  </html>
        `
      }]
    },
  })).then(handleResponse).catch(handleError)
}
