import SendMail from '../mail/mail'
import constants from '../mail/constants'

type RequestJoinCoreTeamParams = {
  param: {
    email: string
  }
}

export async function requestJoinCoreTeam(params: RequestJoinCoreTeamParams) {
  SendMail.success(
    { email: constants.joinTeamEmail, language: 'en', receiveNotifications: true },
    'Want to join Core Team',
    'The user with the email ' + params.param.email + ' wants to join to Gitpay core tem'
  )
}
