const models = require('../../models')
const i18n = require('i18n')
const moment = require('moment')
const SendMail = require('../mail/mail')
const WalletMail = require('../mail/wallet')
const stripe = require('../shared/stripe/stripe')()
const { FAILED_REASON, CURRENCIES, formatStripeAmount } = require('./constants')
const { handleAmount } = require('../util/handle-amount/handle-amount')

module.exports = async function payoutPaid(event, req, res) {
  return models.Payout.update(
    {
      status: event.data.object.status,
      paid: true,
    },
    {
      where: {
        source_id: event.data.object.id,
      },
    },
  ).then((updatedPayout) => {
    if (updatedPayout[0] === 0) return res.status(400).send({ error: 'Error to update payout' })
    return models.User.findOne({
      where: {
        account_id: event.account,
      },
    })
      .then((user) => {
        if (user) {
          const date = new Date(event.data.object.arrival_date * 1000)
          const language = user.language || 'en'
          i18n.setLocale(language)
          SendMail.success(
            user.dataValues,
            i18n.__('mail.webhook.payment.transfer.finished.subject'),
            i18n.__('mail.webhook.payment.transfer.finished.message', {
              currency: CURRENCIES[event.data.object.currency],
              amount: handleAmount(
                event.data.object.amount,
                0,
                'centavos',
                event.data.object.currency,
              ).decimal,
              date: date,
            }),
          )
          return res.status(200).json(event)
        }
      })
      .catch((e) => {
        console.log('error to find user', e)
        return res.status(400).send(e)
      })
  })
}
