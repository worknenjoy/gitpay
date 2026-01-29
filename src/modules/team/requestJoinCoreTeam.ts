const SendMail = require('../mail/mail')
const { joinTeamEmail } = require('../mail/constants')

type RequestJoinCoreTeamParams = {
  param: {
    email: string
  }
}

export async function requestJoinCoreTeam(params: RequestJoinCoreTeamParams) {
  SendMail.success(
    { email: joinTeamEmail, language: 'en', receiveNotifications: true },
    'Want to join Core Team',
    'The user with the email ' + params.param.email + ' wants to join to Gitpay core tem'
  )
}
