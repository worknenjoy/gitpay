const Signatures = require('./content')
const request = require('./request')
const constants = require('./constants')

const ContactMail = {
  recruiters: (params) => {}
}

if (constants.canSendEmail) {
  ContactMail.recruiters = (params) => {
    request(
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
  }
}

module.exports = ContactMail
