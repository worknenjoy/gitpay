import { expect } from 'chai'
import request from 'supertest'
import nock from 'nock'
import jwt from 'jsonwebtoken'
import api from '../../../src/server'
import { registerAndLogin, truncateModels } from '../../helpers'
import { withPaymentProvider, pinWhopApiForTests, WHOP_API_HOST } from '../../helpers/whop'
import Models from '../../../src/models'
import { TaskFactory, OrderFactory, AssignFactory, UserFactory } from '../../factories'
import transferCreate from '../../data/whop/transfer.create'

const agent = request.agent(api) as any
const models = Models as any

// Mints a valid session token for a user created directly via a factory,
// so /transfers/create can be authorized as the task's assigned claimer.
const tokenFor = (userId: number) => `Bearer ${jwt.sign({ id: userId }, process.env.SECRET_PHRASE as string)}`

describe('POST /transfers/create (Whop)', () => {
  beforeEach(async () => {
    await truncateModels(models.Task)
    await truncateModels(models.User)
    await truncateModels(models.Assign)
    await truncateModels(models.Order)
    await truncateModels(models.Transfer)
    process.env.WHOP_API_KEY = 'test_whop_key'
    process.env.WHOP_COMPANY_ID = 'biz_test_platform'
    pinWhopApiForTests()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('should transfer Whop-funded bounty to assignee whop_account_id', async () => {
    await withPaymentProvider('whop', async () => {
      pinWhopApiForTests()
      nock(WHOP_API_HOST).post('/api/v1/transfers').reply(200, transferCreate)

      const owner = await registerAndLogin(agent)
      const assignee = await UserFactory({
        email: `assignee_${Date.now()}@test.com`,
        password: 'test123',
        whop_account_id: 'biz_assignee_whop'
      })

      const task = await TaskFactory({
        url: 'https://github.com/test/repo/issues/99',
        userId: owner.body.id,
        title: 'Whop transfer task',
        value: 100,
        status: 'closed'
      })

      await OrderFactory({
        provider: 'whop',
        amount: 100,
        currency: 'usd',
        paid: true,
        status: 'succeeded',
        userId: owner.body.id,
        TaskId: task.id
      })

      const assign = await AssignFactory({
        userId: assignee.id,
        TaskId: task.id
      })

      await task.update({ assigned: assign.id })

      const res = await agent
        .post('/transfers/create')
        .send({ taskId: task.id })
        .set('Authorization', tokenFor(assignee.id))
        .expect(200)

      expect(res.body).to.exist
      expect(res.body.error).to.not.exist
      expect(res.body.transfer_method).to.equal('whop')
      expect(res.body.transfer_id).to.equal(transferCreate.id)
      expect(res.body.status).to.equal('in_transit')
    })
  })

  it('should pending when assignee has no whop_account_id', async () => {
    await withPaymentProvider('whop', async () => {
      pinWhopApiForTests()
      const owner = await registerAndLogin(agent)
      const assignee = await UserFactory({
        email: `noaccount_${Date.now()}@test.com`,
        password: 'test123'
      })

      const task = await TaskFactory({
        url: 'https://github.com/test/repo/issues/100',
        userId: owner.body.id,
        value: 50,
        status: 'closed'
      })

      await OrderFactory({
        provider: 'whop',
        amount: 50,
        paid: true,
        status: 'succeeded',
        userId: owner.body.id,
        TaskId: task.id
      })

      const assign = await AssignFactory({
        userId: assignee.id,
        TaskId: task.id
      })
      await task.update({ assigned: assign.id })

      const res = await agent
        .post('/transfers/create')
        .send({ taskId: task.id })
        .set('Authorization', tokenFor(assignee.id))
        .expect(200)

      expect(res.body.transfer_method).to.equal('whop')
      expect(res.body.comment).to.include('Whop')
    })
  })
})
