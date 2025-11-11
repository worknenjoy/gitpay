const models = require('../../../models')
const i18n = require('i18n')
const moment = require('moment')
const SendMail = require('../../mail/mail')
const WalletMail = require('../../mail/wallet')
const stripe = require('../../shared/stripe/stripe')()
const { FAILED_REASON, CURRENCIES, formatStripeAmount } = require('../constants')

module.exports = async function chargeRefunded(event, paid, status, req, res) {
  return models.Order.update(
    {
      paid: false,
      status: 'refunded'
    },
    {
      where: {
        source_id: event.data.object.source.id,
        source: event.data.object.id
      },
      returning: true
    }
  )
    .then(order => {
      if (order[0]) {
        return models.User.findOne({
          where: {
            id: order[1][0].dataValues.userId
          }
        })
          .then(user => {
            if (user) {
              if (paid && status === 'succeeded') {
                const language = user.language || 'en'
                i18n.setLocale(language)
                SendMail.success(
                  user.dataValues,
                  i18n.__('mail.webhook.payment.refund.subject'),
                  i18n.__('mail.webhook.payment.refund.message', { amount: event.data.object.amount / 100 })
                )
              }
            }
            return res.status(200).json(event);
          })
          .catch(e => {
            return res.status(400).send(e)
          })
      }
    })
    .catch(e => {
      return res.status(400).send(e)
    })
}
