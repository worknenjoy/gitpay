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
      failed: 0
    }
    task.dataValues.Orders.map(item => {
      if (item.status === 'open') {
        finalValue.pending += parseInt(item.amount)
      }
      else if (item.status === 'succeeded') {
        finalValue.available += parseInt(item.amount)
      }
      else {
        finalValue.failed += parseInt(item.amount)
      }
    })
    return task.updateAttributes({ value: finalValue.available }).then(updatedTask => {
      if (updatedTask) {
        return {
          value: finalValue
        }
      }
    })
  })
})
