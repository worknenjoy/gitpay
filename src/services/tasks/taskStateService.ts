import Models from '../../models'
import { TaskStates } from '../../constants/task'

const models = Models as any

export async function resolveTaskState(task: any): Promise<string> {
  // completed: actual payment transfer was executed (Stripe/PayPal transfer ID set)
  if (task.transfer_id) {
    return TaskStates.COMPLETED
  }

  // claimed: a Transfer record is associated (payment pending)
  if (task.TransferId) {
    return TaskStates.CLAIMED
  }

  // funded: at least one paid order
  const orders = task.Orders ?? (await models.Order.findAll({ where: { TaskId: task.id } }))
  const hasPaidOrder = orders.some((o: any) => o.paid)
  if (hasPaidOrder) {
    return TaskStates.FUNDED
  }

  return TaskStates.CREATED
}

export async function syncAllTaskStates(): Promise<{ total: number; updated: number }> {
  const tasks = await models.Task.findAll({
    include: [models.Order]
  })

  let updated = 0
  for (const task of tasks) {
    const newState = await resolveTaskState(task)
    if (task.state !== newState) {
      await task.update({ state: newState })
      updated++
    }
  }

  return { total: tasks.length, updated }
}
