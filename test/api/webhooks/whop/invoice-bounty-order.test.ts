import { expect } from 'chai'
import request from 'supertest'
import api from '../../../../src/server'
import { registerAndLogin, truncateModels } from '../../../helpers'
import { withPaymentProvider } from '../../../helpers/whop'
import Models from '../../../../src/models'
import { TaskFactory, OrderFactory } from '../../../factories'

const agent = request.agent(api) as any
const models = Models as any

describe('Whop invoice.paid for bounty orders', () => {
  beforeEach(async () => {
    await truncateModels(models.Task)
    await truncateModels(models.User)
    await truncateModels(models.Order)
  })

  it('should mark invoice order paid on invoice.paid', async () => {
    await withPaymentProvider('whop', async () => {
      const user = await registerAndLogin(agent)
      const task = await TaskFactory({
        url: 'https://github.com/test/repo/issues/12',
        userId: user.body.id
      })
      const order = await OrderFactory({
        provider: 'whop',
        source_id: 'inv_test_whop_order',
        source_type: 'invoice-item',
        amount: 50,
        currency: 'usd',
        userId: user.body.id,
        TaskId: task.id,
        paid: false,
        status: 'open'
      })

      const payload = {
        id: 'msg_inv_1',
        type: 'invoice.paid',
        data: {
          id: 'inv_test_whop_order',
          status: 'paid'
        }
      }

      await agent.post('/webhooks/whop').send(payload).expect(200)

      const updated = await models.Order.findByPk(order.id)
      expect(updated.paid).to.equal(true)
      expect(updated.status).to.equal('succeeded')
    })
  })
})
