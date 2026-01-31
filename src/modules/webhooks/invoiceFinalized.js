const models = require('../../models')
const i18n = require('i18n')
const moment = require('moment')
const SendMail = require('../mail/mail')
const WalletMail = require('../mail/wallet')
const stripe = require('../../shared/stripe/stripe')()
const { FAILED_REASON, CURRENCIES, formatStripeAmount } = require('./constants')

module.exports = async function invoiceFinalized(event, req, res) {
  try {
    const invoice = event.data.object
    const invoiceId = invoice.id
    const walletOrder = await models.WalletOrder.findOne({
      where: {
        source: invoiceId
      },
      include: [
        {
          model: models.Wallet,
          include: [models.User]
        }
      ]
    })
    if (walletOrder?.id) {
      WalletMail.invoiceCreated(invoice, walletOrder, walletOrder.Wallet.User)
      return res.status(200).json(event)
    }
    return res.status(200).json(event)
  } catch (error) {
    console.log('error', error)
    return res.status(200).json(event)
  }
}
