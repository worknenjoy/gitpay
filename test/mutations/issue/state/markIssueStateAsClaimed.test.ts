import { expect } from 'chai'
import sinon from 'sinon'
import Models from '../../../../src/models'
import { truncateModels } from '../../../helpers'
import { TaskFactory, UserFactory, OrderFactory, TransferFactory } from '../../../factories'
import { markIssueAsClaimed } from '../../../../src/mutations/issue/state/markIssueStateAsClaimed'
import { TaskStates } from '../../../../src/constants/task'
import TransferMail from '../../../../src/mail/transfer'

const models = Models as any

describe('Mutations - Issue - State - markIssueAsClaimed', () => {
  let ownerNotifySpy: sinon.SinonStub
  let backerNotifySpy: sinon.SinonStub

  beforeEach(async () => {
    await truncateModels(models.Order)
    await truncateModels(models.Transfer)
    await truncateModels(models.Task)
    await truncateModels(models.User)

    ownerNotifySpy = sinon.stub(TransferMail, 'claimInitiatedNotifyOwner').resolves()
    backerNotifySpy = sinon.stub(TransferMail, 'claimInitiatedNotifyBacker').resolves()
  })

  afterEach(() => {
    sinon.restore()
  })

  it('notifies the task owner and each distinct backer when the issue is claimed', async () => {
    const owner = await UserFactory()
    const backerA = await UserFactory()
    const backerB = await UserFactory()
    const claimer = await UserFactory()

    const task = await TaskFactory({ userId: owner.id, state: TaskStates.FUNDED })

    await OrderFactory({ TaskId: task.id, userId: backerA.id, paid: true })
    // backerB funds the task twice - should still only be notified once
    await OrderFactory({ TaskId: task.id, userId: backerB.id, paid: true })
    await OrderFactory({ TaskId: task.id, userId: backerB.id, paid: true })
    // an unpaid order should not trigger a notification
    const otherUser = await UserFactory()
    await OrderFactory({ TaskId: task.id, userId: otherUser.id, paid: false })

    await TransferFactory({ taskId: task.id, userId: owner.id, to: claimer.id, value: 100 })

    const result = await markIssueAsClaimed(task.id)

    expect(result.state).to.equal(TaskStates.CLAIMED)

    expect(ownerNotifySpy.calledOnce).to.equal(true)
    const ownerCallArgs = ownerNotifySpy.getCall(0).args
    expect(ownerCallArgs[0].id).to.equal(owner.id)
    expect(ownerCallArgs[2].id).to.equal(claimer.id)
    expect(Number(ownerCallArgs[3])).to.equal(100)

    expect(backerNotifySpy.callCount).to.equal(2)
    const notifiedBackerIds = backerNotifySpy.getCalls().map((call) => call.args[0].id).sort()
    expect(notifiedBackerIds).to.deep.equal([backerA.id, backerB.id].sort())
  })

  it('still notifies a backer who is also the claiming user', async () => {
    const owner = await UserFactory()
    const claimer = await UserFactory()

    const task = await TaskFactory({ userId: owner.id, state: TaskStates.FUNDED })
    await OrderFactory({ TaskId: task.id, userId: claimer.id, paid: true })
    await TransferFactory({ taskId: task.id, userId: owner.id, to: claimer.id, value: 50 })

    await markIssueAsClaimed(task.id)

    expect(backerNotifySpy.calledOnce).to.equal(true)
    expect(backerNotifySpy.getCall(0).args[0].id).to.equal(claimer.id)
  })

  it('throws and sends no further mail when the issue is already claimed', async () => {
    const owner = await UserFactory()
    const claimer = await UserFactory()

    const task = await TaskFactory({ userId: owner.id, state: TaskStates.CLAIMED })
    await TransferFactory({ taskId: task.id, userId: owner.id, to: claimer.id, value: 50 })

    let error: any
    try {
      await markIssueAsClaimed(task.id)
    } catch (e) {
      error = e
    }

    expect(error).to.exist
    expect(ownerNotifySpy.called).to.equal(false)
    expect(backerNotifySpy.called).to.equal(false)
  })
})
