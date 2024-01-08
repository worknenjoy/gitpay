const Transfer = require('../../models').Transfer
const Task = require('../../models').Task
const Order = require('../../models').Order
const Promise = require('bluebird')

module.exports = Promise.method(async function transferBuilds(params) {

  const existingTransfer = params.transfer_id && await Transfer.findOne({
    where: {
      transfer_id: params.transfer_id
    }
  })

  if(existingTransfer) {
    return { error: 'This transfer already exists' }
  }

  const existingTask = params.taskId && await Transfer.findOne({
    where: {
      taskId: params.taskId
    }
  })

  if(existingTask) {
    return { error: 'Only one transfer for an issue' }
  }

  const task = params.taskId && await Task.findOne({
    where: {
      id: params.taskId
    },
    include: [Order]
  })

  const taskData = task.dataValues

  if(!taskData) return { error: 'No valid task' }

  if(!taskData.assigned) {
    return { error: 'No user assigned' }
  }
  let finalValue = 0
  if(!taskData) {
    return new Error('Task not found')
  }
  if(taskData.Orders.length === 0) {
    return { error: 'No orders found' }
  } else {
    const orders = taskData.Orders
    orders.map( order => {
      finalValue += order.amount
    })
  }
  const transfer = await Transfer.build({
    status: 'pending',
    value: finalValue,
    transfer_id: params.transfer_id,
    transfer_method: params.transfer_method,
    taskId: params.taskId
  }).save()
  const taskUpdate = await Task.update({ TransferId: transfer.id }, {
    where: {
      id: params.taskId
    }
  })
  if(!taskUpdate[0]) {
    return { error: 'Task not updated' }
  }
  return transfer
})
