const models = require('../../models')
const i18n = require('i18n')
const moment = require('moment')
const SendMail = require('../mail/mail')
const stripe = require('../shared/stripe/stripe')()

module.exports = async function transferCreated(event, req, res) {
  const transferId = event.data.object.id
  const destination = event.data.object.destination
  const metadata = event.data.object.metadata || {}
  const { payment_request_id: paymentRequestId, user_id: userId } = metadata

  if (paymentRequestId) {
    try {
      const paymentRequestTransfer = await models.PaymentRequestTransfer.create({
        transfer_id: transferId,
        paymentRequestId: paymentRequestId,
        userId: userId,
        value: event.data.object.amount / 100,
        status: 'created',
        transfer_method: 'stripe',
      })
      return res.status(200).json(event)
    } catch (error) {
      console.error('Error creating payment request transfer:', error)
      return res.status(200).json(event)
    }
  }

  try {
    const existingTransfer = await models.Transfer.findOne({
      where: {
        transfer_id: transferId,
      },
    })

    if (existingTransfer) {
      if (existingTransfer.transfer_method === 'stripe') existingTransfer.status = 'created'
      if (existingTransfer.transfer_method === 'multiple') existingTransfer.status = 'pending'
      await existingTransfer.save()
    }

    const task = await models.Task.findOne({
      where: {
        transfer_id: event.data.object.id,
      },
      include: [models.User],
    })

    if (task) {
      try {
        const assigned = await models.Assign.findOne({
          where: {
            id: task.dataValues.assigned,
          },
          include: [models.User],
        })

        const language = assigned.dataValues.User.language || 'en'
        i18n.setLocale(language)

        SendMail.success(
          assigned.dataValues.User.dataValues,
          i18n.__('mail.webhook.payment.transfer.subject'),
          i18n.__('mail.webhook.payment.transfer.message', {
            amount: event.data.object.amount / 100,
            url: `${process.env.FRONTEND_HOST}/#/task/${task.id}`,
          }),
        )
        return res.status(200).json(event)
      } catch (e) {
        return res.status(400).send(e)
      }
    } else {
      try {
        const account = await stripe.accounts.retrieve(destination)
        if (account || account.email) {
          const user = await models.User.findOne({
            where: {
              email: account.email,
            },
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
              url: `${event.data.object.id}`,
            }),
          )
        }
        return res.status(200).json(event)
      } catch (e) {
        console.log('Error retrieving account:', e)
        return res.status(200).send(event)
      }
    }
  } catch (e) {
    console.log('Error processing transfer created event:', e)
    return res.status(200).send(event)
  }
}
