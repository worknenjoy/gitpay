import { expect } from 'chai'
import Models from '../../../src/models'
import { truncateModels } from '../../helpers'
import { TaskFactory, OrderFactory, UserFactory, TransferFactory } from '../../factories'
import { resolveTaskState, syncAllTaskStates } from '../../../src/services/issues/state/issueStateService'
import { TaskStates, ClosedReasons } from '../../../src/constants/task'

const models = Models as any

describe('Services - Tasks - taskStateService', () => {
  let userId: number

  beforeEach(async () => {
    await truncateModels(models.Order)
    await truncateModels(models.Transfer)
    await truncateModels(models.Task)
    await truncateModels(models.User)
    const user = await UserFactory()
    userId = user.id
  })

  describe('resolveTaskState', () => {
    it('returns claimed when task has a transfer_id', async () => {
      const task = await TaskFactory({ userId, transfer_id: 'tr_abc123' })
      const taskWithTransferId = { ...task.toJSON(), transfer_id: 'tr_abc123' }
      const result = await resolveTaskState(taskWithTransferId)
      expect(result.state).to.equal(TaskStates.CLAIMED)
      expect(result.closed_reason).to.be.undefined
    })

    it('returns claimed when task has a TransferId', async () => {
      const task = await TaskFactory({ userId })
      const transfer = await TransferFactory({ taskId: task.id, userId, to: userId })
      await task.update({ TransferId: transfer.id })
      await task.reload()
      const result = await resolveTaskState(task)
      expect(result.state).to.equal(TaskStates.CLAIMED)
      expect(result.closed_reason).to.be.undefined
    })

    it('returns created when task has no orders', async () => {
      const task = await TaskFactory({ userId })
      const result = await resolveTaskState(task)
      expect(result.state).to.equal(TaskStates.CREATED)
      expect(result.closed_reason).to.be.undefined
    })

    it('returns created when task has only unpaid orders', async () => {
      const task = await TaskFactory({ userId })
      await OrderFactory({ TaskId: task.id, paid: false, status: 'open' })
      const result = await resolveTaskState(task)
      expect(result.state).to.equal(TaskStates.CREATED)
    })

    it('returns funded when task has at least one active paid order', async () => {
      const task = await TaskFactory({ userId })
      await OrderFactory({ TaskId: task.id, paid: true, status: 'succeeded' })
      const result = await resolveTaskState(task)
      expect(result.state).to.equal(TaskStates.FUNDED)
      expect(result.closed_reason).to.be.undefined
    })

    it('returns funded when task has mixed paid orders and at least one is not refunded', async () => {
      const task = await TaskFactory({ userId, status: 'closed' })
      await OrderFactory({ TaskId: task.id, paid: true, status: 'refunded' })
      await OrderFactory({ TaskId: task.id, paid: true, status: 'succeeded' })
      const result = await resolveTaskState(task)
      expect(result.state).to.equal(TaskStates.FUNDED)
    })

    it('returns created when all paid orders are refunded but task status is not closed', async () => {
      const task = await TaskFactory({ userId, status: 'open' })
      await OrderFactory({ TaskId: task.id, paid: true, status: 'refunded' })
      const result = await resolveTaskState(task)
      expect(result.state).to.equal(TaskStates.CREATED)
      expect(result.closed_reason).to.be.undefined
    })

    it('returns closed/refunded when all paid orders are refunded and task status is closed', async () => {
      const task = await TaskFactory({ userId, status: 'closed' })
      await OrderFactory({ TaskId: task.id, paid: true, status: 'refunded' })
      const result = await resolveTaskState(task)
      expect(result.state).to.equal(TaskStates.CLOSED)
      expect(result.closed_reason).to.equal(ClosedReasons.REFUNDED)
    })

    it('returns closed/refunded when multiple paid orders are all refunded and task status is closed', async () => {
      const task = await TaskFactory({ userId, status: 'closed' })
      await OrderFactory({ TaskId: task.id, paid: true, status: 'refunded' })
      await OrderFactory({ TaskId: task.id, paid: true, status: 'refunded' })
      const result = await resolveTaskState(task)
      expect(result.state).to.equal(TaskStates.CLOSED)
      expect(result.closed_reason).to.equal(ClosedReasons.REFUNDED)
    })

    it('ignores unpaid orders when determining closed/refunded', async () => {
      const task = await TaskFactory({ userId, status: 'closed' })
      await OrderFactory({ TaskId: task.id, paid: true, status: 'refunded' })
      await OrderFactory({ TaskId: task.id, paid: false, status: 'open' })
      const result = await resolveTaskState(task)
      expect(result.state).to.equal(TaskStates.CLOSED)
      expect(result.closed_reason).to.equal(ClosedReasons.REFUNDED)
    })

    it('uses pre-loaded Orders when provided on the task object', async () => {
      const task = await TaskFactory({ userId })
      // Attach orders directly to avoid a DB fetch
      ;(task as any).Orders = [{ paid: true, status: 'succeeded' }]
      const result = await resolveTaskState(task)
      expect(result.state).to.equal(TaskStates.FUNDED)
    })
  })

  describe('syncAllTaskStates', () => {
    it('updates state and closed_reason for tasks whose orders are all refunded', async () => {
      const task = await TaskFactory({ userId, state: 'funded', status: 'closed' })
      await OrderFactory({ TaskId: task.id, paid: true, status: 'refunded' })

      const { total, updated } = await syncAllTaskStates()
      expect(total).to.be.at.least(1)
      expect(updated).to.be.at.least(1)

      await task.reload()
      expect(task.state).to.equal(TaskStates.CLOSED)
      expect(task.closed_reason).to.equal(ClosedReasons.REFUNDED)
    })

    it('updates state to funded for tasks with active paid orders', async () => {
      const task = await TaskFactory({ userId, state: 'created' })
      await OrderFactory({ TaskId: task.id, paid: true, status: 'succeeded' })

      await syncAllTaskStates()

      await task.reload()
      expect(task.state).to.equal(TaskStates.FUNDED)
      expect(task.closed_reason).to.be.null
    })

    it('does not count a task as updated when state is already correct', async () => {
      const task = await TaskFactory({ userId, state: 'created' })
      // No orders — state should remain created

      const { updated } = await syncAllTaskStates()
      expect(updated).to.equal(0)

      await task.reload()
      expect(task.state).to.equal(TaskStates.CREATED)
    })

    it('returns correct total and updated counts', async () => {
      const taskA = await TaskFactory({ userId, state: 'created', status: 'closed' })
      await TaskFactory({ userId, state: 'created' })
      await OrderFactory({ TaskId: taskA.id, paid: true, status: 'refunded' })
      // taskB has no orders — stays created

      const { total, updated } = await syncAllTaskStates()
      expect(total).to.equal(2)
      expect(updated).to.equal(1)
    })
  })
})
