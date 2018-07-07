const Promise = require('bluebird')
const models = require('../../loading/loading')

module.exports = Promise.method(function taskSync (taskParameters) {
  // eslint-disable-next-line no-console
  console.log('task parameters', taskParameters)
  return models.Task.findById(taskParameters.id, {
    include: [ models.Order ]
  }).then(task => {
    let finalValue = {
      available: 0,
      pending: 0,
      failed: 0,
      card: 0,
      paypal: 0,
      transferred: 0
    }
    task.dataValues.Orders.map(item => {
      if (item.status === 'open') {
        finalValue.pending += parseInt(item.amount)
      }
      else if (item.status === 'succeeded') {
        finalValue.available += parseInt(item.amount)
        if(item.provider === 'paypal') {
          finalValue.paypal += parseInt(item.amount)
        } else {
          finalValue.card += parseInt(item.amount)
        }
        if(item.transfer_id) {
          finalValue.transferred += parseInt(item.amount)
        }
      }
      else {
        finalValue.failed += parseInt(item.amount)
      }
    })

    const paid_paypal =  finalValue.paypal === 0 || finalValue.transferred === finalValue.available ? true : false
    const paid_stripe = task.transfer_id ? true : false
    const paid = paid_paypal && paid_stripe

    return task.updateAttributes({ value: finalValue.available, paid: paid }).then(updatedTask => {
      if (updatedTask) {
        return {
          value: finalValue
        }
      }
    })
  })
})
