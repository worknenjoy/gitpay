const models = require('../../models')
const i18n = require('i18n')
const moment = require('moment')
const SendMail = require('../mail/mail')
const WalletMail = require('../mail/wallet')
const stripe = require('../../client/payment/stripe').default()
const { FAILED_REASON, CURRENCIES, formatStripeAmount } = require('./constants')

module.exports = async function chargeFailed(event, paid, status, req, res) {
  return models.Order.update(
    {
      paid: paid,
      status: status
    },
    {
      where: {
        source_id: event.data.object.source.id,
        source: event.data.object.id
      },
      returning: true
    }
  )
    .then((order) => {
      if (order[0]) {
        models.User.findOne({
          where: {
            id: order[1][0].dataValues.userId
          }
        }).then((user) => {
          if (user) {
            if (status === 'failed') {
              const language = user.language || 'en'
              i18n.setLocale(language)
              SendMail.error(
                user.dataValues,
                i18n.__('mail.webhook.payment.unapproved.subject'),
                i18n.__('mail.webhook.payment.unapproved.message', {
                  reason: FAILED_REASON[event.data.object.outcome.network_status]
                })
              )
              return res.status(200).json(event)
            }
          }
        })
      }
    })
    .catch((e) => {
      return res.status(400).send(e)
    })
}
