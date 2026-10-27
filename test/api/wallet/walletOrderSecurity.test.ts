import { expect } from 'chai'
import request from 'supertest'
import nock from 'nock'
import api from '../../../src/server'
import Models from '../../../src/models'
import { truncateModels, registerAndLogin } from '../../helpers'
import { WalletFactory, WalletOrderFactory } from '../../factories'
import { taskPayment } from '../../../src/modules/tasks/taskPayment'

const agent = request.agent(api)
const models = Models as any

describe('Wallet Order and Payment Security Validation', () => {
  beforeEach(async () => {
    await truncateModels(models.User)
    await truncateModels(models.Wallet)
    await truncateModels(models.WalletOrder)
    await truncateModels(models.Task)
    await truncateModels(models.Order)
    await truncateModels(models.Assign)
  })

  describe('Wallet Order Status Mutation Guards', () => {
    it('should reject direct client requests attempting to set status to COMPLETED', async () => {
      const user = await registerAndLogin(agent)
      const wallet = await WalletFactory({
        userId: user.body.id,
        name: 'Security Test Wallet',
        balance: 0
      })
      const walletOrder = await WalletOrderFactory({
        walletId: wallet.id,
        amount: 50,
        status: 'open'
      })

      const res = await agent
        .put(`/wallets/orders/${walletOrder.id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('authorization', user.headers.authorization)
        .send({
          status: 'COMPLETED'
        })
        .expect(403)

      expect(res.body).to.exist
      expect(res.body.error).to.include('Forbidden')

      const refreshed = await models.WalletOrder.findByPk(walletOrder.id)
      expect(refreshed.status).to.equal('open')
    })

    it('should allow valid webhook-driven status transitions to proceed', async () => {
      const user = await registerAndLogin(agent)
      const wallet = await WalletFactory({
        userId: user.body.id,
        name: 'Webhook Test Wallet',
        balance: 0
      })
      const walletOrder = await WalletOrderFactory({
        walletId: wallet.id,
        amount: 75,
        status: 'open'
      })

      const { walletOrderUpdate } = await import('../../../src/modules/walletOrders/walletOrderUpdate')
      const updated = await walletOrderUpdate({
        id: walletOrder.id,
        userId: user.body.id,
        status: 'paid',
        isWebhook: true
      })

      expect(updated).to.exist
      expect(updated.status).to.equal('paid')
    })
  })

  describe('Task Payment Authorization and Balance Guards', () => {
    it('should fail cleanly when user does not own the task', async () => {
      let threw = false
      try {
        await taskPayment({
          taskId: 99999,
          userId: 1234
        })
      } catch (err: any) {
        threw = true
        expect(err.message).to.equal('find_task_error')
      }
      expect(threw).to.be.true
    })
  })
})
