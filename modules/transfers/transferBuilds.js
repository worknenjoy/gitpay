const Transfer = require('../../models').Transfer
const Task = require('../../models').Task
const Order = require('../../models').Order
const Promise = require('bluebird')
const { orderDetails } = require('../orders')
const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_KEY)
const TransferMail = require('../mail/transfer')
const models = require('../../models')

module.exports = Promise.method(async function transferBuilds (params) {
  const existingTransfer = params.transfer_id && await Transfer.findOne({
    where: {
      transfer_id: params.transfer_id
    }
  })

  if (existingTransfer) {
    return { error: 'This transfer already exists' }
  }

  const existingTask = params.taskId && await Transfer.findOne({
    where: {
      taskId: params.taskId
    }
  })

  if (existingTask) {
    return { error: 'Only one transfer for an issue' }
  }

  const task = params.taskId && await Task.findOne({
    where: {
      id: params.taskId
    },
    include: [Order, models.User]
  })

  const taskData = task.dataValues

  if (!taskData) return { error: 'No valid task' }

  if (!taskData.assigned) {
    return { error: 'No user assigned' }
  }

  const assign = await models.Assign.findOne({
    where: {
      id: taskData.assigned
    },
    include: [ models.User ]
  })

  let finalValue = 0
  let isStripe = false
  let isPaypal = false
  let isMultiple = false

  let allStripe = true
  let allPaypal = true

  let stripeTotal = 0
  let paypalTotal = 0

  if (!taskData) {
    return new Error('Task not found')
  }
  if (taskData.Orders.length === 0) {
    return { error: 'No orders found' }
  }
  else {
    const orders = taskData.Orders
    const ordersPaid = orders.find(order => order.paid === true)
    if (!ordersPaid) {
      return { error: 'All orders must be paid' }
    }
    orders.map(order => {
      if (order.provider === 'stripe') {
        allPaypal = false
        isStripe = true
        if(order.paid) stripeTotal += parseFloat(order.amount)
      }
      if (order.provider === 'paypal') {
        allStripe = false
        isPaypal = true
        if(order.paid) paypalTotal += parseFloat(order.amount)
      }
      if(order.paid) finalValue += parseFloat(order.amount)
    })
    if (isStripe && isPaypal) {
      isMultiple = true
    }
  }
  const transfer = await Transfer.build({
    status: 'pending',
    value: finalValue,
    transfer_id: params.transfer_id,
    transfer_method: (isMultiple && 'multiple') || (isStripe && 'stripe') || (isPaypal && 'paypal'),
    taskId: params.taskId,
    userId: taskData.User.dataValues.id,
    to: assign.dataValues.User.id,
  }).save()
  const taskUpdate = await Task.update({ TransferId: transfer.id }, {
    where: {
      id: params.taskId
    }
  })
  if (!taskUpdate[0]) {
    return { error: 'Task not updated' }
  }

  if (stripeTotal > 0) {
    const assign = await models.Assign.findOne({
      where: {
        id: taskData.assigned
      },
      include: [ models.User ]
    })
    const user = assign.dataValues.User.dataValues
    const dest = user.account_id
    if (!dest) {
      TransferMail.paymentForInvalidAccount(user)
      return transfer
    }
    const centavosAmount = finalValue * 100
    let transferData = {
      amount: centavosAmount * 0.92, // 8% base fee
      currency: 'usd',
      destination: dest,
      source_type: 'card',
      transfer_group: `task_${taskData.id}`
    }

    const stripeTransfer = await stripe.transfers.create(transferData)
    if (stripeTransfer) {
      const updateTask = await models.Task.update({ transfer_id: stripeTransfer.id }, {
        where: {
          id: params.taskId
        }
      })
      const updateTransfer = await models.Transfer.update({ transfer_id: stripeTransfer.id, status: 'in_transit' }, {
        where: {
          id: transfer.id
        },
        returning: true

      })
      if (!updateTask || !updateTransfer) {
        TransferMail.error(user, task, task.value)
        return { error: 'update_task_reject' }
      }
      const taskOwner = await models.User.findByPk(taskData.userId)
      TransferMail.notifyOwner(taskOwner.dataValues, taskData, taskData.value)
      TransferMail.success(user, taskData, taskData.value)
      return updateTransfer[1][0].dataValues
    }
  }
  return transfer
})
