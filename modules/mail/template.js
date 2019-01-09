const { sendgrid } = require('../../config/secrets')
const constants = require('./constants')
const sgMail = require('@sendgrid/mail')

module.exports = (to, subject, content, data) => {
  sgMail.setApiKey(sendgrid.apiKey)
  const msg = {
    to: to,
    from: constants.fromEmail,
    subject: subject,
    // text: content,
    html: content,
    templateId: constants.onetask,
    dynamic_template_data: data
  }
  return sgMail.send(msg).then((response) => {
    // eslint-disable-next-line no-console
    // console.log(response)
    return response
  })
}
