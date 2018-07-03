const PaymentMail = require('../mail/payment')
const Promise = require('bluebird')
const models = require('../../loading/loading')

module.exports = Promise.method(function orderUpdate (orderParameters) {
  return models.Order
    .update({
      payer_id: orderParameters.PayerID,
      paid: orderParameters.paymentId && orderParameters.PayerID ? true : false,
      status: orderParameters.paymentId && orderParameters.PayerID ? 'succeeded' : 'fail'
    }, {
      where: {
        source_id: orderParameters.paymentId
      },
      returning: true,
      plain: true
    }).then(order => {
      const orderData = order[1].dataValues
      return Promise.all([models.User.findById(orderData.userId), models.Task.findById(orderData.TaskId)]).spread((user, task) => {
        PaymentMail.success(user.dataValues.email, task, orderData.amount)
        if(task.dataValues.assigned) {
          const assignedId = task.dataValues.assigned
          return models.Assign.findById(assignedId, {
            include: [models.User]
          }).then(assign => {
            PaymentMail.assigned(assign.dataValues.User.dataValues.email, task, order.amount)
            return orderData
          })
        }
        return orderData
      })
      return orderData
    })
})
