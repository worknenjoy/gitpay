import { expect } from 'chai'
import chai from 'chai'
import spies from 'chai-spies'
import api from '../../../src/server'
import Models from '../../../src/models'
import nock from 'nock'
import request from 'supertest'
import { createTask, createOrder, createPayout, truncateModels } from '../../helpers'
import SendMail from '../../../src/modules/mail/mail'
import { scripts } from '../../../src/scripts/scripts'
import { get as sampleCharge } from '../../data/stripe/stripe.charge'
import { get as sampleTransaction } from '../../data/stripe/stripe.charge.balance_transaction'

const agent = request.agent(api)
const models = Models as any

describe('Script Execution', () => {
  beforeEach(async () => {
    await truncateModels(models.Task)
    await truncateModels(models.User)
    await truncateModels(models.Assign)
    await truncateModels(models.Order)
    await truncateModels(models.Transfer)
    await truncateModels(models.Payout)
  })

  afterEach(async () => {
    nock.cleanAll()
  })

  describe('Scripts', () => {
    it('Check for total Gitpay Balance', async () => {
      try {
        nock('https://api.stripe.com').persist().get('/v1/charges/ch_123').reply(200, sampleCharge)

        nock('https://api.stripe.com')
          .persist()
          .get('/v1/balance_transactions/txn_123')
          .reply(200, sampleTransaction)

        const task = await createTask(agent)
        const { body: taskData } = task
        const order = await createOrder({
          userId: taskData.userId,
          TaskId: taskData.id,
          paid: true,
          provider: 'stripe',
          source: 'ch_123',
          amount: 100
        })
        const payout = await createPayout({
          userId: taskData.userId,
          source_id: '123',
          amount: 100,
          method: 'stripe'
        })

        const scriptBalance = await scripts.balance()
        expect(scriptBalance).to.deep.equal({ payments_fee: '2.95', payouts: '8.00' })
      } catch (e) {
        console.log('error on transfer', e)
        throw e
      }
    })
    xit('Check for invalid tasks and delete it', async () => {
      const res = await agent
        .post('/auth/register')
        .send({ email: 'testscripts@gitpay.me', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(200)

      const tasks = await Promise.all([
        models.Task.build({
          provider: 'github',
          url: 'https://github.com/worknenjoy/truppie/issues/120',
          userId: res.body.id
        }).save(),
        models.Task.build({
          provider: 'github',
          url: 'https://github.com/worknenjoy/truppie/issues/130',
          userId: res.body.id,
          status: 'in_progress'
        }).save(),
        models.Task.build({
          provider: 'github',
          url: 'https://github.com/worknenjoy/truppie/issues/143',
          userId: res.body.id,
          status: 'closed',
          value: 100
        }).save(),
        models.Task.build({
          provider: 'github',
          url: 'https://github.com/worknenjoy/truppie/issues/7366',
          userId: res.body.id
        }).save(),
        models.Task.build({
          provider: 'github',
          url: 'https://github.com/worknenjoy/truppie/issues/test',
          userId: res.body.id,
          value: 50
        }).save()
      ])

      chai.use(spies)
      const mailSpySuccess = chai.spy.on(SendMail, 'success')

      const result = await scripts.deleteInvalidTasks()
      const resulUrls = result.map((r: any) => r.dataValues.url)
      expect(resulUrls).to.include('https://github.com/worknenjoy/truppie/issues/7366')
      expect(resulUrls).to.include('https://github.com/worknenjoy/truppie/issues/test')

      const deletedArrays = [
        models.Task.findOne({
          where: { url: 'https://github.com/worknenjoy/truppie/issues/7366' }
        }),
        models.Task.findOne({
          where: { url: 'https://github.com/worknenjoy/truppie/issues/test' }
        }),
        models.Task.findOne({
          where: { url: 'https://github.com/worknenjoy/truppie/issues/120' }
        }),
        models.Task.findOne({
          where: { url: 'https://github.com/worknenjoy/truppie/issues/130' }
        }),
        models.Task.findOne({
          where: { url: 'https://github.com/worknenjoy/truppie/issues/143' }
        })
      ]

      const deletedTasks = await Promise.all(deletedArrays)
      expect(deletedTasks[0]).to.equal(null)
      expect(deletedTasks[1]).to.equal(null)
      expect(deletedTasks[2]).not.to.equal(null)
      expect(deletedTasks[3]).not.to.equal(null)
      expect(deletedTasks[4]).not.to.equal(null)
      expect(mailSpySuccess).to.have.been.called()
    })
  })
})
