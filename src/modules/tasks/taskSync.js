const Promise = require('bluebird')
const Decimal = require('decimal.js')
const models = require('../../models')

module.exports = Promise.method(function taskSync(taskParameters) {
  // eslint-disable-next-line no-console
  return models.Task.findByPk(taskParameters.id, {
    include: [models.Order]
  }).then((task) => {
    if (!task) {
      throw new Error('Task not found')
    }
    let finalValue = {
      available: new Decimal(0),
      pending: new Decimal(0),
      failed: new Decimal(0),
      card: new Decimal(0),
      paypal: new Decimal(0),
      transferred: new Decimal(0)
    }
    task.dataValues.Orders.map((item) => {
      const decimalAmount = new Decimal(item.amount)
      if (item.status === 'open') {
        finalValue.pending.plus(decimalAmount)
      } else if (item.paid) {
        finalValue.available = Decimal.add(finalValue.available, decimalAmount)
        if (item.provider === 'paypal') {
          finalValue.paypal = Decimal.add(finalValue.paypal, decimalAmount)
        } else {
          finalValue.card = Decimal.add(finalValue.card, decimalAmount)
        }
        if (item.transfer_id) {
          finalValue.transferred = Decimal.add(finalValue.transferred, decimalAmount)
        }
      } else {
        finalValue.failed = Decimal.add(finalValue.failed, decimalAmount)
      }
    })

    const paidPaypal = !!(
      finalValue.paypal.equals(0) || finalValue.transferred.equals(finalValue.available)
    )
    const paidStripe = !!task.transfer_id
    const paid = paidPaypal && paidStripe

    let taskAttributes = { value: finalValue.available, paid }
    if (paid) {
      taskAttributes.status = 'closed'
    }

    return task
      .set(taskAttributes)
      .save()
      .then((updatedTask) => {
        if (updatedTask) {
          return {
            value: finalValue
          }
        }
      })
  })
})
