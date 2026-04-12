export const TaskStates = {
  CREATED: 'created',
  FUNDED: 'funded',
  CLAIMED: 'claimed',
  COMPLETED: 'completed',
  CLOSED: 'closed'
} as const

export type TaskState = (typeof TaskStates)[keyof typeof TaskStates]

export const STATE_ORDER: Record<string, number> = {
  [TaskStates.CREATED]:   0,
  [TaskStates.FUNDED]:    1,
  [TaskStates.CLAIMED]:   2,
  [TaskStates.COMPLETED]: 3,
  [TaskStates.CLOSED]:    4,
}

export const ClosedReasons = {
  REFUNDED: 'refunded',
  MANUAL: 'manual',
  OTHER: 'other'
} as const

export type ClosedReason = (typeof ClosedReasons)[keyof typeof ClosedReasons]
