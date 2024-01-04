const Transfer = require('../../models').Transfer
const Task = require('../../models').Task
const Order = require('../../models').Order
const Promise = require('bluebird')

module.exports = Promise.method(async function transferBuilds(params) {
  const task = await Task.findOne({
    where: {
      id: params.taskId
    },
    include: [Order]
  })

  const taskData = task.dataValues

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
  return transfer
})
