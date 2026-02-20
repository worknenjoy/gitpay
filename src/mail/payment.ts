import request from './request'
import * as constants from './constants'
import i18n from 'i18n'
import emailTemplate from './templates/base-content'
import { tableContentEmailTemplate, type ActionButton } from './templates/table-content'
import currencyInfo from '../utils/currency/currency-info'

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
  },

  oldBountyPaypalRefunded: async (
    user: any,
    task: any,
    order: any,
    meta: { ageDays: number | null; olderThanDays: number; returnMethod?: 'refund' | 'payout' }
  ) => {
    const to = user.email
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications

    if (!receiveNotifications) {
      return
    }

    i18n.setLocale(language)

    const taskUrl = `${process.env.FRONTEND_HOST}/#/task/${task.id}`
    const paymentsUrl = `${process.env.FRONTEND_HOST}/#/profile/payments`
    const currency = String(order.currency || 'usd').toLowerCase()
    const symbol = currencyInfo[currency as keyof typeof currencyInfo]?.symbol || ''
    const value = order.amount

    const ageDaysText = typeof meta?.ageDays === 'number' ? `${meta.ageDays} days` : '-'

    const humanizeAge = (days: number | null): string | null => {
      if (typeof days !== 'number' || !Number.isFinite(days) || days < 0) return null
      if (days >= 365) {
        const years = Math.floor(days / 365)
        return years === 1 ? '1 year' : `${years} years`
      }
      if (days >= 30) {
        const months = Math.floor(days / 30)
        return months === 1 ? '1 month' : `${months} months`
      }
      return days === 1 ? '1 day' : `${days} days`
    }

    const ageText = humanizeAge(meta?.ageDays ?? null)
    const thresholdText =
      meta?.olderThanDays === 365 ? '1 year' : `${meta?.olderThanDays ?? 365} days`

    const returnMethod = meta?.returnMethod === 'payout' ? 'payout' : 'refund'
    const payoutNotice =
      returnMethod === 'payout'
        ? `<p>${i18n.__('mail.payment.oldBountyRefunded.payoutNotice')}</p>`
        : ''

    const subjectKey =
      returnMethod === 'payout'
        ? 'mail.payment.oldBountyRefunded.subjectPayout'
        : 'mail.payment.oldBountyRefunded.subject'

    try {
      return await request(to, i18n.__(subjectKey), [
        {
          type: 'text/html',
          value: tableContentEmailTemplate(
            i18n.__('mail.payment.oldBountyRefunded.intro', {
              name: user.name || user.username || 'Gitpay User'
            }),
            `${i18n.__('mail.payment.oldBountyRefunded.content', {
              age: ageText ?? thresholdText,
              title: task.title,
              url: taskUrl,
              threshold: thresholdText
            })}${payoutNotice}`,
            {
              headers: ['Field', 'Value'],
              rows: [
                ['Provider', 'PayPal'],
                ...(returnMethod === 'payout' ? [['Return method', 'Payout']] : []),
                ['Amount', `${symbol} ${value}`],
                ['Currency', String(order.currency || '').toUpperCase()],
                ['Order ID', String(order.id)],
                ['Authorization ID', String(order.authorization_id || '-')],
                ['Capture ID', String(order.transfer_id || '-')],
                ['Bounty age', ageDaysText]
              ]
            },
            i18n.__('mail.payment.oldBountyRefunded.footer'),
            {
              link: paymentsUrl,
              text: i18n.__('mail.payment.oldBountyRefunded.cta')
            } as ActionButton
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
