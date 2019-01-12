const { sendgrid } = require('../../config/secrets')
const constants = require('./constants')
const sgMail = require('@sendgrid/mail')

module.exports = (to, subject, data) => {
  sgMail.setApiKey(sendgrid.apiKey)
  let baseMsg = {
    from: constants.fromEmail,
    templateId: constants.templates.onetask,
    asm: {
      group_id: constants.groups.onetask
    }
  }
  let msg = []
  if (Array.isArray(to)) {
    msg = to.map((item, i) => {
      return { ...baseMsg, to: item, dynamic_template_data: data[i], subject: subject[i] }
    })
  }
  else {
    msg = [{ ...baseMsg, to, bcc: constants.notificationEmail, dynamic_template_data: data, subject }]
  }
  return sgMail.send(msg).then((response) => {
    // eslint-disable-next-line no-console
    console.log(response)
    return response
  }).catch(e => {
    // eslint-disable-next-line no-console
    console.log('error to send email', e)
  })
}
