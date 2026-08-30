import request from 'supertest'
import { expect } from 'chai'
import api from '../../../src/server'
import Models from '../../../src/models'
import { truncateModels } from '../../helpers'
import {
  TaskFactory,
  UserFactory,
  AssignFactory,
  OrderFactory,
  PaymentRequestFactory,
  PaymentRequestPaymentFactory,
  PaymentRequestCustomerFactory
} from '../../factories'

const models = Models as any
const agent = request.agent(api)

describe('GET /users/:id/profile-stats', () => {
  beforeEach(async () => {
    await truncateModels(models.Task)
    await truncateModels(models.User)
    await truncateModels(models.Assign)
    await truncateModels(models.Order)
    await truncateModels(models.Project)
    await truncateModels(models.Organization)
    await truncateModels(models.PaymentRequestPayment)
    await truncateModels(models.PaymentRequestCustomer)
    await truncateModels(models.PaymentRequest)
  })

  it('should return zeroed stats for a brand new user', async () => {
    const user = await UserFactory()

    const res = await agent
      .get(`/users/${user.id}/profile-stats`)
      .expect('Content-Type', /json/)
      .expect(200)

    expect(res.body.contributor.issuesSolvedCount).to.equal(0)
    expect(res.body.contributor.totalEarned).to.equal(0)
    expect(res.body.maintainer.projectsMaintainedCount).to.equal(0)
    expect(res.body.provider.activeLinksCount).to.equal(0)
    expect(res.body.provider.repeatClientsPct).to.equal(null)
    expect(res.body.funding.projectsSponsoredCount).to.equal(0)
  })

  it('should compute contributor stats from accepted assigns on closed, paid tasks', async () => {
    const user = await UserFactory()
    const otherUser = await UserFactory()

    const solvedTask = await TaskFactory({
      userId: otherUser.id,
      status: 'closed',
      paid: true,
      value: 40
    })
    await AssignFactory({ TaskId: solvedTask.id, userId: user.id, status: 'accepted' })

    // unpaid closed task with an accepted assign — counts toward issuesSolvedCount, not totalEarned
    const unpaidTask = await TaskFactory({
      userId: otherUser.id,
      status: 'closed',
      paid: false,
      value: 10
    })
    await AssignFactory({ TaskId: unpaidTask.id, userId: user.id, status: 'accepted' })

    const res = await agent.get(`/users/${user.id}/profile-stats`).expect(200)

    expect(res.body.contributor.issuesSolvedCount).to.equal(2)
    expect(res.body.contributor.totalEarned).to.equal(40)
  })

  it('should compute sponsored/funding stats from succeeded orders', async () => {
    const user = await UserFactory()
    const maintainer = await UserFactory()

    const org = await models.Organization.create({ name: 'Org', UserId: maintainer.id })
    const project = await org.createProject({ name: 'Project' })
    const task = await TaskFactory({ userId: maintainer.id, ProjectId: project.id })

    await OrderFactory({ TaskId: task.id, userId: user.id, status: 'succeeded', amount: 100 })
    await OrderFactory({ TaskId: task.id, userId: user.id, status: 'open', amount: 50 })

    const res = await agent.get(`/users/${user.id}/profile-stats`).expect(200)

    expect(res.body.contributor.issuesSponsoredCount).to.equal(1)
    expect(res.body.funding.totalFunded).to.equal(100)
    expect(res.body.funding.projectsSponsoredCount).to.equal(1)
    expect(res.body.funding.bountiesPlacedCount).to.equal(1)
  })

  it('should compute maintainer stats from projects under owned organizations', async () => {
    const maintainer = await UserFactory()
    const contributor = await UserFactory()
    const sponsor = await UserFactory()

    const org = await models.Organization.create({ name: 'Org', UserId: maintainer.id })
    const project = await org.createProject({ name: 'Project' })

    const openBounty = await TaskFactory({
      userId: maintainer.id,
      ProjectId: project.id,
      status: 'open',
      value: 30
    })
    const closedTask = await TaskFactory({
      userId: maintainer.id,
      ProjectId: project.id,
      status: 'closed',
      value: 30
    })
    await AssignFactory({ TaskId: closedTask.id, userId: contributor.id, status: 'accepted' })
    await OrderFactory({ TaskId: openBounty.id, userId: sponsor.id, status: 'succeeded', amount: 30 })

    const res = await agent.get(`/users/${maintainer.id}/profile-stats`).expect(200)

    expect(res.body.maintainer.projectsMaintainedCount).to.equal(1)
    expect(res.body.maintainer.openBountiesCount).to.equal(1)
    expect(res.body.maintainer.totalFundedForProjects).to.equal(30)
    expect(res.body.maintainer.contributorsCount).to.equal(1)
  })

  it('should compute provider stats from payment link payments', async () => {
    const provider = await UserFactory()

    const paymentRequest = await PaymentRequestFactory({ userId: provider.id, active: true })
    const repeatCustomer = await PaymentRequestCustomerFactory({ userId: provider.id })
    const oneOffCustomer = await PaymentRequestCustomerFactory({ userId: provider.id })

    await PaymentRequestPaymentFactory({
      amount: 100,
      status: 'succeeded',
      source: 'pay_1',
      customerId: repeatCustomer.id,
      paymentRequestId: paymentRequest.id,
      userId: provider.id
    })
    await PaymentRequestPaymentFactory({
      amount: 100,
      status: 'succeeded',
      source: 'pay_2',
      customerId: repeatCustomer.id,
      paymentRequestId: paymentRequest.id,
      userId: provider.id
    })
    await PaymentRequestPaymentFactory({
      amount: 50,
      status: 'succeeded',
      source: 'pay_3',
      customerId: oneOffCustomer.id,
      paymentRequestId: paymentRequest.id,
      userId: provider.id
    })

    const res = await agent.get(`/users/${provider.id}/profile-stats`).expect(200)

    expect(res.body.provider.activeLinksCount).to.equal(1)
    expect(res.body.provider.jobsDeliveredCount).to.equal(3)
    expect(res.body.provider.totalReceived).to.equal(250)
    expect(res.body.provider.repeatClientsPct).to.equal(50)
  })
})
