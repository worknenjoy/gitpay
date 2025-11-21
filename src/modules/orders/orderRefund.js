const models = require('../../models')
const PaymentMail = require('../mail/payment')
const requestPromise = require('request-promise')
const { handleAmount } = require('../util/handle-amount/handle-amount')
const stripe = require('../shared/stripe/stripe')()

module.exports = async function orderRefund(orderParams) {
  const order = await models.Order.findOne({
    where: { id: orderParams.id, userId: orderParams.userId },
    include: models.User
  })

  switch (order.provider) {
    case 'stripe': {
      const refundAmountExcludingFees = handleAmount(order.amount, 8, 'decimal').centavos
      const refund = await stripe.refunds.create({ charge: order.source, amount: refundAmountExcludingFees })
      if (refund && refund.id) {
        const orderUpdate = await models.Order.update(
          {
            status: 'refunded',
            refund_id: refund.id
          },
          {
            where: { id: order.id },
            returning: true,
            plain: true
          }
        )

        const orderData =
          orderUpdate && orderUpdate[1] ? orderUpdate[1].dataValues : orderUpdate.dataValues
        const [user, task] = await Promise.all([
          models.User.findByPk(orderData.userId),
          models.Task.findByPk(orderData.TaskId)
        ])

        if (orderData.amount) {
          PaymentMail.refund(user, task, orderData)
        } else {
          PaymentMail.error(user.dataValues, task, orderData.amount)
        }

        return orderData
      }
      break
    }

    case 'paypal': {
      const tokenResponse = await requestPromise({
        method: 'POST',
        uri: `${process.env.PAYPAL_HOST}/v1/oauth2/token`,
        headers: {
          Accept: 'application/json',
          'Accept-Language': 'en_US',
          Authorization:
            'Basic ' +
            Buffer.from(process.env.PAYPAL_CLIENT + ':' + process.env.PAYPAL_SECRET).toString(
              'base64'
            ),
          'Content-Type': 'application/json',
          grant_type: 'client_credentials'
        },
        form: {
          grant_type: 'client_credentials'
        }
      })

      const accessToken = JSON.parse(tokenResponse)['access_token']

      const payment = await requestPromise({
        method: 'POST',
        uri: `${process.env.PAYPAL_HOST}/v2/payments/authorizations/${order.authorization_id}/void`,
        headers: {
          Accept: '*/*',
          'Accept-Language': 'en_US',
          Prefer: 'return=representation',
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'application/json'
        }
      })

      const paymentData = JSON.parse(payment)

      const updatedOrder = await order.update(
        {
          status: 'refunded',
          refund_id: paymentData.id
        },
        {
          where: { id: order.id },
          include: [models.Task, models.User],
          returning: true,
          plain: true
        }
      )

      if (!updatedOrder) {
        throw new Error('update_order_error')
      }

      const orderData = updatedOrder.dataValues || (updatedOrder[0] && updatedOrder[0].dataValues)

      const [user, task] = await Promise.all([
        models.User.findByPk(orderData.userId),
        models.Task.findByPk(orderData.TaskId)
      ])

      PaymentMail.refund(user, task.dataValues, orderData)
      return orderData
    }

    default:
      break
  }
}
