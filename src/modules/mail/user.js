const request = require('./request')
const constants = require('./constants')
const i18n = require('i18n')
const emailTemplate = require('./templates/main-content')

const UserMail = {
  activation: (user, token) => {},
  changeEmailNotification: (user) => {},
  alertOldEmailAboutChange: (user) => {},
  confirmedChangeUserEmail: (user) => {},
  confirmedChangeUserEmailOldEmail: (user) => {}
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
              name: user.username || 'Gitpay user',
              url: `${process.env.FRONTEND_HOST}/#/user/${user.id}/activate/${token}`
            })
          )
        }
      ])
  }

  UserMail.changeEmailNotification = (user) => {
    const to = user.pending_email_change
    const language = user.language || 'en'
    i18n.setLocale(language)
    user?.receiveNotifications &&
      request(to, i18n.__('mail.user.changeEmailNotification.subject'), [
        {
          type: 'text/html',
          value: emailTemplate.mainContentEmailTemplate(
            i18n.__('mail.user.changeEmailNotification.message', {
              username: user.username,
              confirmChangeEmailLink: `${process.env.FRONTEND_HOST}/#/user/${user.id}/confirm-change-email/${user.email_change_token}`
            })
          )
        }
      ])
  }
  UserMail.alertOldEmailAboutChange = (user) => {
    const to = user.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    user?.receiveNotifications &&
      request(to, i18n.__('mail.user.alertOldEmailAboutChange.subject'), [
        {
          type: 'text/html',
          value: emailTemplate.mainContentEmailTemplate(
            i18n.__('mail.user.alertOldEmailAboutChange.message', {
              username: user.username,
              newEmail: user.pending_email_change
            })
          )
        }
      ])
  }

  UserMail.confirmedChangeUserEmail = (user) => {
    const to = user.pending_email_change
    const language = user.language || 'en'
    i18n.setLocale(language)
    user?.receiveNotifications &&
      request(to, i18n.__('mail.user.confirmedChangeUserEmail.subject'), [
        {
          type: 'text/html',
          value: emailTemplate.mainContentEmailTemplate(
            i18n.__('mail.user.confirmedChangeUserEmail.message', {
              username: user.username
            })
          )
        }
      ])
  },
  UserMail.confirmedChangeUserEmailOldEmail = (user) => {
    const to = user.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    user?.receiveNotifications &&
      request(to, i18n.__('mail.user.confirmedChangeUserEmailOldEmail.subject'), [
        {
          type: 'text/html',
          value: emailTemplate.mainContentEmailTemplate(
            i18n.__('mail.user.confirmedChangeUserEmailOldEmail.message', {
              username: user.username,
              newEmail: user.pending_email_change
            })
          )
        }
      ])
  }
}

module.exports = UserMail
