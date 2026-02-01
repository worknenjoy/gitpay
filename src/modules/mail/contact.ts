import Signatures from './content'
import request from './request'
import * as constants from './constants'

const ContactMail = {
  recruiters: async (params: any) => {
    try {
      return await request(
        constants.recruitersEmail,
        `There's a new contact for the Gitpay recruitment team from ${params.name} - title (${params.email})`,
        [
          {
            type: 'text/html',
            value: `Here's the contact from ${params.name} to Gitpay team.
          title: ${params.title} <br />
          email: ${params.email} <br />
          phone: ${params.phone} <br />
          company: ${params.company} <br />
          country: ${params.country} <br />
          message: ${params.message} <br />
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
