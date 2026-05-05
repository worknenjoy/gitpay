import { retrieveTransfer } from '../../../queries/provider/stripe/transfer/retrieveTransfer'

export const fillIssueTimestampFromTransfer = async (
  task: any,
  field: 'claimed_at' | 'completed_at'
) => {
  let resolvedDate: Date | null = null

  if (task.Transfer?.createdAt) {
    resolvedDate = new Date(task.Transfer.createdAt)
  } else if (task.transfer_id) {
    try {
      const stripeTransfer = await retrieveTransfer(task.transfer_id)
      resolvedDate = new Date(stripeTransfer.created * 1000)
    } catch (err) {
      console.error(`Could not retrieve transfer ${task.transfer_id} for task ${task.id}:`, err)
      return null
    }
  }

  if (!resolvedDate) return null

  await task.update({ [field]: resolvedDate })
  await task.reload()
  return task
}
