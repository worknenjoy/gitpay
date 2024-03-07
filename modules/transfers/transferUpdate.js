const Transfer = require('../../models').Transfer
const Promise = require('bluebird')
const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_KEY)
const TransferMail = require('../mail/transfer')
const models = require('../../models')

module.exports = Promise.method(async function transferUpdate(params) {
  const existingTransfer = params.id && await Transfer.findOne({
    where: {
      id: params.id
    },
    include: [models.User, models.Task]
  })

  if (!existingTransfer) {
    return { error: 'No transfer found' }
  }

  const destination = await models.User.findOne({
    where: {
      id: existingTransfer.dataValues.to
    }
  })

  if (existingTransfer && destination.account_id && existingTransfer.status === 'pending') {
    const finalValue = existingTransfer.dataValues.value
    const centavosAmount = finalValue * 100
    const transferData = {
      amount: centavosAmount * 0.92, // 8% base fee
      currency: 'usd',
      destination: destination.account_id,
      source_type: 'card',
      transfer_group: `task_${existingTransfer.taskId}`
    }
    let stripeTransfer = existingTransfer.transfer_id && await stripe.transfers.retrieve(existingTransfer.transfer_id)
    stripeTransfer = await stripe.transfers.create(transferData)
    if (stripeTransfer) {
      const updateTask = await models.Task.update({ transfer_id: stripeTransfer.id }, {
        where: {
          id: existingTransfer.taskId
        }
      })
      const updateTransfer = await models.Transfer.update({ transfer_id: stripeTransfer.id, status: 'in_transit' }, {
        where: {
          id: existingTransfer.id
        },
        returning: true

      })
      const { value, Task: task, User: user } = existingTransfer
      if (!updateTask || !updateTransfer) {
        TransferMail.error(user, task, task.value)
        return { error: 'update_task_reject' }
      }
      const taskOwner = await models.User.findByPk(task.userId)
      TransferMail.notifyOwner(taskOwner.dataValues, task, value)
      TransferMail.success(user, task, value)
      return updateTransfer[1][0].dataValues
    }
  }
  return existingTransfer
})
