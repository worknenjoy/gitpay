import { expect } from 'chai'
import { truncateModels, createTask, registerAndLogin } from '../../../helpers'
import { findUnclaimedBounties } from '../../../../src/queries/issue/bounty/findUnclaimedBounties'
import Models from '../../../../src/models'
import { userFactory } from '../../../factories/userFactory'
import { IssueFactory } from '../../../factories/issueFactory'
import { TransferFactory } from '../../../factories/transferFacctory'

const models = Models as any

describe('Queries - Issue - Bounty - findUnclaimedBounties', () => {
  beforeEach(async () => {
    await truncateModels(models.Task)
    await truncateModels(models.Order)
    await truncateModels(models.User)
  })
  it('should return unclaimed bounties', async () => {
    const user = await userFactory()
    const taskWithBountyUnclaimed = await IssueFactory({
      status: 'closed',
      value: 100,
      paid: false,
      userId: user.id
    })
    const taskWithBountyClaimed = await IssueFactory({
      status: 'closed',
      value: 100,
      paid: true,
      userId: user.id,
      transfer_id: 'some-transfer-id'
    })
    const taskWithoutBounty = await IssueFactory({
      status: 'closed',
      value: 0,
      paid: false,
      userId: user.id
    })

    const taskNoPaidButWithTransfer = await IssueFactory({
      status: 'closed',
      value: 150,
      paid: false,
      userId: user.id
    })
    await TransferFactory({
      taskId: taskNoPaidButWithTransfer.id,
      userId: user.id,
      amount: 150,
      to: user.id
    })
    const unclaimedBounties = await findUnclaimedBounties()
    expect(unclaimedBounties).to.have.lengthOf(1)
    expect(unclaimedBounties[0].id).to.equal(taskWithBountyUnclaimed.id)
  })
})
