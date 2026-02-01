import request from './request'
import i18n from 'i18n'
import emailTemplate from './templates/base-content'

const TransferMail = {
  success: async (user: any, task: any, value: number) => {
    const to = user.email
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications

    if (!receiveNotifications) {
      return
    }

    i18n.setLocale(language)

    try {
      return await request(to, i18n.__('mail.transfer.new.subject.success'), [
        {
          type: 'text/html',
          value: emailTemplate.baseContentEmailTemplate(`
            <p>${i18n.__('mail.transfer.new.message.success', { value: String(value), title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}<p>`)
        }
      ])
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },

  notifyOwner: async (user: any, task: any, value: number) => {
    const to = user.email
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications

    if (!receiveNotifications) {
      return
    }

    i18n.setLocale(language)

    try {
      return await request(to, i18n.__('mail.transfer.notify.subject.success'), [
        {
          type: 'text/html',
          value: emailTemplate.baseContentEmailTemplate(
            `<p>${i18n.__('mail.transfer.notify.message.success', { value: String(value), title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}<p>`
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
      return await request(to, i18n.__('mail.transfer.error.subject'), [
        {
          type: 'text/html',
          value: emailTemplate.baseContentEmailTemplate(`
          <p>${i18n.__('mail.transfer.error.message', { value: String(value), title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}<p>`)
        }
      ])
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },

  paymentForInvalidAccount: async (user: any) => {
    const to = user.email
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications

    if (!receiveNotifications) {
      return
    }

    i18n.setLocale(language)

    try {
      return await request(to, i18n.__('mail.transfer.missing.subject'), [
        {
          type: 'text/html',
          value: emailTemplate.baseContentEmailTemplate(
            `<p>${i18n.__('mail.transfer.missing.message')}</p>`
          )
        }
      ])
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },

  futurePaymentForInvalidAccount: async (user: any) => {
    const to = user.email
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications

    if (!receiveNotifications) {
      return
    }

    i18n.setLocale(language)

    try {
      return await request(to, i18n.__('mail.transfer.missing.subject'), [
        {
          type: 'text/html',
          value: emailTemplate.baseContentEmailTemplate(
            `<p>${i18n.__('mail.transfer.invalid.message')}</p>`
          )
        }
      ])
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },

  transferBounty: async (order: any, taskFrom: any, taskTo: any, user: any) => {
    const to = user.email
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications

    if (!receiveNotifications) {
      return
    }

    i18n.setLocale(language)

    try {
      return await request(to, i18n.__('mail.transfer.bounty.subject'), [
        {
          type: 'text/html',
          value: emailTemplate.baseContentEmailTemplate(`
          <p>${i18n.__('mail.transfer.bounty.message', {
            taskFromTitle: taskFrom.title,
            taskFromUrl: taskFrom.url,
            taskToTitle: taskTo.title,
            taskToUrl: taskTo.url,
            amount: order.amount
          })}</p>`)
        }
      ])
    } catch (error) {
      console.error('Error sending email:', error)
    }
  }
}

export default TransferMail

module.exports = TransferMail
