import request from './request'
import i18n from 'i18n'
import emailTemplate from './templates/base-content'
import { tableContentEmailTemplate, type ActionButton } from './templates/table-content'
import type { PendingReviewReason } from '../services/transfers/transferBuildsService'

const PENDING_REVIEW_REASON_KEYS: Record<PendingReviewReason['code'], string> = {
  stripe_no_account: 'mail.transfer.pendingReview.reason.stripe_no_account',
  stripe_insufficient_capabilities:
    'mail.transfer.pendingReview.reason.stripe_insufficient_capabilities',
  whop_no_account: 'mail.transfer.pendingReview.reason.whop_no_account',
  whop_transfer_failed: 'mail.transfer.pendingReview.reason.whop_transfer_failed',
  paypal_no_account: 'mail.transfer.pendingReview.reason.paypal_no_account',
  paypal_transfer_failed: 'mail.transfer.pendingReview.reason.paypal_transfer_failed'
}

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

  pendingForReview: async (user: any, task: any, reasons: PendingReviewReason[]) => {
    const to = user.email
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications

    if (!receiveNotifications) {
      return
    }

    i18n.setLocale(language)

    const url = `${process.env.FRONTEND_HOST}/#/task/${task.id}`
    const claimsUrl = `${process.env.FRONTEND_HOST}/#/profile/claims`
    const payoutSettingsUrl = `${process.env.FRONTEND_HOST}/#/profile/payout-settings`

    const reasonsList = (reasons || [])
      .map(
        (reason) =>
          `<li>${i18n.__(PENDING_REVIEW_REASON_KEYS[reason.code] || 'mail.transfer.pendingReview.reason.generic')}</li>`
      )
      .join('')

    try {
      return await request(to, i18n.__('mail.transfer.pendingReview.subject'), [
        {
          type: 'text/html',
          value: tableContentEmailTemplate(
            i18n.__('mail.transfer.pendingReview.intro', {
              name: user.name || user.username || 'Gitpay User',
              title: task.title || task.id,
              url
            }),
            `${i18n.__('mail.transfer.pendingReview.reasonsIntro')}<ul>${reasonsList}</ul>`,
            {},
            i18n.__('mail.transfer.pendingReview.footer', { payoutSettingsUrl }),
            {
              link: claimsUrl,
              text: i18n.__('mail.transfer.pendingReview.cta')
            } as ActionButton
          )
        }
      ])
    } catch (error) {
      console.error('Error sending pending review email:', error)
    }
  },

  claimInitiatedNotifyOwner: async (owner: any, task: any, claimedByUser: any, value: number) => {
    const to = owner.email
    const language = owner.language || 'en'
    const receiveNotifications = owner?.receiveNotifications

    if (!receiveNotifications) {
      return
    }

    i18n.setLocale(language)

    const claimedByName = claimedByUser.name || claimedByUser.username || 'Gitpay User'

    try {
      return await request(to, i18n.__('mail.transfer.claimed.owner.subject'), [
        {
          type: 'text/html',
          value: emailTemplate.baseContentEmailTemplate(`
          <p>${i18n.__('mail.transfer.claimed.owner.message', { name: claimedByName, value: String(value), title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}<p>`)
        }
      ])
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },

  claimInitiatedNotifyBacker: async (backer: any, task: any, claimedByUser: any, value: number) => {
    const to = backer.email
    const language = backer.language || 'en'
    const receiveNotifications = backer?.receiveNotifications

    if (!receiveNotifications) {
      return
    }

    i18n.setLocale(language)

    const claimedByName = claimedByUser.name || claimedByUser.username || 'Gitpay User'

    try {
      return await request(to, i18n.__('mail.transfer.claimed.backer.subject'), [
        {
          type: 'text/html',
          value: emailTemplate.baseContentEmailTemplate(`
          <p>${i18n.__('mail.transfer.claimed.backer.message', { name: claimedByName, value: String(value), title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}<p>`)
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
