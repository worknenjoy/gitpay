import models from '../../models'
import PaymentMail from '../../mail/payment'
import { comment } from '../../bot/comment'
import { PaypalConnect } from '../../client/provider/paypal'
const slack = require('../../shared/slack')

const currentModels = models as any

type OrderAuthorizeParams = {
  token: string
  PayerID: string
}

function validateOrderToken(token: string): string {
  // Allow only a restricted set of characters and a reasonable length.
  // This should be compatible with PayPal order IDs while preventing
  // path traversal or injection of unexpected URL characters.
  const TOKEN_REGEX = /^[A-Za-z0-9\-_.]{1,64}$/
  if (!TOKEN_REGEX.test(token)) {
    throw new Error('Invalid order token')
  }
  return token
}

export async function orderAuthorize(orderParameters: OrderAuthorizeParams) {
  const safeToken = validateOrderToken(orderParameters.token)
  const authorization = await PaypalConnect({
    uri: `${process.env.PAYPAL_HOST}/v2/checkout/orders/${safeToken}/authorize`,
    method: 'POST'
  })
  const order = await currentModels.Order.update(
    {
      payer_id: orderParameters.PayerID,
      paid: !!(orderParameters.token && orderParameters.PayerID && authorization.id),
      status:
        orderParameters.token && orderParameters.PayerID && authorization.id ? 'succeeded' : 'fail',
      authorization_id:
        authorization.purchase_units &&
        authorization.purchase_units[0] &&
        authorization.purchase_units[0].payments &&
        authorization.purchase_units[0].payments.authorizations[0].id
    },
    {
      where: {
        token: safeToken
      },
      returning: true,
      plain: true
    }
  )

  const orderData = order[1].dataValues
  const [user, task] = await Promise.all([
    currentModels.User.findByPk(orderData.userId),
    currentModels.Task.findByPk(orderData.TaskId)
  ])

  if (orderData.paid) {
    comment(orderData, task)
    PaymentMail.success(user, task, orderData.amount)

    // Send Slack notification for PayPal payment completion
    const orderDataForNotification = {
      amount: orderData.amount,
      currency: orderData.currency || 'USD'
    }
    await slack.notifyBounty(task, orderDataForNotification, user, 'PayPal payment')
  } else {
    PaymentMail.error(user.dataValues, task, orderData.amount)
  }

  if (task.dataValues.assigned) {
    const assignedId = task.dataValues.assigned
    const assign = await currentModels.Assign.findByPk(assignedId, {
      include: [currentModels.User]
    })
    PaymentMail.assigned(assign.dataValues.User.dataValues, task, orderData.amount)
    return orderData
  }
  return orderData
}
