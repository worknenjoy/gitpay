import { Op } from 'sequelize'
import Models from '../../../models'
import PaymentMail from '../../../mail/payment'
import stripeModule from '../../../client/payment/stripe'
import { calculateAmountWithPercent } from '../../../utils'
import { refundPaypalPayment } from '../../payments/refunds/refundPaypalPayment'
import { markIssueStateAsClosed } from '../../../mutations/issue/state/markIssueStateAsClosed'
import { ClosedReasons } from '../../../constants/task'

const models = Models as any
const stripe = stripeModule()

export const refundUnclaimedBountyOrders = async (taskId: number) => {
  const orders = await models.Order.findAll({
    where: {
      TaskId: taskId,
      paid: true,
      status: { [Op.ne]: 'refunded' }
    },
    include: [models.User]
  })

  for (const order of orders) {
    try {
      if (order.provider === 'stripe') {
        const refundAmount = calculateAmountWithPercent(order.amount, 0, 'decimal').centavos
        const refund = await stripe.refunds.create({
          charge: order.source,
          amount: refundAmount
        })
        if (refund && refund.id) {
          await models.Order.update(
            { status: 'refunded', refund_id: refund.id },
            { where: { id: order.id } }
          )
          const [user, task] = await Promise.all([
            models.User.findByPk(order.userId),
            models.Task.findByPk(order.TaskId)
          ])
          if (order.amount) {
            PaymentMail.refund(user, task, order.dataValues)
          }
        }
      } else if (order.provider === 'paypal') {
        await refundPaypalPayment({ orderId: order.id })
      } else if (order.provider === 'wallet') {
        await models.Order.update(
          { status: 'refunded' },
          { where: { id: order.id } }
        )
        // Re-fetching triggers the afterFind hook which recalculates and persists the wallet balance
        if (order.source_id) {
          await models.Wallet.findByPk(order.source_id)
        }
        const [user, task] = await Promise.all([
          models.User.findByPk(order.userId),
          models.Task.findByPk(order.TaskId)
        ])
        if (order.amount) {
          PaymentMail.refund(user, task, order.dataValues)
        }
      }
    } catch (err) {
      console.error(`Failed to refund order ${order.id} for task ${taskId}:`, err)
    }
  }

  await markIssueStateAsClosed(
    taskId,
    'refunded unclaimed bounty to original sponsors',
    ClosedReasons.REFUNDED
  )
}
