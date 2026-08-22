import { expect } from 'chai'
import sinon from 'sinon'
import nock from 'nock'
// Importing the server triggers i18n.configure()/init() as a side effect, which
// PayoutMail requires — this suite calls the sync service directly, not via HTTP.
import '../../../src/server'
import Models from '../../../src/models'
import { truncateModels } from '../../helpers'
import { withPaymentProvider, pinWhopApiForTests, WHOP_API_HOST } from '../../helpers/whop'
import { UserFactory, PayoutFactory } from '../../factories'
import { sendgrid } from '../../../src/config/secrets'
import {
  syncWhopPayoutsForCompany,
  syncWhopPayoutsForAllCompanies
} from '../../../src/services/whop/syncWhopPayouts'
import WhopPayoutSyncCron from '../../../src/crons/whop/whopPayoutSyncCron'

const models = Models as any

describe('Whop payout sync (cron / manual script logic)', () => {
  before(() => {
    // notified_status assertions below require PayoutMail's send to resolve
    // deterministically — force the mock/no-op mail path regardless of
    // whether SENDGRID_API_KEY happens to be set in this environment.
    sinon.stub(sendgrid, 'apiKey').get(() => undefined)
  })

  after(() => {
    sinon.restore()
  })

  beforeEach(async () => {
    await truncateModels(models.User)
    await truncateModels(models.Payout)
    process.env.WHOP_API_KEY = 'test_whop_key'
    process.env.WHOP_COMPANY_ID = 'biz_test_platform'
    pinWhopApiForTests()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('backfills a Payout for a withdrawal Whop reports with no matching source_id', async () => {
    await withPaymentProvider('whop', async () => {
      const user = await UserFactory({
        whop_account_id: 'biz_sync_1',
        receiveNotifications: true
      })

      nock(WHOP_API_HOST)
        .get('/api/v1/withdrawals')
        .query({ company_id: 'biz_sync_1', first: '50' })
        .reply(200, {
          data: [{ id: 'wdrl_sync_backfill', status: 'completed', amount: 25, currency: 'usd' }],
          page_info: { has_next_page: false }
        })

      const result = await syncWhopPayoutsForCompany('biz_sync_1')

      expect(result.scanned).to.equal(1)
      expect(result.failed).to.equal(0)

      const payout = await models.Payout.findOne({ where: { source_id: 'wdrl_sync_backfill' } })
      expect(payout).to.exist
      expect(payout.userId).to.equal(user.dataValues.id)
      expect(payout.status).to.equal('completed')
      expect(payout.notified_status).to.equal('completed')
    })
  })

  it('updates an existing Payout and advances notified_status when status changed', async () => {
    await withPaymentProvider('whop', async () => {
      const user = await UserFactory({ whop_account_id: 'biz_sync_2' })
      await PayoutFactory({
        source_id: 'wdrl_sync_update',
        userId: user.dataValues.id,
        method: 'whop',
        status: 'pending',
        notified_status: 'pending',
        paid: false
      })

      nock(WHOP_API_HOST)
        .get('/api/v1/withdrawals')
        .query({ company_id: 'biz_sync_2', first: '50' })
        .reply(200, {
          data: [{ id: 'wdrl_sync_update', status: 'completed' }],
          page_info: { has_next_page: false }
        })

      await syncWhopPayoutsForCompany('biz_sync_2')

      const payout = await models.Payout.findOne({ where: { source_id: 'wdrl_sync_update' } })
      expect(payout.status).to.equal('completed')
      expect(payout.paid).to.equal(true)
      expect(payout.notified_status).to.equal('completed')
    })
  })

  it('is a no-op when the Payout already matches Whop status and was already notified', async () => {
    await withPaymentProvider('whop', async () => {
      const user = await UserFactory({ whop_account_id: 'biz_sync_3' })
      const payout = await PayoutFactory({
        source_id: 'wdrl_sync_noop',
        userId: user.dataValues.id,
        method: 'whop',
        status: 'completed',
        notified_status: 'completed',
        paid: true
      })
      const updatedAtBefore = payout.updatedAt.getTime()

      nock(WHOP_API_HOST)
        .get('/api/v1/withdrawals')
        .query({ company_id: 'biz_sync_3', first: '50' })
        .reply(200, {
          data: [{ id: 'wdrl_sync_noop', status: 'completed' }],
          page_info: { has_next_page: false }
        })

      await syncWhopPayoutsForCompany('biz_sync_3')

      const reloaded = await models.Payout.findOne({ where: { source_id: 'wdrl_sync_noop' } })
      expect(reloaded.status).to.equal('completed')
      expect(reloaded.notified_status).to.equal('completed')
      expect(reloaded.updatedAt.getTime()).to.equal(updatedAtBefore)
    })
  })

  it('walks all pages of the withdrawal list', async () => {
    await withPaymentProvider('whop', async () => {
      await UserFactory({ whop_account_id: 'biz_sync_paged' })

      nock(WHOP_API_HOST)
        .get('/api/v1/withdrawals')
        .query({ company_id: 'biz_sync_paged', first: '50' })
        .reply(200, {
          data: [{ id: 'wdrl_sync_page_1', status: 'pending', amount: 10, currency: 'usd' }],
          page_info: { has_next_page: true, end_cursor: 'cursor_1' }
        })

      nock(WHOP_API_HOST)
        .get('/api/v1/withdrawals')
        .query({ company_id: 'biz_sync_paged', first: '50', after: 'cursor_1' })
        .reply(200, {
          data: [{ id: 'wdrl_sync_page_2', status: 'pending', amount: 20, currency: 'usd' }],
          page_info: { has_next_page: false }
        })

      const result = await syncWhopPayoutsForCompany('biz_sync_paged')

      expect(result.scanned).to.equal(2)
      const page1 = await models.Payout.findOne({ where: { source_id: 'wdrl_sync_page_1' } })
      const page2 = await models.Payout.findOne({ where: { source_id: 'wdrl_sync_page_2' } })
      expect(page1).to.exist
      expect(page2).to.exist
    })
  })

  it('syncs every connected company and does not let one failure block the rest', async () => {
    await withPaymentProvider('whop', async () => {
      await UserFactory({ whop_account_id: 'biz_sync_all_1' })
      await UserFactory({ whop_account_id: 'biz_sync_all_2' })

      nock(WHOP_API_HOST)
        .get('/api/v1/withdrawals')
        .query({ company_id: 'biz_sync_all_1', first: '50' })
        .replyWithError('network error')

      nock(WHOP_API_HOST)
        .get('/api/v1/withdrawals')
        .query({ company_id: 'biz_sync_all_2', first: '50' })
        .reply(200, {
          data: [{ id: 'wdrl_sync_all_2', status: 'completed', amount: 5, currency: 'usd' }],
          page_info: { has_next_page: false }
        })

      const result = await syncWhopPayoutsForAllCompanies()

      expect(result.companies).to.equal(2)
      const payout = await models.Payout.findOne({ where: { source_id: 'wdrl_sync_all_2' } })
      expect(payout).to.exist
    })
  })

  describe('WhopPayoutSyncCron (bounded recent-window pass)', () => {
    it('only asks Whop for withdrawals from roughly the last 7 days', async () => {
      await withPaymentProvider('whop', async () => {
        await UserFactory({ whop_account_id: 'biz_sync_cron' })

        let requestedCreatedAfter: number | undefined
        nock(WHOP_API_HOST)
          .get('/api/v1/withdrawals')
          .query((q) => {
            requestedCreatedAfter = Number(q.created_after)
            return q.company_id === 'biz_sync_cron'
          })
          .reply(200, { data: [], page_info: { has_next_page: false } })

        await WhopPayoutSyncCron.syncRecentPayouts()

        const sevenDaysAgo = Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000)
        expect(requestedCreatedAfter).to.be.a('number')
        // Allow a few seconds of test-run slack around the 7-day boundary.
        expect(requestedCreatedAfter).to.be.closeTo(sevenDaysAgo, 30)
      })
    })
  })
})
