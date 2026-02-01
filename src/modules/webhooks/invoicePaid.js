const models = require('../../models')
const i18n = require('i18n')
const moment = require('moment')
const SendMail = require('../mail/mail')
const WalletMail = require('../mail/wallet')
const stripe = require('../../client/payment/stripe').default()
const { FAILED_REASON, CURRENCIES, formatStripeAmount } = require('./constants')

module.exports = async function invoicePaid(event, req, res) {
  try {
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
    return res.status(200).json(event)
  } catch (error) {
    console.log('error', error)
    return res.status(200).json(event)
  }
}
