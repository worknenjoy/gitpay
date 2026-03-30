import { syncAllTaskStates } from '../../services/tasks/taskStateService'

const syncTaskStatesScript = async () => {
  const { total, updated } = await syncAllTaskStates()
  console.log(`Task state sync complete. Processed: ${total}, Updated: ${updated}`)
}

syncTaskStatesScript().catch((err) => {
  console.error('Task state sync failed:', err)
  process.exit(1)
})
