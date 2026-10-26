import { Op } from 'sequelize'
import models from '../../models'
import TransferMail from '../../mail/transfer'

import stripeModule from '../../client/payment/stripe'
const stripe = stripeModule()

const currentModels = models as any

export async function taskPayment(paymentParams: any, currentUser?: any) {
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

  // Broken Access Control (BOLA / CWE-639) check
  if (currentUser && task.userId !== currentUser.id && !currentUser.admin) {
    throw new Error('not_authorized')
  }

  // Prevent duplicate payout / Race Condition check
  if (task.transfer_id) {
    throw new Error('task_already_paid')
  }

  const assign = await currentModels.Assign.findOne({
    where: {
      id: task.assigned
    },
    include: [{ model: currentModels.User.scope('withSensitive') }]
  })

  if (!assign || !assign.dataValues || !assign.dataValues.User) {
    throw new Error('assign_user_not_found')
  }

  const user = assign.dataValues.User.dataValues

  const dest = user.account_id
  if (!dest) {
    TransferMail.paymentForInvalidAccount(user)
    throw new Error('account_destination_invalid')
  }

  // Strip client paymentParams.value (CWE-472 protection)
  // Float Precision: Sanitize task.value with toFixed(2) to prevent fraction leakage
  const rawTaskValue = parseFloat(task.value) || 0
  const authoritativeTaskValue = parseFloat(rawTaskValue.toFixed(2))

  // Exclude refunded or disputed orders from payout calculation
  const capturedOrders = await currentModels.Order.findAll({
    where: {
      TaskId: task.id,
      paid: true,
      status: {
        [Op.ne]: 'refunded'
      },
      refund_id: null
    }
  })

  // Float Precision: Round order amounts to fixed 2 decimal places before summing
  const capturedBalanceRaw = (capturedOrders || []).reduce(
    (acc: number, cur: any) => {
      const orderAmount = parseFloat(cur.amount) || 0
      return acc + parseFloat(orderAmount.toFixed(2))
    },
    0
  )
  const capturedBalance = parseFloat(capturedBalanceRaw.toFixed(2))

  const finalPayableValue =
    capturedBalance > 0 ? Math.max(authoritativeTaskValue, capturedBalance) : authoritativeTaskValue
  if (finalPayableValue <= 0) {
    throw new Error('insufficient_funds')
  }

  // Convert sanitized decimal to cents
  const centavosAmount = Math.round(parseFloat(finalPayableValue.toFixed(2)) * 100)

  let transferData: any = {
    amount: Math.round(centavosAmount * 0.92), // 8% base fee
    currency: 'usd',
    destination: dest,
    source_type: 'card'
  }

  const order = await currentModels.Order.findOne({ where: { TaskId: task.id } })
  const coupon = order?.couponId ? await currentModels.Coupon.findOne({ where: { id: order.couponId } }) : null

  if (!coupon || (coupon && coupon.amount < 100)) {
    transferData['transfer_group'] = task.transfer_group ? task.transfer_group : `task_${task.id}`
  }

  // Stripe Idempotency Key: Guarantees exactly-once payout execution at gateway level
  const stripeOptions = {
    idempotencyKey: `task_transfer_${task.id}`
  }

  const transfer = await stripe.transfers.create(transferData, stripeOptions)

  if (!transfer || !transfer.id) {
    throw new Error('stripe_transfer_failed')
  }

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
