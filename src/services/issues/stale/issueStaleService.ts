import Models from '../../../models'

const models = Models as any

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000

export interface IssueStaleChange {
  id: number
  title: string
  url: string | null
  updatedAt: Date
}

export async function syncStaleIssues(): Promise<{
  total: number
  updated: number
  changes: IssueStaleChange[]
}> {
  const cutoff = new Date(Date.now() - ONE_YEAR_MS)

  const tasks = await models.Task.findAll({
    where: { stale_at: null }
  })

  let updated = 0
  const changes: IssueStaleChange[] = []

  for (const task of tasks) {
    const lastActivity = task.updatedAt as Date
    if (lastActivity < cutoff) {
      changes.push({
        id: task.id,
        title: task.title,
        url: task.url ?? null,
        updatedAt: lastActivity
      })
      await task.update({ stale_at: new Date() })
      updated++
    }
  }

  return { total: tasks.length, updated, changes }
}
