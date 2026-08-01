import findFundedIssues from './findFundedIssues'
import { findUnclaimedBounties } from '../bounty/findUnclaimedBounties'

export type PendingTaskAction = 'eligible_for_refund' | 'pending_claim'

export interface PendingTask {
  [key: string]: any
  action: PendingTaskAction
}

const toPendingTask = (t: any, action: PendingTaskAction): PendingTask => {
  // Prefer plain object so DB fields (stale_at, updatedAt, claim_retries, …) are not lost
  const plain =
    typeof t?.get === 'function' ? t.get({ plain: true }) : { ...(t?.dataValues ?? t) }
  return {
    ...plain,
    Orders: t.Orders ?? plain.Orders,
    action
  }
}

export const findPendingTasks = async (): Promise<PendingTask[]> => {
  const [funded, unclaimed] = await Promise.all([findFundedIssues(), findUnclaimedBounties()])

  const byId = new Map<number, PendingTask>()

  for (const t of funded) {
    byId.set(t.id, toPendingTask(t, 'eligible_for_refund'))
  }

  for (const t of unclaimed) {
    byId.set(t.id, toPendingTask(t, 'pending_claim'))
  }

  return Array.from(byId.values())
}
