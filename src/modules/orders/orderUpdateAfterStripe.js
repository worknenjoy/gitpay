const Promise = require('bluebird')
const PaymentMail = require('../mail/payment')
const models = require('../../models')
const { notifyBountyWithErrorHandling } = require('../slack')

module.exports = Promise.method(
  function orderUpdateAfterStripe(order, charge, card, orderParameters, user, task, couponFull) {
    const orderPayload = couponFull
      ? {
          paid: true,
          status: 'succeeded'
        }
      : {
          source: charge.id,
          source_id: card.id,
          paid: charge.paid,
          status: charge.status
        }

    return models.Order.update(orderPayload, {
      where: {
        id: order.dataValues.id
      }
    })
      .then(async (_updatedOrder) => {
        if (orderParameters.plan === 'full') {
          PaymentMail.support(user, task, order)
        }
        PaymentMail.success(user, task, order.amount)

        // Send Slack notification for new bounty payment
        if (orderPayload.paid && orderPayload.status === 'succeeded') {
          const orderData = {
            amount: order.amount || orderParameters.amount,
            currency: order.currency || orderParameters.currency || 'USD'
          }
          await notifyBountyWithErrorHandling(task, orderData, user, 'Stripe payment')
        }

        if (task.dataValues.assigned) {
          const assignedId = task.dataValues.assigned
          return models.Assign.findByPk(assignedId, {
            include: [models.User]
          }).then((assign) => {
            PaymentMail.assigned(assign.dataValues.User.dataValues.email, task, order.amount)
            return task
          })
        }
        return task
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err)
        throw err
      })
  }
)
