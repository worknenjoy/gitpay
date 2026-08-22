import { expect } from 'chai'
import sinon from 'sinon'
import request from 'supertest'
import api from '../../../../src/server'
import { registerAndLogin, truncateModels } from '../../../helpers'
import { withPaymentProvider } from '../../../helpers/whop'
import Models from '../../../../src/models'
import { PayoutFactory, UserFactory } from '../../../factories'
import { sendgrid } from '../../../../src/config/secrets'

const agent = request.agent(api) as any
const models = Models as any

describe('Whop withdrawal webhooks', () => {
  before(() => {
    // notified_status assertions below require PayoutMail's send to resolve
    // deterministically — force the mock/no-op mail path regardless of
    // whether SENDGRID_API_KEY happens to be set in this environment (CI may
    // set it for other suites; real delivery must never gate these tests).
    sinon.stub(sendgrid, 'apiKey').get(() => undefined)
  })

  after(() => {
    sinon.restore()
  })

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
        notified_status: 'pending',
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
      expect(payout.notified_status).to.equal('completed')
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
          company_id: 'biz_seller_123',
          data: {
            id: 'wdrl_hook_2',
            status: 'pending',
            amount: 50,
            currency: 'usd'
          }
        })
        .expect(200)

      const payout = await models.Payout.findOne({ where: { source_id: 'wdrl_hook_2' } })
      expect(payout).to.exist
      expect(payout.userId).to.equal(user.dataValues.id)
      expect(payout.method).to.equal('whop')
      expect(payout.status).to.equal('pending')
      expect(Number(payout.amount)).to.equal(5000)
      expect(payout.notified_status).to.equal('pending')
    })
  })

  it('should still resolve company_id nested inside data as a fallback (real Whop envelope shape is top-level)', async () => {
    // Whop's real envelope always puts company_id as a sibling of `data`
    // (asserted by the two tests above using that shape). This covers the
    // deliberate fallback to a data-nested company_id, kept in case Whop ever
    // changes shape or a differently-shaped payload reaches the handler.
    await withPaymentProvider('whop', async () => {
      const user = await UserFactory({
        whop_account_id: 'biz_seller_nested',
        receiveNotifications: true
      })

      await agent
        .post('/webhooks/whop')
        .send({
          id: 'msg_wdrl_nested',
          type: 'withdrawal.created',
          data: {
            id: 'wdrl_hook_nested',
            status: 'pending',
            amount: 50,
            currency: 'usd',
            company_id: 'biz_seller_nested'
          }
        })
        .expect(200)

      const payout = await models.Payout.findOne({ where: { source_id: 'wdrl_hook_nested' } })
      expect(payout).to.exist
      expect(payout.userId).to.equal(user.dataValues.id)
    })
  })

  it('should not create a payout when no matching record exists and the company id is unknown', async () => {
    await withPaymentProvider('whop', async () => {
      await agent
        .post('/webhooks/whop')
        .send({
          id: 'msg_wdrl_3',
          type: 'withdrawal.created',
          company_id: 'biz_unknown',
          data: {
            id: 'wdrl_hook_3',
            status: 'pending',
            amount: 50,
            currency: 'usd'
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
        notified_status: 'pending',
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
      expect(payout.notified_status).to.equal('failed')
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
        notified_status: 'completed',
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
      expect(payout.notified_status).to.equal('completed')
    })
  })

  it('should retry the notification email on the next event if a prior send was never confirmed', async () => {
    // Simulates a payout whose status already matches Whop's (e.g. a previous
    // mail send failed silently before notified_status could advance) — a new
    // event carrying the same status should still trigger a retry.
    await withPaymentProvider('whop', async () => {
      const user = await registerAndLogin(agent)
      await PayoutFactory({
        source_id: 'wdrl_hook_6',
        userId: user.body.id,
        amount: 5000,
        currency: 'usd',
        method: 'whop',
        status: 'completed',
        notified_status: null,
        paid: true
      })

      await agent
        .post('/webhooks/whop')
        .send({
          id: 'msg_wdrl_6',
          type: 'withdrawal.updated',
          data: {
            id: 'wdrl_hook_6',
            status: 'completed'
          }
        })
        .expect(200)

      const payout = await models.Payout.findOne({ where: { source_id: 'wdrl_hook_6' } })
      expect(payout.status).to.equal('completed')
      expect(payout.notified_status).to.equal('completed')
    })
  })
})
