import models from '../../models'
import { PaypalConnect } from '../../client/provider/paypal'
import TransferMail from '../../mail/transfer'
import {
  createTransfer as createStripeTransfer,
  createTransferReversal
} from '../../mutations/provider/stripe/transfer'
import { findTransferByStripeTransferId } from '../../queries/transfer/findTransferByStripeTransferId'
import { findTransferByTaskId } from '../../queries/transfer/findTransferByTaskId'
import { findTaskByIdWithOrdersAndUser } from '../../queries/task/findTaskByIdWithOrdersAndUser'
import { findAssignByIdWithUser } from '../../queries/assign/findAssignByIdWithUser'
import { findUserByIdSimple } from '../../queries/user/findUserByIdSimple'
import { createTransferRecord } from '../../mutations/transfer/createTransferRecord'

const currentModels = models as any

type TransferBuildsParams = {
  transfer_id?: string
  taskId?: number
  userId?: number
}

export async function transferBuildsService(params: TransferBuildsParams) {
  const existingTransfer = params.transfer_id
    ? await findTransferByStripeTransferId(params.transfer_id)
    : null

  if (existingTransfer) {
    return { error: 'This transfer already exists' }
  }

  const existingTask = params.taskId ? await findTransferByTaskId(params.taskId) : null
  if (existingTask) {
    return { error: 'Only one transfer for an issue' }
  }

  const task = params.taskId ? await findTaskByIdWithOrdersAndUser(params.taskId) : null
  const taskData = task?.dataValues

  if (!taskData) return { error: 'No valid task' }
  if (!taskData.assigned) return { error: 'No user assigned' }

  const assign = await findAssignByIdWithUser(taskData.assigned)
  const destination = assign?.dataValues?.User

  let finalValue = 0
  let isStripe = false
  let isPaypal = false
  let isMultiple = false

  let allStripe = true
  let allPaypal = true

  let stripeTotal = 0
  let paypalTotal = 0

  if (taskData.Orders.length === 0) {
    return { error: 'No orders found' }
  }

  const orders = taskData.Orders
  const ordersPaid = orders.find((order: any) => order.paid === true)
  if (!ordersPaid) {
    return { error: 'All orders must be paid' }
  }

  orders.map((order: any) => {
    if ((order.provider === 'stripe' || order.provider === 'wallet') && order.paid) {
      allPaypal = false
      isStripe = true
      stripeTotal += parseFloat(order.amount)
    }
    if (order.provider === 'paypal' && order.paid) {
      allStripe = false
      isPaypal = true
      paypalTotal += parseFloat(order.amount)
    }
    if (order.paid) finalValue += parseFloat(order.amount)
  })

  if (isStripe && isPaypal) {
    isMultiple = true
  }

  const user = destination?.dataValues
  let createdStripeTransferId: string | null = null

  const transfer_method: string =
    (isMultiple && 'multiple') || (isStripe && 'stripe') || (isPaypal && 'paypal') || 'stripe'

  try {
    let transfer = await createTransferRecord({
      taskId: params.taskId!,
      userId: taskData.User.dataValues.id,
      to: destination.id,
      value: finalValue,
      transfer_method,
      stripeTotal,
      paypalTotal,
      transfer_id: params.transfer_id
    })

    if (stripeTotal > 0) {
      const dest = user?.account_id
      if (!dest) {
        TransferMail.paymentForInvalidAccount(user)
      } else {
        if (params.transfer_id) {
          await currentModels.Task.update(
            { transfer_id: params.transfer_id },
            { where: { id: params.taskId } }
          )

          const updateTransfer = await currentModels.Transfer.update(
            {
              transfer_id: params.transfer_id,
              status: transfer.transfer_method === 'stripe' ? 'in_transit' : 'pending'
            },
            { where: { id: transfer.id }, returning: true }
          )
          transfer = updateTransfer[1][0].dataValues
        } else {
          const centavosAmount = stripeTotal * 100
          const transferData = {
            amount: Math.floor((centavosAmount * 92) / 100),
            currency: 'usd',
            destination: dest,
            source_type: 'card',
            transfer_group: `task_${taskData.id}`
          } as any

          const stripeTransfer = await createStripeTransfer(transferData)
          createdStripeTransferId = stripeTransfer?.id || null

          if (stripeTransfer) {
            await currentModels.Task.update(
              { transfer_id: stripeTransfer.id },
              { where: { id: params.taskId } }
            )

            const updateTransfer = await currentModels.Transfer.update(
              {
                transfer_id: stripeTransfer.id,
                status: transfer_method === 'stripe' ? 'in_transit' : 'pending'
              },
              { where: { id: transfer.id }, returning: true }
            )

            const taskOwner = await findUserByIdSimple(taskData.userId)
            if (taskOwner?.dataValues) {
              TransferMail.notifyOwner(taskOwner.dataValues, taskData, taskData.value)
            }
            TransferMail.success(user, taskData, taskData.value)
            transfer = updateTransfer[1][0].dataValues
          }
        }
      }
    }

    if (paypalTotal > 0 && destination?.paypal_id) {
      try {
        const paypalTransfer = await PaypalConnect({
          method: 'POST',
          uri: `${process.env.PAYPAL_HOST}/v1/payments/payouts`,
          body: {
            sender_batch_header: {
              sender_batch_id: `task_${taskData.id}`,
              email_subject: 'Payment for task'
            },
            items: [
              {
                recipient_type: 'EMAIL',
                amount: {
                  value: (paypalTotal * 0.92).toFixed(2),
                  currency: 'USD'
                },
                receiver: user.email,
                note: 'Payment for issue on Gitpay',
                sender_item_id: `task_${taskData.id}`
              }
            ]
          }
        })

        if (paypalTransfer) {
          const paypalPayout = await currentModels.Payout.build({
            source_id: paypalTransfer.batch_header.payout_batch_id,
            method: 'paypal',
            amount: paypalTotal * 0.92,
            currency: 'usd',
            userId: user.id
          }).save()

          if (!paypalPayout) {
            return { error: 'Payout not created' }
          }

          const transferWithPayPalPayoutInfo = await currentModels.Transfer.update(
            {
              paypal_payout_id: paypalTransfer.batch_header.payout_batch_id,
              status: transfer_method === 'paypal' ? 'in_transit' : 'pending'
            },
            { where: { id: transfer.id }, returning: true }
          )
          transfer = transferWithPayPalPayoutInfo[1][0].dataValues
        }
      } catch (e) {
        console.log('paypalTransferError', e)
      }
    }

    const bothComplete =
      transfer_method === 'multiple' && transfer.transfer_id && transfer.paypal_payout_id

    if (bothComplete) {
      const updateTransferStatus = await currentModels.Transfer.update(
        { status: 'in_transit' },
        { where: { id: transfer.id }, returning: true }
      )
      if (updateTransferStatus[1]) {
        transfer = updateTransferStatus[1][0].dataValues
      }
    }

    return transfer
  } catch (error) {
    if (createdStripeTransferId) {
      await createTransferReversal(createdStripeTransferId, {}).catch(() => null)
    }
    throw error
  }
}
