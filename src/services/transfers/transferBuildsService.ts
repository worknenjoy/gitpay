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
import { getPaymentProvider } from '../../providers'

const currentModels = models as any

export type PendingReviewReason = {
  code:
    | 'stripe_no_account'
    | 'stripe_insufficient_capabilities'
    | 'whop_no_account'
    | 'whop_transfer_failed'
    | 'paypal_no_account'
    | 'paypal_transfer_failed'
  detail: string
}

type TransferBuildsParams = {
  transfer_id?: string
  taskId?: number
  userId?: number
  /**
   * When true, Whop ledger transfers are not called; a mock transfer_id is stored.
   * For sandbox / ops only — never set from the public API.
   */
  mockSettlement?: boolean
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
  let isWhop = false
  let isMultiple = false

  let stripeTotal = 0
  let paypalTotal = 0
  let whopTotal = 0

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
      isStripe = true
      stripeTotal += parseFloat(order.amount)
    }
    if (order.provider === 'whop' && order.paid) {
      isWhop = true
      whopTotal += parseFloat(order.amount)
    }
    if (order.provider === 'paypal' && order.paid) {
      isPaypal = true
      paypalTotal += parseFloat(order.amount)
    }
    if (order.paid) finalValue += parseFloat(order.amount)
  })

  const activeRails = [isStripe, isPaypal, isWhop].filter(Boolean).length
  if (activeRails > 1) {
    isMultiple = true
  }

  const user = destination?.dataValues
  let createdStripeTransferId: string | null = null
  let createdWhopTransferId: string | null = null

  const transfer_method: string =
    (isMultiple && 'multiple') ||
    (isWhop && 'whop') ||
    (isStripe && 'stripe') ||
    (isPaypal && 'paypal') ||
    'stripe'

  // Record card-like totals (stripe + wallet + whop) in stripe_transfer_amount for reporting continuity
  const platformCardTotal = stripeTotal + whopTotal

  try {
    let transfer = await createTransferRecord({
      taskId: params.taskId!,
      userId: taskData.User.dataValues.id,
      to: destination.id,
      value: finalValue,
      transfer_method,
      stripeTotal: platformCardTotal,
      paypalTotal,
      transfer_id: params.transfer_id
    })

    const pendingReasons: PendingReviewReason[] = []

    // --- Stripe / wallet funded orders ---
    if (stripeTotal > 0) {
      const dest = user?.account_id
      if (!dest) {
        TransferMail.paymentForInvalidAccount(user)
        pendingReasons.push({
          code: 'stripe_no_account',
          detail: 'Stripe: no account connected'
        })
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

          try {
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
          } catch (stripeError: any) {
            if (
              stripeError?.type === 'StripeInvalidRequestError' &&
              stripeError?.code === 'insufficient_capabilities_for_transfer'
            ) {
              pendingReasons.push({
                code: 'stripe_insufficient_capabilities',
                detail: 'Stripe: insufficient capabilities for transfer'
              })
            } else {
              throw stripeError
            }
          }
        }
      }
    }

    // --- Whop funded orders ---
    if (whopTotal > 0) {
      const dest = user?.whop_account_id
      if (!dest) {
        TransferMail.paymentForInvalidAccount(user)
        pendingReasons.push({
          code: 'whop_no_account',
          detail: 'Whop: no connected account (whop_account_id)'
        })
      } else {
        try {
          // amount in cents (provider converts to major units for Whop API)
          const amountCents = Math.floor(whopTotal * 100 * 0.92)
          let whopTransferId: string | null = null

          if (params.mockSettlement) {
            whopTransferId = `mock_tr_bounty_${taskData.id}_${Date.now()}`
            // eslint-disable-next-line no-console
            console.log(
              `[transferBuilds] mockSettlement Whop transfer for task ${taskData.id} → ${whopTransferId}`
            )
          } else {
            const whopProvider = getPaymentProvider('whop')
            const whopTransfer = await whopProvider.createTransfer({
              amount: amountCents,
              currency: 'usd',
              destination: dest,
              description: `Payment for issue task_${taskData.id} on Gitpay`,
              metadata: {
                task_id: taskData.id,
                transfer_id: transfer.id,
                purpose: 'bounty_payout'
              },
              transferGroup: `task_${taskData.id}`
            })
            whopTransferId = whopTransfer?.transferId || null
          }

          createdWhopTransferId = whopTransferId

          if (whopTransferId) {
            await currentModels.Task.update(
              { transfer_id: whopTransferId },
              { where: { id: params.taskId } }
            )

            const updateTransfer = await currentModels.Transfer.update(
              {
                transfer_id: whopTransferId,
                status: transfer_method === 'whop' ? 'in_transit' : 'pending'
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
        } catch (whopError: any) {
          console.error('whopTransferError', whopError)
          pendingReasons.push({
            code: 'whop_transfer_failed',
            detail: `Whop: transfer failed${whopError?.message ? ` (${whopError.message})` : ''}`
          })
        }
      }
    }

    if (paypalTotal > 0) {
      if (!destination?.paypal_id) {
        pendingReasons.push({
          code: 'paypal_no_account',
          detail: 'PayPal: no PayPal account connected'
        })
      } else {
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
          pendingReasons.push({
            code: 'paypal_transfer_failed',
            detail: 'PayPal: payout request failed'
          })
        }
      }
    }

    const bothComplete =
      transfer_method === 'multiple' &&
      transfer.transfer_id &&
      (transfer.paypal_payout_id || (!isPaypal && transfer.transfer_id))

    if (bothComplete && isPaypal && transfer.transfer_id && transfer.paypal_payout_id) {
      const updateTransferStatus = await currentModels.Transfer.update(
        { status: 'in_transit' },
        { where: { id: transfer.id }, returning: true }
      )
      if (updateTransferStatus[1]) {
        transfer = updateTransferStatus[1][0].dataValues
      }
    }

    if (pendingReasons.length > 0) {
      const comment = pendingReasons.map((reason) => reason.detail).join('; ')
      const updatedTransfer = await currentModels.Transfer.update(
        { comment },
        { where: { id: transfer.id }, returning: true }
      )
      if (updatedTransfer[1]) {
        transfer = updatedTransfer[1][0].dataValues
      }
      TransferMail.pendingForReview(user, taskData, pendingReasons)
    }

    return transfer
  } catch (error) {
    if (createdStripeTransferId) {
      await createTransferReversal(createdStripeTransferId, {}).catch(() => null)
    }
    if (createdWhopTransferId) {
      await getPaymentProvider('whop')
        .reverseTransfer(createdWhopTransferId, {})
        .catch(() => null)
    }
    throw error
  }
}
