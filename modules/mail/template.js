const { sendgrid } = require('../../config/secrets')
const constants = require('./constants')
const sgMail = require('@sendgrid/mail')

module.exports = (to, subject, data) => {
  sgMail.setApiKey(sendgrid.apiKey)
  const msg = {
    to: to,
    from: constants.fromEmail,
    subject: subject,
    templateId: constants.templates.onetask,
    dynamic_template_data: data,
    asm: {
      group_id: 8241
    }
  }
  return sgMail.send(msg).then((response) => {
    // eslint-disable-next-line no-console
    // console.log(response)
    return response
  }).catch(e => {
    // eslint-disable-next-line no-console
    console.log('error to send email', e)
  })
}
