import { expect } from 'chai'
import request from 'supertest'
import api from '../../../../src/server'
import { registerAndLogin, truncateModels } from '../../../helpers'
import { withPaymentProvider } from '../../../helpers/whop'
import Models from '../../../../src/models'
import { PayoutFactory } from '../../../factories'

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
})
