import { sendgrid } from '../../config/secrets'
import * as constants from './constants'
// @ts-ignore - @sendgrid/mail types may not be properly exported
import sgMail from '@sendgrid/mail'

const template = (
  to: string | string[],
  subject: string | string[],
  data: any,
  name: string = 'onetask'
) => {
  if (sendgrid.apiKey) {
    sgMail.setApiKey(sendgrid.apiKey)
  }
  let baseMsg = {
    from: constants.fromEmail,
    templateId: (constants.templates as any)[name],
    asm: {
      group_id: (constants.groups as any)[name]
    }
  }
  let msg: any[] = []
  if (Array.isArray(to)) {
    msg = (to as string[]).map((item, i) => {
      return {
        ...baseMsg,
        to: item,
        dynamic_template_data: data[i],
        subject: (subject as string[])[i]
      }
    })
  } else {
    msg = [{ ...baseMsg, to, bcc: constants.copyEmail, dynamic_template_data: data, subject }]
  }
  return sgMail
    .send(msg)
    .then((response) => {
      // eslint-disable-next-line no-console
      console.log('response from sgMail', response)
      return response
    })
    .catch((e) => {
      // eslint-disable-next-line no-console
      console.log('error to send email', e)
    })
}

export default template

module.exports = template
