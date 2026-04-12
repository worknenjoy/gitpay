import Models from '../../../models'
import { TaskStates } from '../../../constants/task'
import { findTransferByStripeTransferId } from '../../transfer/findTransferByStripeTransferId'

const models = Models as any

const olderThanThreeMonths = (timestamp: Date) => {
  const now = new Date()
  const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
  return timestamp < threeMonthsAgo
}

const findNewClaimedToCompletedIssues = async () => {
  const tasks = await models.Task.findAll({
    where: {
      state: {
        [models.Sequelize.Op.notIn]: [TaskStates.COMPLETED, TaskStates.CLOSED],
        [models.Sequelize.Op.in]: [TaskStates.CLAIMED]
      }
    },
    include: [models.Order, models.Transfer]
  })
  const resolvedTasks = await Promise.all(
    tasks.map(async (task: any) => {
      const transferId = task.transfer_id || task.Transfer?.transfer_id
      if (!transferId) return null
      const transfer = await findTransferByStripeTransferId(transferId)
      if (!transfer) return null
      if (transfer.status === 'reversed') return null
      if (transfer.status === 'failed') return null
      if (transfer.status === 'pending') return null
      if (transfer.status === 'canceled') return null
      if (transfer.status === 'created') return task
      return null
    })
  )
  return resolvedTasks.filter(Boolean)
}

export default findNewClaimedToCompletedIssues
