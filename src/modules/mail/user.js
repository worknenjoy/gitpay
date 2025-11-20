const request = require('./request')
const constants = require('./constants')
const i18n = require('i18n')
const emailTemplate = require('./templates/main-content')

const UserMail = {
  activation: (user, token) => {},
}

if (constants.canSendEmail) {
  UserMail.activation = (user, token) => {
    const to = user.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    user?.receiveNotifications &&
      request(to, i18n.__('mail.user.activation.subject'), [
        {
          type: 'text/html',
          value: emailTemplate.mainContentEmailTemplate(
            i18n.__('mail.user.activation.message', {
              url: `${process.env.FRONTEND_HOST}/#/user/${user.id}/activate/${token}`,
            }),
          ),
        },
      ])
  }
}
