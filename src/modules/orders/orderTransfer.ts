import models from '../../models'
import TransferMail from '../mail/transfer'

const currentModels = models as any

type OrderTransferParams = {
  id: number
}

type TransferData = {
  id: number
}

export async function orderTransfer(
  transferParams: OrderTransferParams,
  transferData: TransferData
) {
  try {
    const order = await currentModels.Order.findOne({
      where: { id: transferParams.id },
      include: [currentModels.User, currentModels.Task]
    })

    if (!order) throw new Error('no order found')
    if (transferParams.id && transferData.id) {
      const transferOrderId = transferParams.id
      const transferTaskId = transferData.id

      const coupon = await currentModels.Coupon.findOne({ where: { id: order.couponId } })

      try {
        const orderUpdated = await currentModels.Order.update(
          {
            TaskId: transferTaskId,
            transfer_group:
              !coupon || (coupon && coupon.amount < 100) ? `task_${order.Task.dataValues.id}` : null
          },
          {
            where: {
              id: transferOrderId
            },
            returning: true,
            plain: true
          }
        )

        const taskTo = await currentModels.Task.findOne({ where: { id: transferTaskId } })
        if (orderUpdated) {
          TransferMail.transferBounty(order, order.Task, taskTo, order.User)
        }
        return orderUpdated
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('order update error', e)
      }
    }
    return order
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error on order transfer', error)
    return false
  }
}
