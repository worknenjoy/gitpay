import { syncAllTaskStates } from '../../services/issues/state/issueStateService'

const syncTaskStatesScript = async () => {
  console.log('Starting task state sync...')
  const { total, updated, changes } = await syncAllTaskStates()

  if (changes.length > 0) {
    console.log('\nUpdated tasks:')
    for (const change of changes) {
      const stateChange = `${change.previousState} → ${change.newState}`
      const reasonChange =
        change.newClosedReason !== change.previousClosedReason
          ? ` (closed_reason: ${change.previousClosedReason ?? 'null'} → ${change.newClosedReason ?? 'null'})`
          : ''
      console.log(`  [#${change.id}] "${change.title}" — ${stateChange}${reasonChange} | url: ${change.url ?? 'N/A'}`)
    }
  } else {
    console.log('No tasks required updates.')
  }

  console.log(`\nTask state sync complete. Processed: ${total}, Updated: ${updated}`)
}

syncTaskStatesScript().catch((err) => {
  console.error('Task state sync failed:', err)
  process.exit(1)
})
