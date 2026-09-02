import Signatures from './content'
import request from './request'
import * as constants from './constants'
import i18n from 'i18n'

const ContactMail = {
  recruiters: async (params: any) => {
    // This sends to recruitersEmail for administrative purposes,
    // not to end users, so no user preference check is needed
    i18n.setLocale('en')

    try {
      return await request(
        constants.recruitersEmail,
        i18n.__('mail.contact.recruiters.subject', { name: params.name, email: params.email }),
        [
          {
            type: 'text/html',
            value: `${i18n.__('mail.contact.recruiters.message', {
              name: params.name,
              title: params.title,
              email: params.email,
              phone: params.phone,
              company: params.company,
              country: params.country,
              message: params.message
            })}
          ${Signatures.sign()}`
          }
        ]
      )
    } catch (error) {
      console.error('Error sending email:', error)
    }
  }
}

export default ContactMail

module.exports = ContactMail
