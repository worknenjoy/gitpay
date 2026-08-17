import { expect } from 'chai'
import request from 'supertest'
import api from '../../../../src/server'
import { registerAndLogin, truncateModels } from '../../../helpers'
import { withPaymentProvider } from '../../../helpers/whop'
import Models from '../../../../src/models'
import { PayoutFactory, UserFactory } from '../../../factories'

const agent = request.agent(api) as any
const models = Models as any

describe('Whop withdrawal webhooks', () => {
  beforeEach(async () => {
    await truncateModels(models.User)
    await truncateModels(models.Payout)
  })

  it('should mark payout paid on withdrawal.updated succeeded', async () => {
    await withPaymentProvider('whop', async () => {
      const user = await registerAndLogin(agent)
      await PayoutFactory({
        source_id: 'wdrl_hook_1',
        userId: user.body.id,
        amount: 5000,
        currency: 'usd',
        method: 'whop',
        status: 'pending',
        paid: false
      })

      await agent
        .post('/webhooks/whop')
        .send({
          id: 'msg_wdrl_1',
          type: 'withdrawal.updated',
          data: {
            id: 'wdrl_hook_1',
            status: 'completed'
          }
        })
        .expect(200)

      const payout = await models.Payout.findOne({ where: { source_id: 'wdrl_hook_1' } })
      expect(payout.paid).to.equal(true)
      expect(payout.status).to.equal('completed')
    })
  })

  it('should create a new payout when no matching record exists but the company id matches a user', async () => {
    await withPaymentProvider('whop', async () => {
      const user = await UserFactory({
        whop_account_id: 'biz_seller_123',
        receiveNotifications: true
      })

      await agent
        .post('/webhooks/whop')
        .send({
          id: 'msg_wdrl_2',
          type: 'withdrawal.created',
          data: {
            id: 'wdrl_hook_2',
            status: 'pending',
            amount: 50,
            currency: 'usd',
            company_id: 'biz_seller_123'
          }
        })
        .expect(200)

      const payout = await models.Payout.findOne({ where: { source_id: 'wdrl_hook_2' } })
      expect(payout).to.exist
      expect(payout.userId).to.equal(user.dataValues.id)
      expect(payout.method).to.equal('whop')
      expect(payout.status).to.equal('pending')
      expect(Number(payout.amount)).to.equal(5000)
    })
  })

  it('should not create a payout when no matching record exists and the company id is unknown', async () => {
    await withPaymentProvider('whop', async () => {
      await agent
        .post('/webhooks/whop')
        .send({
          id: 'msg_wdrl_3',
          type: 'withdrawal.created',
          data: {
            id: 'wdrl_hook_3',
            status: 'pending',
            amount: 50,
            currency: 'usd',
            company_id: 'biz_unknown'
          }
        })
        .expect(200)

      const payout = await models.Payout.findOne({ where: { source_id: 'wdrl_hook_3' } })
      expect(payout).to.not.exist
    })
  })

  it('should mark payout failed on withdrawal.updated failed status', async () => {
    await withPaymentProvider('whop', async () => {
      const user = await registerAndLogin(agent)
      await PayoutFactory({
        source_id: 'wdrl_hook_4',
        userId: user.body.id,
        amount: 5000,
        currency: 'usd',
        method: 'whop',
        status: 'pending',
        paid: false
      })

      await agent
        .post('/webhooks/whop')
        .send({
          id: 'msg_wdrl_4',
          type: 'withdrawal.updated',
          data: {
            id: 'wdrl_hook_4',
            status: 'failed'
          }
        })
        .expect(200)

      const payout = await models.Payout.findOne({ where: { source_id: 'wdrl_hook_4' } })
      expect(payout.paid).to.equal(false)
      expect(payout.status).to.equal('failed')
    })
  })

  it('should not error when the same status is redelivered', async () => {
    await withPaymentProvider('whop', async () => {
      const user = await registerAndLogin(agent)
      await PayoutFactory({
        source_id: 'wdrl_hook_5',
        userId: user.body.id,
        amount: 5000,
        currency: 'usd',
        method: 'whop',
        status: 'completed',
        paid: true
      })

      await agent
        .post('/webhooks/whop')
        .send({
          id: 'msg_wdrl_5',
          type: 'withdrawal.updated',
          data: {
            id: 'wdrl_hook_5',
            status: 'completed'
          }
        })
        .expect(200)

      const payout = await models.Payout.findOne({ where: { source_id: 'wdrl_hook_5' } })
      expect(payout.paid).to.equal(true)
      expect(payout.status).to.equal('completed')
    })
  })
})
