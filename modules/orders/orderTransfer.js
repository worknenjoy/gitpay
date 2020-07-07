const Promise = require('bluebird')
const models = require('../../models')
const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_KEY)
const TransferMail = require('../mail/transfer')

module.exports = Promise.method(function orderTransfer (transferParams, transferData) {
  return models.Order
    .findOne(
      { where: { id: transferParams.id }, include: [models.User, models.Task] }
    )
    .then((order) => {
      if (!order) throw new Error('no order found')
      if(transferParams.id && transferData.id) {
        const transferOrderId = transferParams.id
        const transferTaskId = transferData.id
        return models.Order
        .update({
          TaskId: transferTaskId,
          transfer_group: `task_${order.Task.dataValues.id}`
        }, {
          where: {
            id: transferOrderId
          },
          returning: true,
          plain: true
        }).then(orderUpdated => {
          // eslint-disable-next-line no-console
          console.log('order updated', orderUpdated)
          return orderUpdated
        }).catch(e => {
          // eslint-disable-next-line no-console
          console.log('order update error', e)
        })
      }
      return order
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log('error on order transfer', error)
      return false
    })
})
