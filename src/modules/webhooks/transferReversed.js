const models = require('../../models')
const i18n = require('i18n')
const moment = require('moment')
const SendMail = require('../mail/mail')
const stripe = require('../shared/stripe/stripe')()

module.exports = async function transferReversed(event, req, res) {
  const transferId = event.data.object.id
  const metadata = event.data.object.metadata || {}
  const { payment_request_id: paymentRequestId, user_id: userId } = metadata

  if (paymentRequestId) {
    try {
      const paymentRequestTransfer = await models.PaymentRequestTransfer.findOne({
        where: {
          transfer_id: transferId,
          paymentRequestId: paymentRequestId,
          userId: userId
        }
      })

      if (paymentRequestTransfer) {
        paymentRequestTransfer.status = 'reversed'
        await paymentRequestTransfer.save()
      }

      return res.status(200).json(event)
    } catch (error) {
      console.error('Error updating payment request transfer to reversed:', error)
      return res.status(200).json(event)
    }
  }

  try {
    const existingTransfer = await models.Transfer.findOne({
      where: {
        transfer_id: transferId
      }
    })

    if (existingTransfer) {
      if (existingTransfer.transfer_method === 'stripe') existingTransfer.status = 'reversed'
      if (existingTransfer.transfer_method === 'multiple') existingTransfer.status = 'failed'
      await existingTransfer.save()
    }

    const task = await models.Task.findOne({
      where: {
        transfer_id: event.data.object.id
      },
      include: [models.User]
    })

    if (task) {
      try {
        const assigned = await models.Assign.findOne({
          where: {
            id: task.dataValues.assigned
          },
          include: [models.User]
        })

        const language = assigned.dataValues.User.language || 'en'
        i18n.setLocale(language)
        SendMail.error(
          assigned.dataValues.User,
          i18n.__('mail.webhook.payment.transfer.reversed.subject'),
          i18n.__('mail.webhook.payment.transfer.reversed.message', {
            currency: event.data.object.currency.toUpperCase(),
            amount: (event.data.object.amount / 100).toFixed(2),
            date: moment(new Date()).format('LLL'),
            url: `${process.env.FRONTEND_HOST}/#/task/${task.id}`
          })
        )
        return res.status(200).json(event)
      } catch (e) {
        console.error('Error sending transfer reversed email:', e)
        return res.status(200).json(event)
      }
    } else {
      return res.status(200).json(event)
    }
  } catch (e) {
    console.error('Error processing transfer reversed webhook:', e)
    return res.status(400).send(e)
  }
}
