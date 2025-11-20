const Promise = require('bluebird')
const models = require('../../models')
const stripe = require('../shared/stripe/stripe')()

// @TODO added variable data
const data = 1

module.exports = Promise.method(function taskTransfer(taskParameters) {
  return models.Task.findOne(
    {
      where: {
        id: taskParameters.id,
      },
    },
    { include: [models.User, models.Order, models.Assign] },
  ).then((task) => {
    if (!task) {
      throw new Error('find_task_error')
    }
    return models.User.findOne({
      where: {
        id: data.id,
      },
    }).then((user) => {
      const dest = user.account_id
      if (!dest) {
        return new Error('account_destination_invalid')
      }

      return stripe.transfers.retrieve(task.transfer_id).then((transfer) => {
        if (transfer) {
          return models.Task.update(
            { paid: true, transfer_id: transfer.id },
            {
              where: {
                id: data.id,
              },
            },
          ).then((update) => {
            if (!update) {
              return new Error('update_task_reject')
            }
            return transfer
          })
        }
      })
    })
  })
})
