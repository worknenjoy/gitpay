import { findPendingTasks } from '../../../queries/issue/state/findPendingTasks'

export interface ListPendingTasksResult {
  pendingTasks: any[]
  totalPendingTasksAmount: number
  totalPendingPaypalOrdersAmount: number
  totalPendingWalletOrdersAmount: number
}

export async function listPendingTasksService(): Promise<ListPendingTasksResult> {
  const pendingTasks = await findPendingTasks()

  let totalPendingTasksAmount = 0
  for (const t of pendingTasks) {
    totalPendingTasksAmount += Number(t.value) * 0.92 || 0
  }

  let totalPendingPaypalOrdersAmount = 0
  let totalPendingWalletOrdersAmount = 0

  for (const t of pendingTasks) {
    if (t.Orders?.length > 0) {
      for (const order of t.Orders) {
        if (order.provider === 'paypal' && order.status === 'succeeded') {
          totalPendingPaypalOrdersAmount += Number(order.amount) * 0.92 || 0
        }
        if (order.provider === 'wallet' && order.status === 'succeeded') {
          totalPendingWalletOrdersAmount += Number(order.amount) * 0.92 || 0
        }
      }
    }
  }

  return {
    pendingTasks,
    totalPendingTasksAmount,
    totalPendingPaypalOrdersAmount,
    totalPendingWalletOrdersAmount
  }
}
