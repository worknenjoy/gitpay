import { syncAllIssuesStates } from '../../services/issues/state/issueStateService'

const syncTaskStatesScript = async () => {
  console.log('Starting task state sync...')
  const { result } = await syncAllIssuesStates()

  console.log(`\nTask state sync complete. Updated: ${result.length}`)
  console.log('Updated tasks:')
  result.forEach((task: any) => {
    console.log(`- Task ID: ${task.id}, New State: ${task.state}`)
  })
}

syncTaskStatesScript().catch((err) => {
  console.error('Task state sync failed:', err)
  process.exit(1)
})
