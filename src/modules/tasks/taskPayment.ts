import models from '../../models'
import TransferMail from '../../mail/transfer'

import stripeModule from '../../client/payment/stripe'
const stripe = stripeModule()

const currentModels = models as any

export async function taskPayment(paymentParams: any) {
  const task = await currentModels.Task.findOne(
    {
      where: {
        id: paymentParams.taskId
      }
    },
    { include: [currentModels.User, currentModels.Order, currentModels.Assign] }
  )

  if (!task) {
    throw new Error('find_task_error')
  }

  // 1. Idempotency check: prevent duplicate payouts
  if (task.transfer_id) {
    throw new Error('task_already_paid')
  }

  // 2. Ownership authorization: ensure executing user owns task
  if (paymentParams.userId && task.userId !== paymentParams.userId) {
    throw new Error('unauthorized_payment_execution')
  }

  // 3. Balance / value validation
  if (!task.value || task.value <= 0) {
    throw new Error('invalid_task_balance')
  }

  const assign = await currentModels.Assign.findOne({
    where: {
      id: task.assigned
    },
    include: [{ model: currentModels.User.scope('withSensitive') }]
  })

  if (!assign || !assign.dataValues || !assign.dataValues.User) {
    throw new Error('assign_not_found')
  }

  const user = assign.dataValues.User.dataValues

  const dest = user.account_id
  if (!dest) {
    TransferMail.paymentForInvalidAccount(user)
    throw new Error('account_destination_invalid')
  }

  const order = await currentModels.Order.findOne({ where: { TaskId: task.id } })
  if (order && order.status && order.status !== 'paid' && order.status !== 'COMPLETED') {
    throw new Error('insufficient_validated_balance')
  }

  const centavosAmount = paymentParams.value * 100 || task.value * 100

  let transferData: any = {
    amount: centavosAmount * 0.92, // 8% base fee
    currency: 'usd',
    destination: dest,
    source_type: 'card'
  }

  const coupon = order ? await currentModels.Coupon.findOne({ where: { id: order.couponId } }) : null

  if (!coupon || (coupon && coupon.amount < 100)) {
    transferData['transfer_group'] = task.transfer_group ? task.transfer_group : `task_${task.id}`
  }

  const transfer = await stripe.transfers.create(transferData)

  if (transfer) {
    const update = await currentModels.Task.update(
      { transfer_id: transfer.id },
      {
        where: {
          id: task.id
        }
      }
    )

    if (!update) {
      TransferMail.error(user, task, task.value)
      throw new Error('update_task_reject')
    }

    const taskOwner = await currentModels.User.findByPk(task.userId)
    if (taskOwner) {
      TransferMail.notifyOwner(taskOwner.dataValues, task, task.value)
    }
    TransferMail.success(user, task, task.value)
    return transfer
  }
}
