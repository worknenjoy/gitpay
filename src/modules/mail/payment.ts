import request from './request'
import * as constants from './constants'
import i18n from 'i18n'
import emailTemplate from './templates/base-content'

const PaymentMail = {
  success: async (user: any, task: any, value: number) => {
    const to = user.email
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications

    if (!receiveNotifications) {
      return
    }

    i18n.setLocale(language)

    try {
      return await request(to, i18n.__('mail.payment.success.subject'), [
        {
          type: 'text/html',
          value: emailTemplate.baseContentEmailTemplate(`
          <p>${i18n.__('mail.payment.success.content.main', { value: String(value), title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}</p>`)
        }
      ])
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },

  support: async (user: any, task: any, order: any) => {
    // This sends to notificationEmail for administrative purposes,
    // not to end users, so no user preference check is needed
    i18n.setLocale('en')

    try {
      return await request(constants.notificationEmail, i18n.__('mail.payment.support'), [
        {
          type: 'text/html',
          value: emailTemplate.baseContentEmailTemplate(
            `Support was requested by the user ${user.name}, (${user.email})
          for the task: ${task.id}, order: ${order.id}, for the value of ${order.amount}.`
          )
        }
      ])
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },

  assigned: async (user: any, task: any, value: number) => {
    const to = user.email
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications

    if (!receiveNotifications) {
      return
    }

    i18n.setLocale(language)

    try {
      return await request(to, i18n.__('mail.payment.assigned.subject'), [
        {
          type: 'text/html',
          value: emailTemplate.baseContentEmailTemplate(
            `
          <p>${i18n.__('mail.payment.assigned.content.main', { value: String(value), title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}</p>`,
            `<p>${i18n.__('mail.payment.assigned.content.secondary')}</p>`
          )
        }
      ])
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },

  error: async (user: any, task: any, value: number) => {
    const to = user.email
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications

    if (!receiveNotifications) {
      return
    }

    i18n.setLocale(language)

    try {
      return await request(to, i18n.__('mail.payment.subject.error'), [
        {
          type: 'text/html',
          value: emailTemplate.baseContentEmailTemplate(`
            <p>${i18n.__('mail.payment.content.error', { value: String(value), title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}</p>`)
        }
      ])
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },

  cancel: async (user: any, task: any, order: any) => {
    const to = user.email
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications

    if (!receiveNotifications) {
      return
    }

    i18n.setLocale(language)

    try {
      return await request(to, i18n.__('mail.payment.subject.cancel'), [
        {
          type: 'text/html',
          value: emailTemplate.baseContentEmailTemplate(`
          <p>${i18n.__('mail.payment.content.cancel', { value: order.amount, title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}</p>`)
        }
      ])
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },

  refund: async (user: any, task: any, order: any) => {
    const to = user.email
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications

    if (!receiveNotifications) {
      return
    }

    i18n.setLocale(language)

    try {
      return await request(to, i18n.__('mail.payment.subject.refund'), [
        {
          type: 'text/html',
          value: emailTemplate.baseContentEmailTemplate(
            `<p>${i18n.__('mail.payment.content.refund', { value: order.amount, title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}</p>`
          )
        }
      ])
    } catch (error) {
      console.error('Error sending email:', error)
    }
  }
}

export default PaymentMail

module.exports = PaymentMail
