import { inngest } from '../client'
import { syncInfo } from '../../modules/info/syncInfo'
import StatsMail from '../../mail/stats'

type StepTools = {
  run: (id: string, fn: () => Promise<any>) => Promise<any>
}

type Logger = {
  info: (...args: any[]) => void
}

// Kept separate from the Inngest wrapper so it can be unit-tested with a fake `step`.
// Use Inngest's `logger` (not console) outside steps: the handler re-runs once per step,
// and Inngest's logger skips lines from those replays so each message prints once.
export const syncStatsHandler = async ({
  step,
  logger = console
}: {
  step: StepTools
  logger?: Logger
}) => {
  const result = await step.run('sync-info', () => syncInfo())

  logger.info(
    `[sync-stats] Stats synced: ${result.users_count} users, ${result.new_users_count} new since last sync`
  )

  if (result.new_users_count > 0) {
    // Throws on send failure, so Inngest retries only this step (sync-info is not re-run)
    await step.run('mail-new-users', async () => {
      await StatsMail.newUsers(result.new_users_count, result.users_count)
      return { notified: result.new_users_count }
    })
  } else {
    logger.info('[sync-stats] No new users since last sync, skipping new-users email')
  }

  return result
}

export const syncStats = inngest.createFunction(
  { id: 'sync-stats', retries: 3, concurrency: { limit: 1 } },
  [{ cron: 'TZ=UTC 0 0 * * *' }, { event: 'stats/sync.requested' }],
  syncStatsHandler
)
