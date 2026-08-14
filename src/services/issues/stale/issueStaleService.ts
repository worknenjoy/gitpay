import moment from 'moment'
import Models from '../../../models'

const models = Models as any

/** Mark stale if createdAt is older than this (aligned with pending Age column). */
export const STALE_CREATED_MONTHS = 6
/** Mark stale if updatedAt is older than this (existing inactivity rule). */
export const STALE_UPDATED_MONTHS = 3

export type StaleReason = 'created_at' | 'updated_at' | 'created_at+updated_at'

export interface IssueStaleChange {
  id: number
  title: string
  url: string | null
  createdAt: Date
  updatedAt: Date
  reason: StaleReason
}

function isStaleByCreatedAt(createdAt: Date, now: moment.Moment): boolean {
  return moment(createdAt).isBefore(now.clone().subtract(STALE_CREATED_MONTHS, 'months'))
}

function isStaleByUpdatedAt(updatedAt: Date, now: moment.Moment): boolean {
  return moment(updatedAt).isBefore(now.clone().subtract(STALE_UPDATED_MONTHS, 'months'))
}

function resolveStaleReason(byCreated: boolean, byUpdated: boolean): StaleReason | null {
  if (byCreated && byUpdated) return 'created_at+updated_at'
  if (byCreated) return 'created_at'
  if (byUpdated) return 'updated_at'
  return null
}

export async function syncStaleIssues(): Promise<{
  total: number
  updated: number
  changes: IssueStaleChange[]
}> {
  const now = moment()
  const tasks = await models.Task.findAll({
    where: { stale_at: null }
  })

  let updated = 0
  const changes: IssueStaleChange[] = []

  for (const task of tasks) {
    const createdAt = task.createdAt as Date
    const updatedAt = task.updatedAt as Date
    if (!createdAt || !updatedAt) continue

    const byCreated = isStaleByCreatedAt(createdAt, now)
    const byUpdated = isStaleByUpdatedAt(updatedAt, now)
    const reason = resolveStaleReason(byCreated, byUpdated)
    if (!reason) continue

    changes.push({
      id: task.id,
      title: task.title,
      url: task.url ?? null,
      createdAt,
      updatedAt,
      reason
    })
    await task.update({ stale_at: new Date() })
    updated++
  }

  return { total: tasks.length, updated, changes }
}
