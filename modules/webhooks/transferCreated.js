const models = require('../../models');
const i18n = require('i18n');
const moment = require('moment');
const SendMail = require('../mail/mail');
const WalletMail = require('../mail/wallet');
const stripe = require('../shared/stripe/stripe')();
const { FAILED_REASON, CURRENCIES, formatStripeAmount } = require('./constants');

module.exports = async function transferCreated(event, req, res) {
        models.Transfer.findOne({
          where: {
            transfer_id: event.data.object.id
          }
        }).then(existingTransfer => {
          if (existingTransfer) {
            if(existingTransfer.transfer_method === 'stripe') existingTransfer.status = 'created'
            if(existingTransfer.transfer_method === 'multiple') existingTransfer.status = 'pending'
            return existingTransfer.save().then(t => t)
          }
        })
        
        return models.Task.findOne({
          where: {
            transfer_id: event.data.object.id
          },
          include: [models.User]
        }).then(task => {
          if (task) {
            return models.Assign.findOne({
              where: {
                id: task.dataValues.assigned
              },
              include: [models.User]
            })
              .then(assigned => {
                const language = assigned.dataValues.User.language || 'en'
                i18n.setLocale(language)
                SendMail.success(
                  assigned.dataValues.User.dataValues,
                  i18n.__('mail.webhook.payment.transfer.subject'),
                  i18n.__('mail.webhook.payment.transfer.message', {
                    amount: event.data.object.amount / 100,
                    url: `${process.env.FRONTEND_HOST}/#/task/${task.id}`
                  })
                )
                return res.status(200).json(event);
              })
              .catch(e => {
                return res.status(400).send(e)
              })
          }
          else {
            stripe.accounts.retrieve(event.data.object.destination).then(async (account) => {
              const user = await models.User.findOne({
                where: {
                  email: account.email
                }
              })
              if (user) {
                const language = user.language || 'en'
                i18n.setLocale(language)
              }
              SendMail.success(
                account.email,
                i18n.__('mail.webhook.payment.transfer.subject'),
                i18n.__('mail.webhook.payment.transfer.message', {
                  amount: event.data.object.amount / 100,
                  url: `${event.data.object.id}`
                })
              )
              return res.status(200).json(event);
            }).catch(e => {
              return res.status(400).send(e)
            })
          }
        })
}
