import Models from '../../../models'
import { TaskStates, ClosedReasons } from '../../../constants/task'

const models = Models as any

export interface TaskStateResult {
  state: string
  closed_reason?: string | null
}

export async function resolveTaskState(task: any): Promise<TaskStateResult> {

  // claimed: a Transfer record is associated (payment pending)
  if (task.paid || task.transfer_id || task.TransferId || (task.Transfer && task.Transfer.length > 0)) {
    return { state: TaskStates.CLAIMED }
  }

  const orders = task.Orders ?? (await models.Order.findAll({ where: { TaskId: task.id } }))
  const paidOrders = orders.filter((o: any) => o.paid)
  const activePaidOrders = paidOrders.filter((o: any) => o.status !== 'refunded')

  // funded: at least one active (non-refunded) paid order exists
  if (activePaidOrders.length > 0) {
    return { state: TaskStates.FUNDED }
  }

  // closed/refunded: all paid orders have been refunded and the task is explicitly closed
  if (paidOrders.length > 0 && task.status === 'closed') {
    return { state: TaskStates.CLOSED, closed_reason: ClosedReasons.REFUNDED }
  }

  return { state: TaskStates.CREATED }
}

export interface TaskStateChange {
  id: number
  title: string
  url: string | null
  previousState: string
  newState: string
  previousClosedReason?: string | null
  newClosedReason?: string | null
}

export async function syncAllTaskStates(): Promise<{ total: number; updated: number; changes: TaskStateChange[] }> {
  const tasks = await models.Task.findAll({
    include: [models.Order, models.Transfer],
  })

  let updated = 0
  const changes: TaskStateChange[] = []
  for (const task of tasks) {
    const { state: newState, closed_reason } = await resolveTaskState(task)
    const stateChanged = task.state !== newState
    const reasonChanged = closed_reason !== undefined && task.closed_reason !== closed_reason
    if (stateChanged || reasonChanged) {
      changes.push({
        id: task.id,
        title: task.title,
        url: task.url ?? null,
        previousState: task.state,
        newState,
        previousClosedReason: task.closed_reason ?? null,
        newClosedReason: closed_reason ?? null,
      })
      await task.update({ state: newState, ...(closed_reason !== undefined && { closed_reason }) })
      updated++
    }
  }

  return { total: tasks.length, updated, changes }
}
