import Models from '../../../models'
import { i18nConfigure } from '../../../shared/i18n/i18n'
import { C, listPendingTasks } from './list'
import { refundPendingTasks } from './refund'

// Usage:
//   npm run issues:pending                    — list pending tasks report
//   npm run issues:pending -- --refund        — list + refund eligible tasks (notify on failures)
//   npm run issues:pending -- --force         — force-close remaining pending tasks
//                                               (amount retained by platform; comment: nobody requested the transfer)
//   npm run issues:pending -- --refund --force — refund first, then force-close any that still failed

i18nConfigure()

const models = Models as any
const shouldRefund = process.argv.includes('--refund')
const shouldForce = process.argv.includes('--force')

;(async () => {
  console.log(`${C.bold}${C.magenta}📋 Gitpay — Pending Issues/Tasks Report${C.reset}`)
  console.time('[Total] Pending tasks report time')
  try {
    const { pendingTasks } = await listPendingTasks()

    if (shouldRefund || shouldForce) {
      await refundPendingTasks(pendingTasks, {
        force: shouldForce,
        attemptRefund: shouldRefund
      })
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
