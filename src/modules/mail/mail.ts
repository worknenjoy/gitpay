import request from './request'
import i18n from 'i18n'
import emailTemplate from './templates/base-content'

const Sendmail = {
  success: async (user: any, subject: string, msg: string) => {
    const to = user.email
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications

    if (!receiveNotifications) {
      return
    }

    i18n.setLocale(language)

    try {
      return await request(to, subject, [
        {
          type: 'text/html',
          value: emailTemplate.baseContentEmailTemplate(msg)
        }
      ])
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },

  error: async (user: any, subject: string, msg: string) => {
    const to = user.email
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications

    if (!receiveNotifications) {
      return
    }

    i18n.setLocale(language)

    try {
      return await request(to, subject, [
        {
          type: 'text/html',
          value: emailTemplate.baseContentEmailTemplate(msg)
        }
      ])
    } catch (error) {
      console.error('Error sending email:', error)
    }
  }
}

export default Sendmail

module.exports = Sendmail
