import { refundPendingTasksService } from '../../../services/issues/pendingTasks/refundPendingTasksService'
import { isRefundEligibleAction } from '../../../queries/issue/state/findPendingTasks'
import { C } from './list'

export async function refundPendingTasks(pendingTasks: any[]) {
  const eligible = pendingTasks.filter((t: any) => isRefundEligibleAction(t.action))

  console.log(
    `\n${C.cyan}${C.bold}💸 [Refund] Processing ${eligible.length} eligible task(s) for refund...${C.reset}`
  )
  console.log(
    `${C.dim}Includes: eligible_for_refund + stale_unclaimed_eligible_for_refund${C.reset}`
  )

  const { refunded, failed, skipped, closed, results } =
    await refundPendingTasksService(pendingTasks)

  for (const r of results) {
    if (r.status === 'refunded') {
      console.log(
        `${C.green}  ✓ Task #${r.taskId} Order #${r.orderId} (${r.provider}): refunded.${C.reset}`
      )
    } else if (r.status === 'closed') {
      console.log(
        `${C.green}  ✓ Task #${r.taskId}: closed — ${r.reason ?? 'state closed'}.${C.reset}`
      )
    } else if (r.status === 'failed') {
      console.error(
        `${C.red}  ✗ Task #${r.taskId}${r.orderId != null ? ` Order #${r.orderId}` : ''} (${r.provider}): refund failed — ${r.error}${C.reset}`
      )
    } else {
      console.log(
        `${C.gray}  ~ Task #${r.taskId}${r.orderId != null ? ` Order #${r.orderId}` : ''} (${r.provider}): skipped — ${r.reason ?? 'not eligible'}.${C.reset}`
      )
    }
  }

  console.log(
    `\n${C.bold}[Refund] Done — refunded: ${refunded}, closed: ${closed}, failed: ${failed}, skipped: ${skipped}${C.reset}`
  )
}
