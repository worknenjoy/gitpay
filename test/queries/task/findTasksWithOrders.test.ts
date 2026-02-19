import { expect } from 'chai'
import Models from '../../../src/models'
import { truncateModels } from '../../helpers'
import { TaskFactory, OrderFactory, UserFactory } from '../../factories'
import { findTasksWithOrders } from '../../../src/queries/task/findTasksWithOrders'

const models = Models as any

describe('Queries - Task - findTasksWithOrders', () => {
  beforeEach(async () => {
    await truncateModels(models.Order)
    await truncateModels(models.Task)
    await truncateModels(models.User)
  })

  it('returns only tasks with succeeded+paid orders', async () => {
    const user = await UserFactory()

    const taskWithPaidSucceededOrder = await TaskFactory({ userId: user.id })
    const taskWithSucceededButUnpaidOrder = await TaskFactory({ userId: user.id })
    const taskWithPaidButOpenOrder = await TaskFactory({ userId: user.id })

    await OrderFactory({
      TaskId: taskWithPaidSucceededOrder.id,
      userId: user.id,
      status: 'succeeded',
      paid: true
    })

    // Non-matching order on the same task should not be included
    await OrderFactory({
      TaskId: taskWithPaidSucceededOrder.id,
      userId: user.id,
      status: 'open',
      paid: true
    })

    await OrderFactory({
      TaskId: taskWithSucceededButUnpaidOrder.id,
      userId: user.id,
      status: 'succeeded',
      paid: false
    })

    await OrderFactory({
      TaskId: taskWithPaidButOpenOrder.id,
      userId: user.id,
      status: 'open',
      paid: true
    })

    const tasks = await findTasksWithOrders()

    expect(tasks).to.have.lengthOf(1)
    expect(tasks[0].id).to.equal(taskWithPaidSucceededOrder.id)

    const orders = tasks[0].Orders || tasks[0].orders || []
    expect(orders).to.have.lengthOf(1)
    expect(orders[0].status).to.equal('succeeded')
    expect(orders[0].paid).to.equal(true)
  })
})
