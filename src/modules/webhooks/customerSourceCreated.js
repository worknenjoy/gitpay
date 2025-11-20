const models = require('../../models')
const i18n = require('i18n')
const moment = require('moment')
const SendMail = require('../mail/mail')
const WalletMail = require('../mail/wallet')
const stripe = require('../shared/stripe/stripe')()
const { FAILED_REASON, CURRENCIES, formatStripeAmount } = require('./constants')

module.exports = async function customerSourceCreated(event, req, res) {
  return models.User.findOne({
    where: {
      customer_id: event.data.object.customer,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(400).send({ errors: ['User not found'] })
      }
      const language = user.language || 'en'
      i18n.setLocale(language)
      if (event.data.object.name && event.data.object.last4) {
        SendMail.success(
          user.dataValues,
          i18n.__('mail.webhook.payment.success.subject'),
          i18n.__('mail.webhook.payment.success.message', {
            name: event.data.object.name,
            number: event.data.object.last4,
          }),
        )
      }
      return res.status(200).json(event)
    })
    .catch((error) => res.status(400).send(error))
}
