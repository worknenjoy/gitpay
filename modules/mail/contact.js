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
          title: ${params.title}
          email: ${params.email}
          phone: ${params.phone}
          company: ${params.company}
          country: ${params.country}
          message: ${params.message}
          ${Signatures.sign()}`
        },
      ]
    )
  }
}

module.exports = ContactMail
