import { syncStaleIssues } from '../../services/issues/stale/issueStaleService'

const syncStaleIssuesScript = async () => {
  console.log('Starting stale issue sync...')
  const { total, updated, changes } = await syncStaleIssues()

  if (changes.length > 0) {
    console.log('\nMarked as stale:')
    for (const change of changes) {
      console.log(
        `  [#${change.id}] "${change.title}" — last activity: ${change.updatedAt.toISOString()} | url: ${change.url ?? 'N/A'}`
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
