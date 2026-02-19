import models from '../../models'
import TransferMail from '../../mail/transfer'
import { PaypalConnect } from '../../client/provider/paypal'

const currentModels = models as any

type OrderPaymentParams = {
  id: number
}

export async function orderPayment(orderParameters: OrderPaymentParams) {
  const order = await currentModels.Order.findByPk(orderParameters.id)

  if (order.provider === 'paypal') {
    const paymentData = await PaypalConnect({
      method: 'POST',
      uri: `${process.env.PAYPAL_HOST}/v2/payments/authorizations/${order.authorization_id}/capture`
    })
    const updatedOrder = await order.update(
      {
        transfer_id: paymentData.id
      },
      {
        where: {
          id: order.id
        },
        include: [currentModels.Task, currentModels.User],
        returning: true,
        plain: true
      }
    )

    if (!updatedOrder) {
      throw new Error('update_order_error')
    }

    const orderData = updatedOrder.dataValues || updatedOrder[0].dataValues
    const [user, task] = await Promise.all([
      currentModels.User.findByPk(orderData.userId),
      currentModels.Task.findByPk(orderData.TaskId)
    ])

    const assign = await currentModels.Assign.findByPk(task.dataValues.assigned, {
      include: [currentModels.User]
    })
    TransferMail.notifyOwner(user.dataValues, task.dataValues, orderData.amount)
    TransferMail.success(assign.dataValues.User, task.dataValues, orderData.amount)
    return orderData
  }
  throw new Error('payment-fail-error')
}
