const Promise = require('bluebird')
const ContactMail = require('../mail/contact')

module.exports = Promise.method(function contactRecruiters(contactParams) {
  return ContactMail.recruiters(contactParams)
})
