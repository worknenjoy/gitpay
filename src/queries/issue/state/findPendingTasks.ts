import findFundedIssues from './findFundedIssues'
import { findUnclaimedBounties } from '../bounty/findUnclaimedBounties'
import { IssueStatuses } from '../../../constants/issue'
import { TaskStates } from '../../../constants/task'

export type PendingTaskAction =
  | 'eligible_for_refund'
  | 'pending_claim'
  | 'stale_unclaimed_eligible_for_refund'

export interface PendingTask {
  [key: string]: any
  action: PendingTaskAction
}

export const isRefundEligibleAction = (action: PendingTaskAction | string): boolean =>
  action === 'eligible_for_refund' || action === 'stale_unclaimed_eligible_for_refund'

const toPlain = (t: any) => {
  if (typeof t?.get === 'function') return t.get({ plain: true })
  return { ...(t?.dataValues ?? t) }
}

/**
 * Classify a pending task for list/refund scripts.
 * Stale + closed + funded unclaimed → refund path (no claim retries).
 */
export const classifyPendingTaskAction = (
  task: any,
  fromUnclaimed: boolean
): PendingTaskAction => {
  const staleAt = task.stale_at ?? task.staleAt ?? null
  const status = task.status
  const state = task.state

  if (
    fromUnclaimed &&
    staleAt &&
    status === IssueStatuses.CLOSED &&
    state === TaskStates.FUNDED
  ) {
    return 'stale_unclaimed_eligible_for_refund'
  }

  if (fromUnclaimed) {
    return 'pending_claim'
  }

  return 'eligible_for_refund'
}

const toPendingTask = (t: any, fromUnclaimed: boolean): PendingTask => {
  const plain = toPlain(t)
  return {
    ...plain,
    Orders: t.Orders ?? plain.Orders,
    action: classifyPendingTaskAction(plain, fromUnclaimed)
  }
}

export const findPendingTasks = async (): Promise<PendingTask[]> => {
  const [funded, unclaimed] = await Promise.all([findFundedIssues(), findUnclaimedBounties()])

  const byId = new Map<number, PendingTask>()

  for (const t of funded) {
    byId.set(t.id, toPendingTask(t, false))
  }

  // Unclaimed overwrites funded so we reclassify with fromUnclaimed=true
  for (const t of unclaimed) {
    byId.set(t.id, toPendingTask(t, true))
  }

  return Array.from(byId.values())
}
