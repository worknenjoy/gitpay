import Signatures from './content'
import request from './request'
import * as constants from './constants'
import moment from 'moment'
import ptLocale from 'moment/locale/pt-br'
import i18n from 'i18n'
import emailTemplate from './templates/base-content'

moment.locale('pt-br', ptLocale)

const STATUSES: { [key: string]: string } = {
  open: i18n.__('mail.status.open'),
  OPEN: i18n.__('mail.status.open'),
  in_progress: i18n.__('mail.status.progress'),
  closed: i18n.__('mail.status.closed'),
  '': i18n.__('mail.status.notefined'),
  null: i18n.__('mail.status.notefined'),
  undefined: i18n.__('mail.status.notefined')
}

const StatusMail = {
  update: async (user: any, task: any, name: string) => {
    const to = user.email
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications

    if (!receiveNotifications) {
      return
    }

    i18n.setLocale(language)

    try {
      return await request(to, i18n.__('mail.status.subject'), [
        {
          type: 'text/html',
          value: emailTemplate.baseContentEmailTemplate(
            i18n.__('mail.hello', { name: name }),
            `<p>${i18n.__('mail.status.message.first', { title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}</p>
          <p>${i18n.__('mail.status.message.second', { status: STATUSES[task.status] })}</p>
          <p>${Signatures.sign(language)}</p>`
          )
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
          value: emailTemplate.baseContentEmailTemplate(msg)
        }
      ])
    } catch (error) {
      console.error('Error sending email:', error)
    }
  }
}

export default StatusMail

module.exports = StatusMail
