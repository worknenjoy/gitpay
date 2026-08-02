import {
  refundPendingTasksService,
  type RefundPendingTasksOptions
} from '../../../services/issues/pendingTasks/refundPendingTasksService'
import { isRefundEligibleAction } from '../../../queries/issue/state/findPendingTasks'
import { C } from './list'

export async function refundPendingTasks(
  pendingTasks: any[],
  options: RefundPendingTasksOptions = {}
) {
  const force = options.force === true
  const attemptRefund = options.attemptRefund !== false
  const eligible = pendingTasks.filter((t: any) => isRefundEligibleAction(t.action))

  if (attemptRefund) {
    console.log(
      `\n${C.cyan}${C.bold}💸 [Refund] Processing ${eligible.length} eligible task(s) for refund...${C.reset}`
    )
    console.log(
      `${C.dim}Includes: eligible_for_refund + stale_unclaimed_eligible_for_refund${C.reset}`
    )
    if (force) {
      console.log(
        `${C.yellow}⚡ --force: after failed refunds, close task + settle orders (amount retained by platform)${C.reset}`
      )
    }
  } else if (force) {
    console.log(
      `\n${C.yellow}${C.bold}⚡ [Force] Closing ${pendingTasks.length} pending task(s) — amount retained by platform...${C.reset}`
    )
    console.log(
      `${C.dim}Task: closed (manual, nobody requested the transfer) | Orders: status=closed, paid=true (retained by platform)${C.reset}`
    )
  }

  const { refunded, failed, skipped, closed, forceClosed, results } =
    await refundPendingTasksService(pendingTasks, options)

  for (const r of results) {
    if (r.status === 'refunded') {
      console.log(
        `${C.green}  ✓ Task #${r.taskId} Order #${r.orderId} (${r.provider}): refunded.${C.reset}`
      )
    } else if (r.status === 'closed') {
      const isForce =
        String(r.reason ?? '').startsWith('force closed') ||
        String(r.reason ?? '').includes('retained by platform')
      const color = isForce ? C.yellow : C.green
      const target =
        r.orderId != null ? `Task #${r.taskId} Order #${r.orderId}` : `Task #${r.taskId}`
      console.log(`${color}  ✓ ${target}: closed — ${r.reason ?? 'state closed'}.${C.reset}`)
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
    `\n${C.bold}[Pending] Done — refunded: ${refunded}, closed: ${closed}, forceClosed: ${forceClosed}, failed: ${failed}, skipped: ${skipped}${C.reset}`
  )
}