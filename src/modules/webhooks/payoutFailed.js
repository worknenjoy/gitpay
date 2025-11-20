const models = require('../../models')
const i18n = require('i18n')
const moment = require('moment')
const SendMail = require('../mail/mail')
const WalletMail = require('../mail/wallet')
const stripe = require('../shared/stripe/stripe')()
const { FAILED_REASON, CURRENCIES, formatStripeAmount } = require('./constants')

module.exports = async function payoutFailed(event, req, res) {
  return models.User.findOne({
    where: {
      account_id: event.account
    }
  })
    .then((user) => {
      if (user) {
        const language = user.language || 'en'
        i18n.setLocale(language)
        SendMail.success(
          user.dataValues,
          i18n.__('mail.webhook.payment.transfer.intransit.fail.subject'),
          i18n.__('mail.webhook.payment.transfer.intransit.fail.message', {
            currency: CURRENCIES[event.data.object.currency],
            amount: event.data.object.amount / 100
          })
        )
        return res.status(200).json(event)
      }
    })
    .catch((e) => {
      return res.status(400).send(e)
    })
}
