export const TaskStates = {
  CREATED: 'created',
  FUNDED: 'funded',
  CLAIMED: 'claimed',
  COMPLETED: 'completed'
} as const

export type TaskState = (typeof TaskStates)[keyof typeof TaskStates]
