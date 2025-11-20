const Promise = require('bluebird')
const SendMail = require('../mail/mail')
const { joinTeamEmail } = require('../mail/constants')

module.exports = Promise.method(function requestJoinCoreTeam(params) {
  SendMail.success(
    { email: joinTeamEmail, language: 'en', receiveNotifications: true },
    'Want to join Core Team',
    'The user with the email ' + params.param.email + ' wants to join to Gitpay core tem'
  )
})
