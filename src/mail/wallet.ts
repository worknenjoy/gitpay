import emailTemplate from './templates/main-content'
import { tableContentEmailTemplate, type ActionButton } from './templates/table-content'
import * as constants from './constants'
import request from './request'
import i18n from 'i18n'
import currencyInfo from '../utils/currency/currency-info'

const WalletMail = {
  invoiceCreated: async (invoice: any, walletOrder: any, user: any) => {
    const to = user.email
    const language = user.language || 'en'

    i18n.setLocale(language)

    try {
      return await request(
        to,
        i18n.__('mail.webhook.wallet.invoice.subject'),
        [
          {
            type: 'text/html',
            value: emailTemplate.mainContentEmailTemplate(
              i18n.__('mail.webhook.wallet.invoice.intro', { name: user.name }),
              i18n.__('mail.webhook.wallet.invoice.message', {
                amount: walletOrder.amount,
                currency: invoice.currency,
                walletName: walletOrder.Wallet.name
              }),
              i18n.__('mail.webhook.wallet.invoice.button'),
              invoice.hosted_invoice_url,
              '',
              i18n.__('mail.webhook.wallet.invoice.footer')
            )
          }
        ],
        constants.notificationEmail
      )
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },

  /**
   * Notify wallet owner that their remaining wallet balance was refunded
   * (e.g. long period of inactivity).
   */
  balanceRefunded: async (
    user: any,
    details: {
      wallet: any
      refundAmount: string | number
      previousBalance: string | number
      resultingBalance: string | number
      reason?: string
      steps?: Array<{ walletOrderId: number; refundAmount: string; newStatus: string }>
    }
  ) => {
    const to = user.email
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications

    if (!receiveNotifications) {
      return
    }

    i18n.setLocale(language)

    const walletsUrl = `${process.env.FRONTEND_HOST}/#/profile/wallets`
    const currency = String(details.wallet?.currency || 'usd').toLowerCase()
    const symbol = currencyInfo[currency as keyof typeof currencyInfo]?.symbol || '$'
    const walletName = details.wallet?.name || `Wallet #${details.wallet?.id ?? ''}`
    const walletOrderIds = details.steps?.map((s) => s.walletOrderId).join(', ') || '-'

    try {
      return await request(to, i18n.__('mail.wallet.balanceRefunded.subject'), [
        {
          type: 'text/html',
          value: tableContentEmailTemplate(
            i18n.__('mail.wallet.balanceRefunded.intro', {
              name: user.name || user.username || 'Gitpay User'
            }),
            i18n.__('mail.wallet.balanceRefunded.content', {
              walletName,
              reason: i18n.__('mail.wallet.balanceRefunded.reason.inactivity')
            }),
            {
              headers: ['Field', 'Value'],
              rows: [
                ['Wallet', walletName],
                ['Wallet ID', String(details.wallet?.id ?? '-')],
                ['Previous balance', `${symbol} ${details.previousBalance}`],
                ['Refund amount', `${symbol} ${details.refundAmount}`],
                ['Resulting balance', `${symbol} ${details.resultingBalance}`],
                ['Wallet order(s)', walletOrderIds],
                ['Reason', i18n.__('mail.wallet.balanceRefunded.reason.inactivity')]
              ]
            },
            i18n.__('mail.wallet.balanceRefunded.footer'),
            {
              link: walletsUrl,
              text: i18n.__('mail.wallet.balanceRefunded.cta')
            } as ActionButton
          )
        }
      ])
    } catch (error) {
      console.error('Error sending wallet balance refund email:', error)
    }
  }
}

export default WalletMail

module.exports = WalletMail
