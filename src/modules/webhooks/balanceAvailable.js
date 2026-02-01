const models = require('../../models')
const i18n = require('i18n')
const moment = require('moment')
const SendMail = require('../mail/mail')
const WalletMail = require('../mail/wallet')
const stripe = require('../../client/payment/stripe').default()
const { FAILED_REASON, CURRENCIES, formatStripeAmount } = require('./constants')

module.exports = async function balanceAvailable(event, req, res) {
  SendMail.success(
    { email: 'tarefas@gitpay.me' },
    'New balance on your account',
    `
                  <p>We have a new balance:</p>
                  <ul>
                  ${event.data.object.available.map((b) => `<li>${b.currency}: ${b.amount}</li>`).join('')}
                  </ul>
              `
  )
  return res.status(200).json(event)
}
