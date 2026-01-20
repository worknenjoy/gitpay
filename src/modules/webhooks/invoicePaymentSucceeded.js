const models = require('../../models')
const i18n = require('i18n')
const moment = require('moment')
const SendMail = require('../mail/mail')
const WalletMail = require('../mail/wallet')
const stripe = require('../shared/stripe/stripe')()
const { FAILED_REASON, CURRENCIES, formatStripeAmount } = require('./constants')
const slack = require('../slack')

module.exports = async function invoicePaymentSucceeded(event, req, res) {
  return models.User.findOne({
    where: { email: event.data.object.customer_email }
  })
    .then((userFound) => {
      if (!userFound) {
        return models.User.create({
          email: event.data.object.customer_email,
          name: event.data.object.customer_name,
          country: event.data.object.account_country,
          customer_id: event.data.object.customer[0],
          active: false
        }).then(async (user) => {
          await user.addType(await models.Type.find({ name: 'funding' }))
          const source_id = event.data.object.id[0]
          if (source_id) {
            return models.Order.update(
              {
                status: event.data.object.status,
                source: event.data.object.charge[0],
                paid: true,
                userId: user.dataValues.id
              },
              {
                where: {
                  source_id: event.data.object.id[0]
                },
                returning: true
              }
            ).then(async (order) => {
              // Send Slack notification for invoice payment completion
              if (order[0] && order[1].length) {
                const orderUpdated = await models.Order.findOne({
                  where: {
                    id: order[1][0].dataValues.id
                  },
                  include: [models.Task, models.User]
                })

                if (orderUpdated && orderUpdated.Task && orderUpdated.User) {
                  const orderData = {
                    amount: orderUpdated.amount,
                    currency: orderUpdated.currency || 'USD'
                  }
                  await slack.notifyBountyWithErrorHandling(
                    orderUpdated.Task,
                    orderData,
                    orderUpdated.User,
                    'Stripe invoice payment succeeded'
                  )
                }
              }
              return res.status(200).json(event)
            })
          }
          return res.status(200).json(event)
        })
      }
    })
    .catch((e) => {
      return res.status(400).send(e)
    })
}
