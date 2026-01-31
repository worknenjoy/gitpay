const models = require('../../models')
const i18n = require('i18n')
const moment = require('moment')
const SendMail = require('../mail/mail')
const WalletMail = require('../mail/wallet')
const stripe = require('../../shared/stripe/stripe')()
const { FAILED_REASON, CURRENCIES, formatStripeAmount } = require('./constants')

module.exports = async function invoicePaymentFailed(event, req, res) {
  // eslint-disable-next-line no-case-declarations
  const walletOrderExists = await models.WalletOrder.findOne({
    where: {
      source: event.data.object.id
    }
  })
  if (!walletOrderExists) {
    const walletId = event.data.object.metadata.wallet_id
    const walletOrder =
      walletId &&
      (await models.WalletOrder.create({
        walletId,
        source_id: event.data.object.id,
        currency: event.data.object.currency,
        amount: formatStripeAmount(event.data.object.amount_due),
        description: `created wallet order from stripe invoice. ${event.data.object.description}`,
        source_type: 'stripe',
        source: event.data.object.id,
        ordered_in: new Date(),
        paid: false,
        status: event.data.object.status
      }))
  } else {
    const walletOrderUpdate = await models.WalletOrder.update(
      {
        status: event.data.object.status
      },
      {
        where: {
          source: event.data.object.id
        }
      }
    )
  }
  return res.status(200).json(event)
}
