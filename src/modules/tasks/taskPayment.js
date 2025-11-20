const Promise = require('bluebird')
const models = require('../../models')
const TransferMail = require('../mail/transfer')

const stripe = require('../shared/stripe/stripe')()

module.exports = Promise.method(function taskPayment(paymentParams) {
  return models.Task.findOne(
    {
      where: {
        id: paymentParams.taskId,
      },
    },
    { include: [models.User, models.Order, models.Assign] },
  ).then((task) => {
    if (!task) {
      throw new Error('find_task_error')
    }

    return models.Assign.findOne({
      where: {
        id: task.assigned,
      },
      include: [models.User],
    }).then(async (assign) => {
      const user = assign.dataValues.User.dataValues

      const dest = user.account_id
      if (!dest) {
        TransferMail.paymentForInvalidAccount(user)
        throw new Error('account_destination_invalid')
      }
      const centavosAmount = paymentParams.value * 100 || task.value * 100

      let transferData = {
        amount: centavosAmount * 0.92, // 8% base fee
        currency: 'usd',
        destination: dest,
        source_type: 'card',
      }

      const order = await models.Order.findOne({ where: { TaskId: task.id } })
      const coupon = await models.Coupon.findOne({ where: { id: order.couponId } })

      if (!coupon || (coupon && coupon.amount < 100)) {
        transferData['transfer_group'] = task.transfer_group
          ? task.transfer_group
          : `task_${task.id}`
      }

      return stripe.transfers.create(transferData).then((transfer) => {
        if (transfer) {
          return models.Task.update(
            { transfer_id: transfer.id },
            {
              where: {
                id: task.id,
              },
            },
          ).then((update) => {
            if (!update) {
              TransferMail.error(user, task, task.value)
              throw new Error('update_task_reject')
            }
            return models.User.findByPk(task.userId).then((taskOwner) => {
              TransferMail.notifyOwner(taskOwner.dataValues, task, task.value)
              TransferMail.success(user, task, task.value)
              return transfer
            })
          })
        }
      })
    })
  })
})
