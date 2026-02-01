import request from './request'
import i18n from 'i18n'
import emailTemplate from './templates/main-content'

const UserMail = {
  activation: async (user: any, token: string) => {
    const to = user.email
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications

    if (!receiveNotifications) {
      return
    }

    i18n.setLocale(language)

    try {
      return await request(to, i18n.__('mail.user.activation.subject'), [
        {
          type: 'text/html',
          value: emailTemplate.mainContentEmailTemplate(
            i18n.__('mail.user.activation.message.intro', {
              name: user.name || user.username || 'Gitpay user'
            }),
            i18n.__('mail.user.activation.message.subtitle'),
            i18n.__('mail.user.activation.buttonText'),
            `${process.env.FRONTEND_HOST}/#/activate/user/${user.id}/token/${token}`
          )
        }
      ])
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },

  changeEmailNotification: async (user: any) => {
    const to = user.pending_email_change
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications

    if (!receiveNotifications) {
      return
    }

    i18n.setLocale(language)

    try {
      return await request(to, i18n.__('mail.user.changeEmailNotification.subject'), [
        {
          type: 'text/html',
          value: emailTemplate.mainContentEmailTemplate(
            i18n.__('mail.user.changeEmailNotification.message', {
              name: user.name || user.username || 'Gitpay user'
            }),
            '',
            i18n.__('mail.user.changeEmailNotification.buttonText'),
            `${process.env.API_HOST}/auth/change-email/confirm/?token=${user.email_change_token}`,
            i18n.__('mail.user.changeEmailNotification.footer')
          )
        }
      ])
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },

  alertOldEmailAboutChange: async (user: any) => {
    const to = user.email
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications

    if (!receiveNotifications) {
      return
    }

    i18n.setLocale(language)

    try {
      return await request(to, i18n.__('mail.user.alertOldEmailAboutChange.subject'), [
        {
          type: 'text/html',
          value: emailTemplate.mainContentEmailTemplate(
            i18n.__('mail.user.alertOldEmailAboutChange.message', {
              name: user.name || user.username || 'Gitpay user',
              newEmail: user.pending_email_change
            }),
            '',
            i18n.__('mail.user.alertOldEmailAboutChange.buttonText'),
            `mailto:contact@gitpay.me`,
            '',
            i18n.__('mail.user.alertOldEmailAboutChange.footer')
          )
        }
      ])
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },

  confirmedChangeUserEmail: async (user: any) => {
    const to = user.pending_email_change
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications

    if (!receiveNotifications) {
      return
    }

    i18n.setLocale(language)

    try {
      return await request(to, i18n.__('mail.user.confirmedChangeUserEmail.subject'), [
        {
          type: 'text/html',
          value: emailTemplate.mainContentEmailTemplate(
            i18n.__('mail.user.confirmedChangeUserEmail.message', {
              name: user.name || user.username || 'Gitpay user',
              newEmail: user.pending_email_change
            })
          )
        }
      ])
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },

  confirmedChangeUserEmailOldEmail: async (user: any) => {
    const to = user.email
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications

    if (!receiveNotifications) {
      return
    }

    i18n.setLocale(language)

    try {
      return await request(to, i18n.__('mail.user.confirmedChangeUserEmailOldEmail.subject'), [
        {
          type: 'text/html',
          value: emailTemplate.mainContentEmailTemplate(
            i18n.__('mail.user.confirmedChangeUserEmailOldEmail.message', {
              name: user.name || user.username || 'Gitpay user',
              newEmail: user.pending_email_change
            })
          )
        }
      ])
    } catch (error) {
      console.error('Error sending email:', error)
    }
  }
}

export default UserMail

module.exports = UserMail
