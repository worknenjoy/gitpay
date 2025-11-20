const emailTemplate = require('./templates/main-content')
const constants = require('./constants')
const request = require('./request')
const i18n = require('i18n')

const WalletMail = {
  invoiceCreated: (invoice, wallet, user) => {
    // Send email to user
  },
}

if (constants.canSendEmail) {
  WalletMail.invoiceCreated = (invoice, walletOrder, user) => {
    const to = user.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    request(
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
              walletName: walletOrder.Wallet.name,
            }),
            i18n.__('mail.webhook.wallet.invoice.button'),
            invoice.hosted_invoice_url,
            '',
            i18n.__('mail.webhook.wallet.invoice.footer'),
          ),
        },
      ],
      constants.notificationEmail,
    )
  }
}

module.exports = WalletMail
