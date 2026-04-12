import { expect } from 'chai'
import Models from '../../../src/models'
import { truncateModels } from '../../helpers'
import { TaskFactory, OrderFactory, UserFactory, TransferFactory } from '../../factories'
import { syncAllIssuesStates } from '../../../src/services/issues/state/issueStateService'
import { TaskStates, ClosedReasons } from '../../../src/constants/task'

const models = Models as any

describe('Services - Issues - issueStateService', () => {
  let userId: number

  beforeEach(async () => {
    await truncateModels(models.Order)
    await truncateModels(models.Transfer)
    await truncateModels(models.Task)
    await truncateModels(models.User)
    const user = await UserFactory()
    userId = user.id
  })

  describe('resolveIssueState', () => {
    it('returns claimed when issue has a transfer_id', async () => {
      await TaskFactory({ userId, transfer_id: 'tr_abc123' })
      await TaskFactory({ userId })
      const result = await syncAllIssuesStates()
      expect(result.length).to.equal(1)
      expect(result[0].state).to.equal(TaskStates.CLAIMED)
    })
    it('returns claimed when issue has a TransferId', async () => {
      const task = await TaskFactory({ userId, transfer_id: null })
      const transfer = await TransferFactory({ transfer_id: 'tr_abc123', taskId: task.id, userId, to: userId })
      await TaskFactory({ userId })
      const result = await syncAllIssuesStates()
      expect(result.length).to.equal(1)
      expect(result[0].state).to.equal(TaskStates.CLAIMED)
    })
    it('returns claimed when issue has a transfer', async () => {
      const task = await TaskFactory({ userId })
      const transfer = await TransferFactory({ transfer_id: 'tr_abc123', taskId: task.id, userId, to: userId })
      task.Transfer = transfer
      await task.save()
      await TaskFactory({ userId })
      const result = await syncAllIssuesStates()
      expect(result.length).to.equal(1)
      expect(result[0].state).to.equal(TaskStates.CLAIMED)
    })
    it('returns nothing when the state is already claimed', async () => {
      const task = await TaskFactory({ userId, transfer_id: 'tr_abc123', state: TaskStates.CLAIMED })
      const result = await syncAllIssuesStates()
      expect(result.length).to.equal(0)
      const updatedTask = await models.Task.findByPk(task.id)
      expect(updatedTask.state).to.equal(TaskStates.CLAIMED)
    })
    it('returns nothing when the state is already completed', async () => {
      const task = await TaskFactory({ userId, transfer_id: 'tr_abc123', state: TaskStates.COMPLETED })
      const result = await syncAllIssuesStates()
      expect(result.length).to.equal(0)
    })
    it('returns nothing when the state is already closed', async () => {
      const task = await TaskFactory({ userId, state: TaskStates.CLOSED, closed_reason: ClosedReasons.OTHER })
      const result = await syncAllIssuesStates()
      expect(result.length).to.equal(0)
    })
  })
})
