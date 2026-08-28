import nock from 'nock'
import { expect } from 'chai'
import request from 'supertest'
import api from '../../../src/server'
import Models from '../../../src/models'
import { registerAndLogin, truncateModels } from '../../helpers'
import { withPaymentProvider, pinWhopApiForTests, WHOP_API_HOST } from '../../helpers/whop'
import whopCompany from '../../data/whop/company.json'

const models = Models as any
const agent = request.agent(api) as any

describe('User Account (Whop)', () => {
  beforeEach(async () => {
    await truncateModels(models.User)
    process.env.WHOP_API_KEY = 'test_whop_key'
    process.env.WHOP_COMPANY_ID = 'biz_test_platform'
    pinWhopApiForTests()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('should return provider whop and inactive when user has no connected company', async () => {
    await withPaymentProvider('whop', async () => {
      pinWhopApiForTests()
      const user = await registerAndLogin(agent)

      const res = await agent
        .get('/user/account')
        .set('Authorization', user.headers.authorization)
        .expect(200)

      expect(res.body.provider).to.equal('whop')
      expect(res.body.active).to.equal(false)
    })
  })

  it('should return a normalized active whop account with a met requirements checklist', async () => {
    await withPaymentProvider('whop', async () => {
      pinWhopApiForTests()
      nock(WHOP_API_HOST).get('/api/v1/companies/biz_user_whop_1').reply(200, whopCompany)
      nock(WHOP_API_HOST)
        .get('/api/v1/accounts/biz_user_whop_1')
        .reply(200, { id: 'biz_user_whop_1' })
      nock(WHOP_API_HOST)
        .get('/api/v1/ledger_accounts/biz_user_whop_1')
        .reply(200, {
          id: 'ldgr_test_1',
          balances: [
            { currency: 'usd', balance: 120, pending_balance: 30, reserve_balance: 0 }
          ]
        })
      nock(WHOP_API_HOST)
        .get('/api/v1/payout_methods')
        .query({ company_id: 'biz_user_whop_1' })
        .reply(200, {
          data: [
            {
              id: 'potk_test_1',
              nickname: 'Ops checking',
              institution_name: 'Test Bank',
              account_reference: '****4242',
              currency: 'usd',
              is_default: true,
              destination: { category: 'next_day_bank', name: 'Test Bank', country_code: 'US' }
            }
          ]
        })

      const user = await registerAndLogin(agent)
      await models.User.update(
        { whop_account_id: 'biz_user_whop_1' },
        { where: { id: user.body.id } }
      )

      const res = await agent
        .get('/user/account')
        .set('Authorization', user.headers.authorization)
        .expect(200)

      expect(res.body.provider).to.equal('whop')
      expect(res.body.active).to.equal(true)
      expect(res.body.id).to.equal('biz_user_whop_1')
      expect(res.body.balances).to.deep.equal({ available: 120, pending: 30, reserve: 0 })

      const checklist = res.body.requirements.checklist
      const byKey = Object.fromEntries(checklist.map((i: any) => [i.key, i.status]))
      expect(byKey.identity_document).to.equal('done')
      expect(byKey.payout_method).to.equal('done')
      expect(byKey.company_profile).to.equal('done')
      expect(byKey.gitpay_connection).to.equal('done')
      expect(res.body.requirements.currently_due).to.deep.equal([])

      expect(res.body.identity.identityCheck).to.equal('verified')
      expect(res.body.identity.taxForm).to.equal('W-8BEN')
      expect(res.body.payout_method.id).to.equal('potk_test_1')
      expect(res.body.payout_method.label).to.equal('Ops checking')
      expect(res.body.payout_method.last4).to.equal('4242')
      expect(res.body.payouts_enabled).to.equal(true)
      // Country is never derived from live Whop data (see dedicated test below) —
      // Users.country wasn't set for this user, so it stays null.
      expect(res.body.country).to.equal(null)
    })
  })

  it('should mark identity_document and payout_method required when not verified and no payout method', async () => {
    await withPaymentProvider('whop', async () => {
      pinWhopApiForTests()
      nock(WHOP_API_HOST)
        .get('/api/v1/companies/biz_user_whop_2')
        .reply(200, { ...whopCompany, id: 'biz_user_whop_2', verified: false })
      nock(WHOP_API_HOST)
        .get('/api/v1/accounts/biz_user_whop_2')
        .reply(200, { id: 'biz_user_whop_2', country: null })
      nock(WHOP_API_HOST)
        .get('/api/v1/ledger_accounts/biz_user_whop_2')
        .reply(200, { id: 'ldgr_test_2', balances: [] })
      nock(WHOP_API_HOST)
        .get('/api/v1/payout_methods')
        .query({ company_id: 'biz_user_whop_2' })
        .reply(200, { data: [] })

      const user = await registerAndLogin(agent)
      await models.User.update(
        { whop_account_id: 'biz_user_whop_2' },
        { where: { id: user.body.id } }
      )

      const res = await agent
        .get('/user/account')
        .set('Authorization', user.headers.authorization)
        .expect(200)

      expect(res.body.active).to.equal(false)
      expect(res.body.requirements.currently_due).to.include('identity_document')
      expect(res.body.requirements.currently_due).to.include('payout_method')
      expect(res.body.payouts_enabled).to.equal(false)
      expect(res.body.identity.identityCheck).to.equal('unverified')
    })
  })

  it('never derives country from live Whop data — reads Users.country only', async () => {
    await withPaymentProvider('whop', async () => {
      pinWhopApiForTests()
      nock(WHOP_API_HOST).get('/api/v1/companies/biz_user_whop_8').reply(200, {
        ...whopCompany,
        id: 'biz_user_whop_8'
      })
      nock(WHOP_API_HOST)
        .get('/api/v1/accounts/biz_user_whop_8')
        // `country` here stands in for a value leaked from an unrelated account/the
        // platform default (this beta endpoint has been observed doing exactly that)
        // and must never end up in the response, regardless of Users.country.
        .reply(200, { id: 'biz_user_whop_8', country: 'us' })
      nock(WHOP_API_HOST)
        .get('/api/v1/ledger_accounts/biz_user_whop_8')
        .reply(200, { id: 'ldgr_test_8', balances: [] })
      nock(WHOP_API_HOST)
        .get('/api/v1/payout_methods')
        .query({ company_id: 'biz_user_whop_8' })
        .reply(200, { data: [] })

      const user = await registerAndLogin(agent)
      await models.User.update(
        { whop_account_id: 'biz_user_whop_8', country: 'BR' },
        { where: { id: user.body.id } }
      )

      const res = await agent
        .get('/user/account')
        .set('Authorization', user.headers.authorization)
        .expect(200)

      expect(res.body.country).to.equal('BR')
    })
  })

  it('should be active when Whop capabilities.standard_payout is active even if company.verified is not yet true', async () => {
    await withPaymentProvider('whop', async () => {
      pinWhopApiForTests()
      nock(WHOP_API_HOST)
        .get('/api/v1/companies/biz_user_whop_5')
        .reply(200, { ...whopCompany, id: 'biz_user_whop_5', verified: false })
      nock(WHOP_API_HOST)
        .get('/api/v1/accounts/biz_user_whop_5')
        .reply(200, {
          id: 'biz_user_whop_5',
          country: 'us',
          capabilities: { standard_payout: 'active' }
        })
      nock(WHOP_API_HOST)
        .get('/api/v1/ledger_accounts/biz_user_whop_5')
        .reply(200, { id: 'ldgr_test_5', balances: [] })
      nock(WHOP_API_HOST)
        .get('/api/v1/payout_methods')
        .query({ company_id: 'biz_user_whop_5' })
        .reply(200, {
          data: [
            {
              id: 'potk_test_5',
              nickname: 'Ops checking',
              institution_name: 'Test Bank',
              account_reference: '****4242',
              currency: 'usd',
              is_default: true,
              destination: { category: 'next_day_bank', name: 'Test Bank', country_code: 'US' }
            }
          ]
        })

      const user = await registerAndLogin(agent)
      await models.User.update(
        { whop_account_id: 'biz_user_whop_5' },
        { where: { id: user.body.id } }
      )

      const res = await agent
        .get('/user/account')
        .set('Authorization', user.headers.authorization)
        .expect(200)

      expect(res.body.active).to.equal(true)
      expect(res.body.payouts_enabled).to.equal(true)
    })
  })

  it('should stay pending when KYC/capability is active but no payout method has been added yet', async () => {
    await withPaymentProvider('whop', async () => {
      pinWhopApiForTests()
      nock(WHOP_API_HOST)
        .get('/api/v1/companies/biz_user_whop_6')
        .reply(200, { ...whopCompany, id: 'biz_user_whop_6', verified: true })
      nock(WHOP_API_HOST)
        .get('/api/v1/accounts/biz_user_whop_6')
        .reply(200, {
          id: 'biz_user_whop_6',
          country: 'us',
          capabilities: { standard_payout: 'active' }
        })
      nock(WHOP_API_HOST)
        .get('/api/v1/ledger_accounts/biz_user_whop_6')
        .reply(200, { id: 'ldgr_test_6', balances: [] })
      nock(WHOP_API_HOST)
        .get('/api/v1/payout_methods')
        .query({ company_id: 'biz_user_whop_6' })
        .reply(200, { data: [] })

      const user = await registerAndLogin(agent)
      await models.User.update(
        { whop_account_id: 'biz_user_whop_6' },
        { where: { id: user.body.id } }
      )

      const res = await agent
        .get('/user/account')
        .set('Authorization', user.headers.authorization)
        .expect(200)

      expect(res.body.active).to.equal(false)
      expect(res.body.payouts_enabled).to.equal(false)
    })
  })

  it('should stay pending when Whop capabilities.standard_payout is pending, even with a payout method on file', async () => {
    await withPaymentProvider('whop', async () => {
      pinWhopApiForTests()
      nock(WHOP_API_HOST)
        .get('/api/v1/companies/biz_user_whop_7')
        .reply(200, { ...whopCompany, id: 'biz_user_whop_7', verified: true })
      nock(WHOP_API_HOST)
        .get('/api/v1/accounts/biz_user_whop_7')
        .reply(200, {
          id: 'biz_user_whop_7',
          country: 'us',
          capabilities: { standard_payout: 'pending' }
        })
      nock(WHOP_API_HOST)
        .get('/api/v1/ledger_accounts/biz_user_whop_7')
        .reply(200, { id: 'ldgr_test_7', balances: [] })
      nock(WHOP_API_HOST)
        .get('/api/v1/payout_methods')
        .query({ company_id: 'biz_user_whop_7' })
        .reply(200, {
          data: [
            {
              id: 'potk_test_7',
              nickname: 'Ops checking',
              institution_name: 'Test Bank',
              account_reference: '****4242',
              currency: 'usd',
              is_default: true,
              destination: { category: 'next_day_bank', name: 'Test Bank', country_code: 'US' }
            }
          ]
        })

      const user = await registerAndLogin(agent)
      await models.User.update(
        { whop_account_id: 'biz_user_whop_7' },
        { where: { id: user.body.id } }
      )

      const res = await agent
        .get('/user/account')
        .set('Authorization', user.headers.authorization)
        .expect(200)

      expect(res.body.active).to.equal(false)
      expect(res.body.payouts_enabled).to.equal(false)
    })
  })

  describe('verification link provider routing', () => {
    it('generates a Whop account link (not Stripe) when provider=whop even if a legacy Stripe account exists', async () => {
      const previousApiHost = process.env.WHOP_API_HOST
      process.env.WHOP_API_HOST = 'https://api.whop.com'
      try {
        await withPaymentProvider('whop', async () => {
          pinWhopApiForTests()
          const scope = nock(WHOP_API_HOST)
            .post('/api/v1/account_links')
            .reply(200, { url: 'https://whop.com/onboard/abc' })

          const user = await registerAndLogin(agent)
          await models.User.update(
            { whop_account_id: 'biz_user_whop_1', account_id: 'acct_legacy_stripe_1' },
            { where: { id: user.body.id } }
          )

          const res = await agent
            .post('/user/account/verification-link')
            .set('Authorization', user.headers.authorization)
            .send({ provider: 'whop' })
            .expect(200)

          expect(res.body.provider).to.equal('whop')
          expect(res.body.url).to.equal('https://whop.com/onboard/abc')
          expect(scope.isDone()).to.equal(true)
        })
      } finally {
        if (previousApiHost === undefined) delete process.env.WHOP_API_HOST
        else process.env.WHOP_API_HOST = previousApiHost
      }
    })

    it('maps purpose=payout to the payouts_portal use_case, and defaults to account_onboarding', async () => {
      const previousApiHost = process.env.WHOP_API_HOST
      process.env.WHOP_API_HOST = 'https://api.whop.com'
      try {
        await withPaymentProvider('whop', async () => {
          pinWhopApiForTests()

          let lastBody: any = null
          nock(WHOP_API_HOST)
            .post('/api/v1/account_links')
            .times(3)
            .reply(200, function (_uri, body) {
              lastBody = body
              return { url: 'https://whop.com/onboard/abc' }
            })

          const user = await registerAndLogin(agent)
          await models.User.update(
            { whop_account_id: 'biz_user_whop_3' },
            { where: { id: user.body.id } }
          )

          await agent
            .post('/user/account/verification-link')
            .set('Authorization', user.headers.authorization)
            .send({ provider: 'whop', purpose: 'payout' })
            .expect(200)
          expect(lastBody.use_case).to.equal('payouts_portal')

          await agent
            .post('/user/account/verification-link')
            .set('Authorization', user.headers.authorization)
            .send({ provider: 'whop', purpose: 'identity' })
            .expect(200)
          expect(lastBody.use_case).to.equal('account_onboarding')

          await agent
            .post('/user/account/verification-link')
            .set('Authorization', user.headers.authorization)
            .send({ provider: 'whop' })
            .expect(200)
          expect(lastBody.use_case).to.equal('account_onboarding')
        })
      } finally {
        if (previousApiHost === undefined) delete process.env.WHOP_API_HOST
        else process.env.WHOP_API_HOST = previousApiHost
      }
    })
  })
})
