import { expect } from 'chai'
import request from 'supertest'
import api from '../../../../src/server'
import { registerAndLogin, truncateModels } from '../../../helpers'
import { withPaymentProvider } from '../../../helpers/whop'
import Models from '../../../../src/models'
import { TaskFactory, OrderFactory } from '../../../factories'

const agent = request.agent(api) as any
const models = Models as any

describe('Whop webhooks for bounty orders', () => {
  beforeEach(async () => {
    await truncateModels(models.Task)
    await truncateModels(models.User)
    await truncateModels(models.Order)
  })

  it('should mark order paid on payment.succeeded with order_id metadata', async () => {
    await withPaymentProvider('whop', async () => {
      const user = await registerAndLogin(agent)
      const task = await TaskFactory({
        url: 'https://github.com/test/repo/issues/11',
        userId: user.body.id,
        title: 'Funded via Whop'
      })
      const order = await OrderFactory({
        provider: 'whop',
        source_id: 'chcfg_test',
        amount: 100,
        currency: 'usd',
        userId: user.body.id,
        TaskId: task.id,
        paid: false,
        status: 'open'
      })

      const payload = {
        id: 'msg_whop_order_1',
        api_version: 'v1',
        type: 'payment.succeeded',
        data: {
          id: 'pay_whop_order_1',
          status: 'succeeded',
          metadata: {
            order_id: String(order.id),
            task_id: String(task.id),
            purpose: 'bounty_order'
          }
        }
      }

      await agent.post('/webhooks/whop').send(payload).expect(200)

      const updated = await models.Order.findByPk(order.id)
      expect(updated.paid).to.equal(true)
      expect(updated.status).to.equal('succeeded')
      expect(updated.source).to.equal('pay_whop_order_1')
    })
  })
})
