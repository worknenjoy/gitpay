import emailTemplate from './templates/main-content'
import * as constants from './constants'
import request from './request'
import i18n from 'i18n'

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
  }
}

export default WalletMail

module.exports = WalletMail
