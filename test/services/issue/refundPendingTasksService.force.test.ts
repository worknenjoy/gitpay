import { expect } from 'chai'
import Models from '../../../src/models'
import { truncateModels } from '../../helpers'
import { TaskFactory, UserFactory, OrderFactory } from '../../factories'
import {
  FORCE_CLOSE_COMMENT,
  FORCE_CLOSE_ORDER_STATUS,
  refundPendingTasksService
} from '../../../src/services/issues/pendingTasks/refundPendingTasksService'
import { TaskStates, ClosedReasons } from '../../../src/constants/task'
import { syncAllIssuesStates } from '../../../src/services/issues/state/issueStateService'

const models = Models as any

describe('Services - Issues - refundPendingTasksService --force', () => {
  let userId: number

  beforeEach(async () => {
    await truncateModels(models.Order)
    await truncateModels(models.Task)
    await truncateModels(models.User)
    const user = await UserFactory()
    userId = user.id
  })

  it('force-closes pending task and settles orders for platform retention (no refund)', async () => {
    const task = await TaskFactory({
      userId,
      state: TaskStates.FUNDED,
      status: 'open',
      value: 50
    })
    const order = await OrderFactory({
      userId,
      TaskId: task.id,
      provider: 'paypal',
      paid: true,
      status: 'succeeded',
      amount: 50,
      comment: 'paypal refund failed: REFUND_TIME_LIMIT_EXCEEDED. Manual refund required'
    })

    const result = await refundPendingTasksService(
      [
        {
          id: task.id,
          action: 'eligible_for_refund',
          Orders: [order]
        }
      ],
      { force: true, attemptRefund: false }
    )

    expect(result.forceClosed).to.equal(1)
    expect(result.closed).to.equal(1)
    expect(result.refunded).to.equal(0)

    const updated = await models.Task.findByPk(task.id)
    expect(updated.state).to.equal(TaskStates.CLOSED)
    expect(updated.closed_reason).to.equal(ClosedReasons.MANUAL)
    expect(updated.comment).to.equal(FORCE_CLOSE_COMMENT)

    // Orders leave succeeded so state sync / funded queries no longer match them
    const updatedOrder = await models.Order.findByPk(order.id)
    expect(updatedOrder.paid).to.equal(true)
    expect(updatedOrder.status).to.equal(FORCE_CLOSE_ORDER_STATUS)
    expect(updatedOrder.comment).to.include('amount retained by platform')
    expect(updatedOrder.comment).to.include(FORCE_CLOSE_COMMENT)
    expect(updatedOrder.comment).to.not.include('Manual refund required')

    const orderClose = result.results.find(
      (r) => r.orderId === order.id && r.status === 'closed'
    )
    expect(orderClose?.reason).to.include('retained by platform')

    // State sync must not re-open the task as funded
    const synced = await syncAllIssuesStates()
    expect(synced.find((t: any) => t.id === task.id)).to.equal(undefined)
    const afterSync = await models.Task.findByPk(task.id)
    expect(afterSync.state).to.equal(TaskStates.CLOSED)
  })

  it('force-closes all pending actions including pending_claim', async () => {
    const task = await TaskFactory({
      userId,
      state: TaskStates.FUNDED,
      status: 'closed',
      value: 30
    })
    const order = await OrderFactory({
      userId,
      TaskId: task.id,
      provider: 'stripe',
      paid: true,
      status: 'succeeded',
      amount: 30
    })

    const result = await refundPendingTasksService(
      [
        {
          id: task.id,
          action: 'pending_claim',
          Orders: [order.get({ plain: true })]
        }
      ],
      { force: true, attemptRefund: false }
    )

    expect(result.forceClosed).to.equal(1)
    const updated = await models.Task.findByPk(task.id)
    expect(updated.state).to.equal(TaskStates.CLOSED)
    expect(updated.comment).to.equal(FORCE_CLOSE_COMMENT)
  })

  it('after non-refundable provider skip, force-closes task and settles orders', async () => {
    const task = await TaskFactory({
      userId,
      state: TaskStates.FUNDED,
      status: 'open',
      value: 75
    })
    // Unknown provider is skipped and marks taskRefundFailed without external APIs
    const order = await OrderFactory({
      userId,
      TaskId: task.id,
      provider: 'unknown_provider',
      paid: true,
      status: 'succeeded',
      amount: 75
    })

    const result = await refundPendingTasksService(
      [
        {
          id: task.id,
          action: 'eligible_for_refund',
          Orders: [order.get({ plain: true })],
          createdAt: task.createdAt
        }
      ],
      { force: true, attemptRefund: true }
    )

    expect(result.skipped).to.be.at.least(1)
    expect(result.forceClosed).to.equal(1)
    expect(result.closed).to.equal(1)
    expect(result.refunded).to.equal(0)

    const updated = await models.Task.findByPk(task.id)
    expect(updated.state).to.equal(TaskStates.CLOSED)
    expect(updated.closed_reason).to.equal(ClosedReasons.MANUAL)
    expect(updated.comment).to.equal(FORCE_CLOSE_COMMENT)

    const updatedOrder = await models.Order.findByPk(order.id)
    expect(updatedOrder.status).to.equal(FORCE_CLOSE_ORDER_STATUS)
    expect(updatedOrder.paid).to.equal(true)
    expect(updatedOrder.comment).to.include('amount retained by platform')
  })

  it('without force, leaves task funded when refund cannot complete', async () => {
    const task = await TaskFactory({
      userId,
      state: TaskStates.FUNDED,
      status: 'open',
      value: 40
    })
    const order = await OrderFactory({
      userId,
      TaskId: task.id,
      provider: 'unknown_provider',
      paid: true,
      status: 'succeeded',
      amount: 40
    })

    const result = await refundPendingTasksService(
      [
        {
          id: task.id,
          action: 'eligible_for_refund',
          Orders: [order.get({ plain: true })],
          createdAt: task.createdAt
        }
      ],
      { force: false }
    )

    expect(result.skipped).to.be.at.least(1)
    expect(result.forceClosed).to.equal(0)
    expect(result.closed).to.equal(0)

    const updated = await models.Task.findByPk(task.id)
    expect(updated.state).to.equal(TaskStates.FUNDED)
  })
})
