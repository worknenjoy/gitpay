import Models from '../../../models'
import { C, listPendingTasks } from './list'
import { refundPendingTasks } from './refund'

// Usage:
//   npm run issues:pending              — list pending tasks report
//   npm run issues:pending -- --refund  — list + refund eligible tasks

const models = Models as any
const shouldRefund = process.argv.includes('--refund')

;(async () => {
  console.log(`${C.bold}${C.magenta}📋 Gitpay — Pending Issues/Tasks Report${C.reset}`)
  console.time('[Total] Pending tasks report time')
  try {
    const { pendingTasks } = await listPendingTasks()

    if (shouldRefund) {
      await refundPendingTasks(pendingTasks)
    }
  } catch (err) {
    console.error(`${C.red}❌ Failed:${C.reset}`, err)
    process.exitCode = 1
  } finally {
    if (models?.sequelize?.close) {
      await models.sequelize.close()
    }
    console.timeEnd('[Total] Pending tasks report time')
  }
})()
