import findFundedIssues from './findFundedIssues'
import { findUnclaimedBounties } from '../bounty/findUnclaimedBounties'

export type PendingTaskAction = 'eligible_for_refund' | 'pending_claim'

export interface PendingTask {
  [key: string]: any
  action: PendingTaskAction
}

export const findPendingTasks = async (): Promise<PendingTask[]> => {
  const [funded, unclaimed] = await Promise.all([findFundedIssues(), findUnclaimedBounties()])

  const byId = new Map<number, PendingTask>()

  for (const t of funded) {
    byId.set(t.id, { ...(t.dataValues ?? t), Orders: t.Orders, action: 'eligible_for_refund' })
  }

  for (const t of unclaimed) {
    byId.set(t.id, { ...(t.dataValues ?? t), Orders: t.Orders, action: 'pending_claim' })
  }

  return Array.from(byId.values())
}
