import models from '../../models'
import { PaypalConnect } from '../../client/provider/paypal'

import TransferMail from '../../mail/transfer'

import {
  createTransfer as createStripeTransfer,
  createTransferReversal
} from '../provider/stripe/transfer'
import { retrieveTransfer } from '../../queries/provider/stripe/transfer'
import { findTransferByIdForUpdate } from '../../queries/transfer/findTransferByIdForUpdate'
import { findUserByIdSimple } from '../../queries/user/findUserByIdSimple'

const currentModels = models as any

type TransferUpdateParams = {
  id?: number
}

export async function transferUpdate(params: TransferUpdateParams) {
  let existingTransfer = params.id ? await findTransferByIdForUpdate(params.id) : null

  if (!existingTransfer) {
    return { error: 'No transfer found' }
  }

  const destination = await findUserByIdSimple(existingTransfer.dataValues.to)

  let createdStripeTransferId: string | null = null

  try {
    return await currentModels.sequelize.transaction(async (t: any) => {
      if (
        existingTransfer &&
        destination?.dataValues?.account_id &&
        existingTransfer.status === 'pending' &&
        (existingTransfer.transfer_method === 'multiple' ||
          existingTransfer.transfer_method === 'stripe') &&
        existingTransfer.stripe_transfer_amount &&
        !existingTransfer.transfer_id
      ) {
        const finalValue = existingTransfer.dataValues.stripe_transfer_amount
        const centavosAmount = finalValue * 100

        const transferData = {
          amount: Math.floor((centavosAmount * 92) / 100),
          currency: 'usd',
          destination: destination.dataValues.account_id,
          source_type: 'card',
          transfer_group: `task_${existingTransfer.taskId}`
        } as any

        // Preserve legacy call ordering (retrieve then create)
        if (existingTransfer.transfer_id) {
          await retrieveTransfer(existingTransfer.transfer_id)
        }

        const stripeTransfer = await createStripeTransfer(transferData)
        createdStripeTransferId = stripeTransfer?.id || null

        if (stripeTransfer) {
          await currentModels.Task.update(
            { transfer_id: stripeTransfer.id },
            {
              where: { id: existingTransfer.taskId },
              transaction: t
            }
          )

          const updateTransfer = await currentModels.Transfer.update(
            {
              transfer_id: stripeTransfer.id,
              status: existingTransfer.transfer_method === 'stripe' ? 'in_transit' : 'pending'
            },
            {
              where: { id: existingTransfer.id },
              returning: true,
              transaction: t
            }
          )

          const { value, Task: task, User: user } = existingTransfer as any
          if (!updateTransfer) {
            TransferMail.error(user, task, task.value)
            return { error: 'update_task_reject' }
          }
          const taskOwner = await findUserByIdSimple(task.userId, { transaction: t })
          if (taskOwner?.dataValues) {
            TransferMail.notifyOwner(taskOwner.dataValues, task, value)
          }
          TransferMail.success(user, task, value)
          existingTransfer = updateTransfer[1][0].dataValues
        }
      }

      if (
        existingTransfer &&
        !existingTransfer.paypal_payout_id &&
        existingTransfer.paypal_transfer_amount &&
        (existingTransfer.transfer_method === 'multiple' ||
          existingTransfer.transfer_method === 'paypal') &&
        destination?.dataValues?.paypal_id
      ) {
        try {
          const paypalTransfer =
            !existingTransfer.paypal_payout_id &&
            (await PaypalConnect({
              method: 'POST',
              uri: `${process.env.PAYPAL_HOST}/v1/payments/payouts`,
              body: {
                sender_batch_header: {
                  email_subject: 'You have a payment'
                },
                items: [
                  {
                    recipient_type: 'EMAIL',
                    amount: {
                      value: (existingTransfer.dataValues.paypal_transfer_amount * 0.92).toFixed(2),
                      currency: 'USD'
                    },
                    receiver: destination.dataValues.email,
                    note: 'Thank you.',
                    sender_item_id: 'item_1'
                  }
                ]
              }
            }))

          if (paypalTransfer) {
            existingTransfer.paypal_payout_id = paypalTransfer.batch_header.payout_batch_id
            existingTransfer.status =
              existingTransfer.transfer_method === 'paypal' ? 'in_transit' : 'pending'
            await existingTransfer.save({ transaction: t })
          }
        } catch (error) {
          console.error('Error fetching PayPal transfer:', error)
        }
      }

      const updateTransferStatus =
        existingTransfer.transfer_method === 'multiple' &&
        existingTransfer.transfer_id &&
        existingTransfer.paypal_payout_id &&
        (await currentModels.Transfer.update(
          { status: 'in_transit' },
          { where: { id: existingTransfer.id }, returning: true, transaction: t }
        ))

      if (updateTransferStatus && updateTransferStatus[1]) {
        existingTransfer = updateTransferStatus[1][0].dataValues
      }

      return existingTransfer
    })
  } catch (error) {
    if (createdStripeTransferId) {
      await createTransferReversal(createdStripeTransferId, {}).catch(() => null)
    }
    throw error
  }
}
