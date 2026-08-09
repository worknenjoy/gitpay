import { expect } from 'chai'
import request from 'supertest'
import nock from 'nock'
import api from '../../../src/server'
import { registerAndLogin, truncateModels } from '../../helpers'
import { withPaymentProvider, pinWhopApiForTests, WHOP_API_HOST } from '../../helpers/whop'
import Models from '../../../src/models'
import {
  TaskFactory,
  OrderFactory,
  PaymentRequestFactory,
  AssignFactory
} from '../../factories'
import { processPendingPaymentRequestTransfers } from '../../../src/services/paymentRequest/processPendingPaymentRequestTransfers'
import { processUnpaidWhopBountyOrders } from '../../../src/services/orders/markBountyOrderPaid'
import { processPendingBountyWhopTransfers } from '../../../src/services/orders/processPendingBountyWhopTransfers'
import { mockPayoutSettlement } from '../../../src/services/payouts/mockPayoutSettlement'

const agent = request.agent(api) as any
const models = Models as any

const pendingLedger = {
  id: 'ldgr_test',
  balances: [{ currency: 'usd', balance: 0, pending_balance: 100, reserve_balance: 0 }]
}

describe('Whop settlement services (script / mock path)', () => {
  beforeEach(async () => {
    await truncateModels(models.User)
    await truncateModels(models.Task)
    await truncateModels(models.Order)
    await truncateModels(models.Assign)
    await truncateModels(models.Transfer)
    await truncateModels(models.Payout)
    await truncateModels(models.PaymentRequest)
    await truncateModels(models.PaymentRequestPayment)
    await truncateModels(models.PaymentRequestCustomer)
    await truncateModels(models.PaymentRequestBalance)
    await truncateModels(models.PaymentRequestBalanceTransaction)
    await truncateModels(models.PaymentRequestTransfer)
    process.env.WHOP_API_KEY = 'test_whop_key'
    process.env.WHOP_COMPANY_ID = 'biz_test_platform'
    pinWhopApiForTests()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('processUnpaidWhopBountyOrders marks open Whop orders as paid', async () => {
    await withPaymentProvider('whop', async () => {
      const user = await registerAndLogin(agent)
      const task = await TaskFactory({
        url: 'https://github.com/test/repo/issues/99',
        userId: user.body.id,
        title: 'Unpaid bounty'
      })
      const order = await OrderFactory({
        provider: 'whop',
        source_id: 'chcfg_unpaid',
        amount: 75,
        currency: 'usd',
        userId: user.body.id,
        TaskId: task.id,
        paid: false,
        status: 'open'
      })

      const result = await processUnpaidWhopBountyOrders({
        orderId: order.id,
        silent: true
      })

      expect(result.scanned).to.equal(1)
      expect(result.paid).to.equal(1)
      expect(result.failed).to.equal(0)

      await order.reload()
      expect(order.paid).to.equal(true)
      expect(order.status).to.equal('succeeded')
      expect(String(order.source)).to.match(/^mock_pay_order_/)
    })
  })

  it('processPendingBountyWhopTransfers with mockSettlement creates transfer without Whop API', async () => {
    await withPaymentProvider('whop', async () => {
      const owner = await registerAndLogin(agent)
      const assigneeRes = await registerAndLogin(agent, {
        email: `assignee_${Date.now()}@example.com`
      })
      expect(assigneeRes).to.exist
      const assignee = await models.User.findByPk(assigneeRes.body.id)
      await assignee.update({ whop_account_id: 'biz_assignee_1' })

      const task = await TaskFactory({
        url: 'https://github.com/test/repo/issues/100',
        userId: owner.body.id,
        title: 'Paid bounty task',
        status: 'closed'
      })

      await OrderFactory({
        provider: 'whop',
        source_id: 'chcfg_paid',
        amount: 100,
        currency: 'usd',
        userId: owner.body.id,
        TaskId: task.id,
        paid: true,
        status: 'succeeded'
      })

      const assign = await AssignFactory({
        userId: assignee.id,
        TaskId: task.id,
        status: 'accepted'
      })
      await task.update({ assigned: assign.id })

      // No nock for /transfers — mock must not call it
      const result = await processPendingBountyWhopTransfers({
        taskId: task.id,
        mockSettlement: true
      })

      expect(result.failed).to.equal(0)
      expect(result.transferred).to.equal(1)
      expect(result.mockSettlement).to.equal(true)

      await task.reload()
      expect(task.transfer_id).to.match(/^mock_tr_bounty_/)

      const transfer = await models.Transfer.findOne({ where: { taskId: task.id } })
      expect(transfer).to.exist
      expect(transfer.transfer_method).to.equal('whop')
      expect(transfer.transfer_id).to.match(/^mock_tr_bounty_/)
      expect(transfer.status).to.equal('in_transit')
    })
  })

  it('mockPayoutSettlement creates a paid Whop payout without withdrawals API', async () => {
    await withPaymentProvider('whop', async () => {
      const user = await registerAndLogin(agent)
      await models.User.update(
        { whop_account_id: 'biz_user_payout' },
        { where: { id: user.body.id } }
      )

      const result = await mockPayoutSettlement({
        userId: user.body.id,
        amount: 42.5,
        currency: 'usd'
      })

      expect(result.created).to.equal(true)
      expect(result.payout.status).to.equal('paid')
      expect(result.payout.method).to.equal('whop')
      expect(String(result.payout.source_id)).to.match(/^mock_wdrl_/)

      const row = await models.Payout.findByPk(result.payout.id)
      expect(row).to.exist
      expect(row.paid).to.equal(true)
    })
  })

  it('mockPayoutSettlement marks existing pending payouts paid', async () => {
    await withPaymentProvider('whop', async () => {
      const user = await registerAndLogin(agent)
      const payout = await models.Payout.create({
        userId: user.body.id,
        source_id: 'wdrl_pending_1',
        amount: 5000,
        currency: 'usd',
        method: 'whop',
        status: 'pending',
        paid: false
      })

      const result = await mockPayoutSettlement({
        userId: user.body.id
      })

      expect(result.updated).to.equal(true)
      await payout.reload()
      expect(payout.status).to.equal('paid')
      expect(payout.paid).to.equal(true)
    })
  })

  it('end-to-end PR path: pay webhook → pending → mock settle', async () => {
    await withPaymentProvider('whop', async () => {
      pinWhopApiForTests()
      nock(WHOP_API_HOST)
        .get('/api/v1/ledger_accounts/biz_test_platform')
        .reply(200, pendingLedger)

      const user = await registerAndLogin(agent)
      await models.User.update(
        { whop_account_id: 'biz_seller_e2e' },
        { where: { id: user.body.id } }
      )

      await PaymentRequestFactory({
        title: 'E2E PR',
        amount: 100,
        currency: 'usd',
        payment_link_id: 'plan_e2e_pr',
        provider: 'whop',
        userId: user.body.id
      })

      await agent
        .post('/webhooks/whop')
        .send({
          id: 'msg_e2e',
          api_version: 'v1',
          type: 'payment.succeeded',
          data: {
            id: 'pay_e2e_1',
            status: 'succeeded',
            amount_after_fees: 92,
            total: 100,
            currency: 'usd',
            metadata: { purpose: 'payment_request', payment_link_id: 'plan_e2e_pr' },
            plan: { id: 'plan_e2e_pr' },
            user: { email: 'c@example.com', name: 'C' }
          }
        })
        .expect(200)

      const settle = await processPendingPaymentRequestTransfers({ mockSettlement: true })
      expect(settle.transferred).to.equal(1)

      const mockPay = await mockPayoutSettlement({
        userId: user.body.id,
        amount: 92,
        currency: 'usd'
      })
      expect(mockPay.created).to.equal(true)
      expect(mockPay.payout.status).to.equal('paid')
    })
  })
})
