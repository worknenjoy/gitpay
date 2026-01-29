import models from '../../models'

const currentModels = models as any
import requestPromise from 'request-promise'
import stripeModule from '../shared/stripe/stripe'
const stripe = stripeModule()
import TransferMail from '../mail/transfer'

type TransferBuildsParams = {
  transfer_id?: string
  taskId?: number
  userId?: number
}

export async function transferBuilds(params: TransferBuildsParams) {
  const existingTransfer =
    params.transfer_id &&
    (await currentModels.Transfer.findOne({
      where: {
        transfer_id: params.transfer_id
      }
    }))

  if (existingTransfer) {
    return { error: 'This transfer already exists' }
  }

  const existingTask =
    params.taskId &&
    (await currentModels.Transfer.findOne({
      where: {
        taskId: params.taskId
      }
    }))

  if (existingTask) {
    return { error: 'Only one transfer for an issue' }
  }

  const task =
    params.taskId &&
    (await currentModels.Task.findOne({
      where: {
        id: params.taskId
      },
      include: [
        currentModels.Order,
        {
          model: currentModels.User,
          as: 'User'
        }
      ]
    }))

  const taskData = task.dataValues

  if (!taskData) return { error: 'No valid task' }

  if (!taskData.assigned) {
    return { error: 'No user assigned' }
  }

  const assign = await currentModels.Assign.findOne({
    where: {
      id: taskData.assigned
    },
    include: [
      {
        model: currentModels.User,
        as: 'User'
      }
    ]
  })

  let finalValue = 0
  let isStripe = false
  let isPaypal = false
  let isMultiple = false

  let allStripe = true
  let allPaypal = true

  let stripeTotal = 0
  let paypalTotal = 0

  if (!taskData) {
    return new Error('Task not found')
  }
  if (taskData.Orders.length === 0) {
    return { error: 'No orders found' }
  } else {
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
  }
  const destination = assign.dataValues.User
  let transfer = await currentModels.Transfer.build({
    status: 'pending',
    value: finalValue,
    transfer_id: params.transfer_id,
    transfer_method: (isMultiple && 'multiple') || (isStripe && 'stripe') || (isPaypal && 'paypal'),
    taskId: params.taskId,
    userId: taskData.User.dataValues.id,
    to: destination.id,
    paypal_transfer_amount: paypalTotal,
    stripe_transfer_amount: stripeTotal
  }).save()
  const taskUpdate = await currentModels.Task.update(
    { TransferId: transfer.id },
    {
      where: {
        id: params.taskId
      }
    }
  )

  if (!taskUpdate[0]) {
    return { error: 'Task not updated' }
  }

  const user = assign.dataValues.User.dataValues

  if (stripeTotal > 0) {
    const dest = user.account_id
    if (!dest) {
      TransferMail.paymentForInvalidAccount(user)
    } else {
      const centavosAmount = stripeTotal * 100
      let transferData = {
        amount: Math.floor((centavosAmount * 92) / 100), // 8% base fee
        currency: 'usd',
        destination: dest,
        source_type: 'card',
        transfer_group: `task_${taskData.id}`
      }

      const stripeTransfer = await stripe.transfers.create(transferData)

      if (stripeTransfer) {
        const updateTask = await currentModels.Task.update(
          { transfer_id: stripeTransfer.id },
          {
            where: {
              id: params.taskId
            }
          }
        )
        const updateTransfer = await currentModels.Transfer.update(
          {
            transfer_id: stripeTransfer.id,
            status: transfer.transfer_method === 'stripe' ? 'in_transit' : 'pending'
          },
          {
            where: {
              id: transfer.id
            },
            returning: true
          }
        )
        if (!updateTask || !updateTransfer) {
          TransferMail.error(user, task, task.value)
          return { error: 'update_task_reject' }
        }
        const taskOwner = await currentModels.User.findByPk(taskData.userId)
        TransferMail.notifyOwner(taskOwner.dataValues, taskData, taskData.value)
        TransferMail.success(user, taskData, taskData.value)
        transfer = updateTransfer[1][0].dataValues
      }
    }
  }
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
        }).save()
        if (!paypalPayout) {
          return { error: 'Payout not created' }
        }
        const transferWithPayPalPayoutInfo = await currentModels.Transfer.update(
          {
            paypal_payout_id: paypalTransfer.batch_header.payout_batch_id,
            status: transfer.transfer_method === 'paypal' ? 'in_transit' : 'pending'
          },
          {
            where: {
              id: transfer.id
            },
            returning: true
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
      { where: { id: transfer.id }, returning: true }
    ))
  if (updateTransferStatus && updateTransferStatus[1]) {
    transfer = updateTransferStatus[1][0].dataValues
  }
  return transfer
}
