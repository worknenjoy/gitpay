/* eslint-disable no-console */
import Models from '../../models'
import { Op } from 'sequelize'
import { transferBuildsService } from '../transfers/transferBuildsService'

const models = Models as any

export type ProcessPendingBountyWhopTransfersOptions = {
  /** Skip live Whop ledger transfer; write mock transfer_id */
  mockSettlement?: boolean
  taskId?: number
  limit?: number
}

export type ProcessPendingBountyWhopTransfersResult = {
  scanned: number
  transferred: number
  skipped: number
  failed: number
  mockSettlement: boolean
  errors: Array<{ taskId: number; error: string }>
}

/**
 * Run bounty assignee transfers for tasks funded by paid Whop orders that still
 * need a platform → connected-company transfer.
 *
 * Uses the same `transferBuildsService` path as the API (mutations/queries inside).
 * With `mockSettlement`, Whop ledger calls are skipped (sandbox).
 */
export async function processPendingBountyWhopTransfers(
  options: ProcessPendingBountyWhopTransfersOptions = {}
): Promise<ProcessPendingBountyWhopTransfersResult> {
  const mockSettlement = Boolean(options.mockSettlement)

  const taskWhere: any = {
    transfer_id: { [Op.is]: null },
    assigned: { [Op.ne]: null }
  }
  if (options.taskId != null) {
    taskWhere.id = options.taskId
    delete taskWhere.transfer_id
  }

  const tasks = await models.Task.findAll({
    where: taskWhere,
    include: [
      {
        model: models.Order,
        required: true,
        where: { provider: 'whop', paid: true }
      }
    ],
    order: [['updatedAt', 'ASC']],
    limit: options.limit ?? 50
  })

  const result: ProcessPendingBountyWhopTransfersResult = {
    scanned: tasks.length,
    transferred: 0,
    skipped: 0,
    failed: 0,
    mockSettlement,
    errors: []
  }

  for (const task of tasks) {
    try {
      // Skip if a Transfer row already exists for this task
      const existing = await models.Transfer.findOne({ where: { taskId: task.id } })
      if (existing && options.taskId == null) {
        result.skipped += 1
        continue
      }

      const transferResult = await transferBuildsService({
        taskId: task.id,
        mockSettlement
      })

      if (transferResult?.error) {
        result.skipped += 1
        console.log(
          `[bounty-whop-transfer] task ${task.id} skipped: ${transferResult.error}`
        )
        continue
      }

      result.transferred += 1
      console.log(
        `[bounty-whop-transfer] task ${task.id} transferred` +
          (mockSettlement ? ' (mock)' : '')
      )
    } catch (error: any) {
      result.failed += 1
      result.errors.push({
        taskId: task.id,
        error: error?.message || String(error)
      })
      console.error(`[bounty-whop-transfer] task ${task.id} failed:`, error?.message || error)
    }
  }

  return result
}
