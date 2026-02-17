import models from '../../models'
import requestPromise from 'request-promise'

import TransferMail from '../../mail/transfer'

import {
  createTransfer as createStripeTransfer,
  createTransferReversal
} from '../../provider/stripe/transfer'
import { findTransferByStripeTransferId } from '../../queries/transfer/findTransferByStripeTransferId'
import { findTransferByTaskId } from '../../queries/transfer/findTransferByTaskId'
import { findTaskByIdWithOrdersAndUser } from '../../queries/task/findTaskByIdWithOrdersAndUser'
import { findAssignByIdWithUser } from '../../queries/assign/findAssignByIdWithUser'
import { findUserByIdSimple } from '../../queries/user/findUserByIdSimple'

const currentModels = models as any

type TransferBuildsParams = {
  transfer_id?: string
  taskId?: number
  userId?: number
}

export async function transferBuilds(params: TransferBuildsParams) {
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

  try {
    return await currentModels.sequelize.transaction(async (t: any) => {
      let transfer = await currentModels.Transfer.build({
        status: 'pending',
        value: finalValue,
        transfer_id: params.transfer_id,
        transfer_method:
          (isMultiple && 'multiple') || (isStripe && 'stripe') || (isPaypal && 'paypal'),
        taskId: params.taskId,
        userId: taskData.User.dataValues.id,
        to: destination.id,
        paypal_transfer_amount: paypalTotal,
        stripe_transfer_amount: stripeTotal
      }).save({ transaction: t })

      const [taskUpdatedCount] = await currentModels.Task.update(
        { TransferId: transfer.id },
        {
          where: { id: params.taskId },
          transaction: t
        }
      )

      if (!taskUpdatedCount) {
        throw new Error('Task not updated')
      }

      if (stripeTotal > 0) {
        const dest = user?.account_id
        if (!dest) {
          TransferMail.paymentForInvalidAccount(user)
        } else {
          // If caller already provided a transfer id, treat it as already created.
          if (params.transfer_id) {
            await currentModels.Task.update(
              { transfer_id: params.transfer_id },
              {
                where: { id: params.taskId },
                transaction: t
              }
            )

            const updateTransfer = await currentModels.Transfer.update(
              {
                transfer_id: params.transfer_id,
                status: transfer.transfer_method === 'stripe' ? 'in_transit' : 'pending'
              },
              {
                where: { id: transfer.id },
                returning: true,
                transaction: t
              }
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
                {
                  where: { id: params.taskId },
                  transaction: t
                }
              )

              const updateTransfer = await currentModels.Transfer.update(
                {
                  transfer_id: stripeTransfer.id,
                  status: transfer.transfer_method === 'stripe' ? 'in_transit' : 'pending'
                },
                {
                  where: { id: transfer.id },
                  returning: true,
                  transaction: t
                }
              )

              const taskOwner = await findUserByIdSimple(taskData.userId, { transaction: t })
              if (taskOwner?.dataValues) {
                TransferMail.notifyOwner(taskOwner.dataValues, taskData, taskData.value)
              }
              TransferMail.success(user, taskData, taskData.value)
              transfer = updateTransfer[1][0].dataValues
            }
          }
        }
      }

      // PayPal flow intentionally preserves legacy behavior (best-effort, non-transactional)
      if (paypalTotal > 0 && destination?.paypal_id) {
        const paypalCredentials = await requestPromise({
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
        const paypalToken = JSON.parse(paypalCredentials)['access_token']
        try {
          const paypalTransfer = await requestPromise({
            method: 'POST',
            uri: `${process.env.PAYPAL_HOST}/v1/payments/payouts`,
            headers: {
              Accept: '*/*',
              'Accept-Language': 'en_US',
              Prefer: 'return=representation',
              Authorization: 'Bearer ' + paypalToken,
              'Content-Type': 'application/json'
            },
            json: true,
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
            }).save({ transaction: t })

            if (!paypalPayout) {
              return { error: 'Payout not created' }
            }

            const transferWithPayPalPayoutInfo = await currentModels.Transfer.update(
              {
                paypal_payout_id: paypalTransfer.batch_header.payout_batch_id,
                status: transfer.transfer_method === 'paypal' ? 'in_transit' : 'pending'
              },
              {
                where: { id: transfer.id },
                returning: true,
                transaction: t
              }
            )
            transfer = transferWithPayPalPayoutInfo[1][0].dataValues
          }
        } catch (e) {
          console.log('paypalTransferError', e)
        }
      }

      const updateTransferStatus =
        transfer.transfer_method === 'multiple' &&
        transfer.transfer_id &&
        transfer.paypal_payout_id &&
        (await currentModels.Transfer.update(
          { status: 'in_transit' },
          { where: { id: transfer.id }, returning: true, transaction: t }
        ))

      if (updateTransferStatus && updateTransferStatus[1]) {
        transfer = updateTransferStatus[1][0].dataValues
      }

      return transfer
    })
  } catch (error) {
    if (createdStripeTransferId) {
      await createTransferReversal(createdStripeTransferId, {}).catch(() => null)
    }
    throw error
  }
}
