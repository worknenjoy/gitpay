const Promise = require('bluebird')
const SendMail = require('../mail/mail')
const { notificationEmail } = require('../mail/constants')

module.exports = Promise.method(function requestJoinCoreTeam (params) {
  SendMail.success(
    { email: notificationEmail, language: 'en' },
    'Want to join Core Team',
    'The user with the email ' + params.param.email + ' wants to join to Gitpay core tem')
})
