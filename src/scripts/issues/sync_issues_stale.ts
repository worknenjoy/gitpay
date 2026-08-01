import moment from 'moment'
import {
  STALE_CREATED_MONTHS,
  STALE_UPDATED_MONTHS,
  syncStaleIssues
} from '../../services/issues/stale/issueStaleService'

const syncStaleIssuesScript = async () => {
  console.log('Starting stale issue sync...')
  console.log(
    `Rules (OR): createdAt older than ${STALE_CREATED_MONTHS} months, ` +
      `OR updatedAt older than ${STALE_UPDATED_MONTHS} months. Only tasks with stale_at IS NULL.`
  )

  const { total, updated, changes } = await syncStaleIssues()

  if (changes.length > 0) {
    console.log('\nMarked as stale:')
    for (const change of changes) {
      console.log(
        `  [#${change.id}] "${change.title}"` +
          ` — reason: ${change.reason}` +
          ` | created: ${moment(change.createdAt).format('YYYY-MM-DD')} (${moment(change.createdAt).fromNow()})` +
          ` | updated: ${moment(change.updatedAt).format('YYYY-MM-DD')} (${moment(change.updatedAt).fromNow()})` +
          ` | url: ${change.url ?? 'N/A'}`
      )
    }
  } else {
    console.log('No issues required stale updates.')
  }

  console.log(`\nStale issue sync complete. Processed: ${total}, Updated: ${updated}`)
}

syncStaleIssuesScript().catch((err) => {
  console.error('Stale issue sync failed:', err)
  process.exit(1)
})
