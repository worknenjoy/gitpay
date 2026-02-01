import Signatures from './content'
import request from './request'
import * as constants from './constants'
import moment from 'moment'
import i18n from 'i18n'

moment.locale('pt-br')

const IssueClosedMail = {
  success: async (user: any, data: any) => {
    const to = user.email
    const language = user.language || 'en'

    i18n.setLocale(language)

    try {
      return await request(to, i18n.__('mail.status.subject'), [
        {
          type: 'text/html',
          value: `
          <p>${i18n.__('mail.hello', { name: data.name })}</p>
          ${i18n.__('mail.status.when.closed', { url: data.url, title: data.title })}
          <p>${Signatures.sign(language)}</p>`
        }
      ])
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },

  error: async (msg: string) => {
    i18n.setLocale('en')
    try {
      return await request(constants.notificationEmail, i18n.__('mail.status.error'), [
        {
          type: 'text/html',
          value: msg
        }
      ])
    } catch (error) {
      console.error('Error sending email:', error)
    }
  }
}

export default IssueClosedMail

module.exports = IssueClosedMail
