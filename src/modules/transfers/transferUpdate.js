const Transfer = require('../../models').Transfer
const Promise = require('bluebird')
const requestPromise = require('request-promise')
const stripe = require('../shared/stripe/stripe')()
const TransferMail = require('../mail/transfer')
const models = require('../../models')

module.exports = Promise.method(async function transferUpdate(params) {
  let existingTransfer =
    params.id &&
    (await Transfer.findOne({
      where: {
        id: params.id
      },
      include: [
        {
          model: models.User,
          as: 'User'
        },
        models.Task
      ]
    }))

  if (!existingTransfer) {
    return { error: 'No transfer found' }
  }

  const destination = await models.User.findOne({
    where: {
      id: existingTransfer.dataValues.to
    }
  })

  if (
    existingTransfer &&
    destination.account_id &&
    existingTransfer.status === 'pending' &&
    (existingTransfer.transfer_method === 'multiple' ||
      existingTransfer.transfer_method === 'stripe') &&
    existingTransfer.stripe_transfer_amount &&
    !existingTransfer.transfer_id
  ) {
    const finalValue = existingTransfer.dataValues.stripe_transfer_amount
    const centavosAmount = finalValue * 100

    const transferData = {
      amount: Math.floor((centavosAmount * 92) / 100), // 8% base fee
      currency: 'usd',
      destination: destination.account_id,
      source_type: 'card',
      transfer_group: `task_${existingTransfer.taskId}`
    }
    let stripeTransfer =
      existingTransfer.transfer_id &&
      (await stripe.transfers.retrieve(existingTransfer.transfer_id))
    stripeTransfer = await stripe.transfers.create(transferData)
    if (stripeTransfer) {
      const updateTask = await models.Task.update(
        { transfer_id: stripeTransfer.id },
        {
          where: {
            id: existingTransfer.taskId
          }
        }
      )
      const updateTransfer = await models.Transfer.update(
        {
          transfer_id: stripeTransfer.id,
          status: existingTransfer.transfer_method === 'stripe' ? 'in_transit' : 'pending'
        },
        {
          where: {
            id: existingTransfer.id
          },
          returning: true
        }
      )
      const { value, Task: task, User: user } = existingTransfer
      if (!updateTask || !updateTransfer) {
        TransferMail.error(user, task, task.value)
        return { error: 'update_task_reject' }
      }
      const taskOwner = await models.User.findByPk(task.userId)
      TransferMail.notifyOwner(taskOwner.dataValues, task, value)
      TransferMail.success(user, task, value)
      existingTransfer = updateTransfer[1][0].dataValues
    }
  }
  if (
    existingTransfer &&
    !existingTransfer.paypal_payout_id &&
    existingTransfer.paypal_transfer_amount &&
    (existingTransfer.transfer_method === 'multiple' ||
      existingTransfer.transfer_method === 'paypal') &&
    destination.paypal_id
  ) {
    const paypalCredentials = await requestPromise({
      method: 'POST',
      uri: `${process.env.PAYPAL_HOST}/v1/oauth2/token`,
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'en_US',
        Authorization:
          'Basic ' +
          Buffer.from(process.env.PAYPAL_CLIENT + ':' + process.env.PAYPAL_SECRET).toString(
            'base64'
          ),
        'Content-Type': 'application/json',
        grant_type: 'client_credentials'
      },
      form: {
        grant_type: 'client_credentials'
      }
    })
    const paypalToken = JSON.parse(paypalCredentials)['access_token']

    try {
      const paypalTransfer =
        !existingTransfer.paypal_payout_id &&
        (await requestPromise({
          method: 'POST',
          uri: `${process.env.PAYPAL_HOST}/v1/payments/payouts`,
          headers: {
            Accept: '*/*',
            'Accept-Language': 'en_US',
            Prefer: 'return=representation',
            Authorization: 'Bearer ' + paypalToken,
            'Content-Type': 'application/json'
          },
          body: {
            sender_batch_header: {
              email_subject: 'You have a payment'
            },
            items: [
              {
                recipient_type: 'EMAIL',
                amount: {
                  value: (existingTransfer.dataValues.paypal_transfer_amount * 0.92).toFixed(2),
                  currency: 'USD'
                },
                receiver: destination.email,
                note: 'Thank you.',
                sender_item_id: 'item_1'
              }
            ]
          },
          json: true
        }))
      if (paypalTransfer) {
        existingTransfer.paypal_payout_id = paypalTransfer.batch_header.payout_batch_id
        existingTransfer.status =
          existingTransfer.transfer_method === 'paypal' ? 'in_transit' : 'pending'
        existingTransfer.save()
      }
    } catch (error) {
      console.error('Error fetching PayPal transfer:', error)
    }
  }

  const updateTransferStatus =
    existingTransfer.transfer_method === 'multiple' &&
    existingTransfer.transfer_id &&
    existingTransfer.paypal_payout_id &&
    (await models.Transfer.update(
      { status: 'in_transit' },
      { where: { id: existingTransfer.id }, returning: true }
    ))
  if (updateTransferStatus && updateTransferStatus[1]) {
    existingTransfer = updateTransferStatus[1][0].dataValues
  }
  return existingTransfer
})
