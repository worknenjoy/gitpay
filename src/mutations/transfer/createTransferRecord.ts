import models from '../../models'

const currentModels = models as any

export type CreateTransferRecordParams = {
  taskId: number
  userId: number
  to: number
  value: number
  transfer_method: string
  stripeTotal: number
  paypalTotal: number
  status?: string
  transfer_id?: string
}

export async function createTransferRecord(params: CreateTransferRecordParams) {
  return currentModels.sequelize.transaction(async (t: any) => {
    const transfer = await currentModels.Transfer.build({
      status: params.status || 'pending',
      value: params.value,
      transfer_id: params.transfer_id || null,
      transfer_method: params.transfer_method,
      taskId: params.taskId,
      userId: params.userId,
      to: params.to,
      paypal_transfer_amount: params.paypalTotal,
      stripe_transfer_amount: params.stripeTotal
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

    return transfer
  })
}
