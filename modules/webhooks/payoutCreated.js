const models = require('../../models');
const i18n = require('i18n');
const moment = require('moment');
const SendMail = require('../mail/mail');
const WalletMail = require('../mail/wallet');
const stripe = require('../shared/stripe/stripe')();
const { FAILED_REASON, CURRENCIES, formatStripeAmount } = require('./constants');

module.exports = async function payoutCreated(event, req, res) {
        return models.User.findOne({
          where: {
            account_id: event.account
          }
        })
          .then(async user => {
            if (user) {
              const existingPayout = await models.Payout.findOne({
                where: {
                  source_id: event.data.object.id
                }
              })

              if (existingPayout) return res.status(200).json(event);
                
              const payout = await models.Payout.build({
                userId: user.dataValues.id,
                amount: event.data.object.amount,
                currency: event.data.object.currency,
                status: event.data.object.status,
                source_id: event.data.object.id,
                description: event.data.object.description,
                method: event.data.object.type
              }).save()

              if (!payout) return res.status(400).send({ error: 'Error to create payout' })
              const date = new Date(event.data.object.arrival_date * 1000)
              const language = user.language || 'en'
              i18n.setLocale(language)
              SendMail.success(
                user.dataValues,
                i18n.__('mail.webhook.payment.transfer.intransit.subject'),
                i18n.__('mail.webhook.payment.transfer.intransit.message', {
                  currency: CURRENCIES[event.data.object.currency],
                  amount: event.data.object.amount / 100,
                  date: moment(date).format('LLL')
                })
              )
              return res.status(200).json(event);
            }
          })
          .catch(e => {
            return res.status(400).send(e)
          })

}
