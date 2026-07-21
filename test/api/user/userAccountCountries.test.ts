import { expect } from 'chai'
import request from 'supertest'
import api from '../../../src/server'
import { registerAndLogin, truncateModels } from '../../helpers'
import Models from '../../../src/models'
import { withPaymentProvider } from '../../helpers/whop'
import {
  getSupportedCountriesForProvider,
  STRIPE_SUPPORTED_COUNTRIES,
  WHOP_SUPPORTED_COUNTRIES
} from '../../../src/providers/shared/supportedCountries'

const agent = request.agent(api) as any
const models = Models as any

describe('Supported countries by payment provider', () => {
  it('stripe list is the Gitpay Connect product set', () => {
    const list = getSupportedCountriesForProvider('stripe')
    expect(list.length).to.equal(STRIPE_SUPPORTED_COUNTRIES.length)
    expect(list.find((c) => c.code === 'US')).to.exist
    expect(list.find((c) => c.code === 'BR')).to.exist
    // Whop-only territories should not appear on Stripe list
    expect(list.find((c) => c.code === 'AR')).to.not.exist
  })

  it('whop list is larger and includes additional payout countries', () => {
    const list = getSupportedCountriesForProvider('whop')
    expect(list.length).to.equal(WHOP_SUPPORTED_COUNTRIES.length)
    expect(list.length).to.be.greaterThan(STRIPE_SUPPORTED_COUNTRIES.length)
    expect(list.find((c) => c.code === 'US')).to.exist
    expect(list.find((c) => c.code === 'AR')).to.exist
    expect(list.find((c) => c.code === 'KR')).to.exist
  })
})

describe('GET /user/account/countries', () => {
  beforeEach(async () => {
    await truncateModels(models.User)
  })

  it('returns stripe countries and provider when PAYMENT_PROVIDER=stripe', async () => {
    await withPaymentProvider('stripe', async () => {
      const user = await registerAndLogin(agent)
      const res = await agent
        .get('/user/account/countries')
        .set('Authorization', user.headers.authorization)
        .expect(200)

      expect(res.body.provider).to.equal('stripe')
      expect(res.body.countries).to.be.an('array')
      expect(res.body.countries.length).to.equal(STRIPE_SUPPORTED_COUNTRIES.length)
      expect(res.body.countries[0]).to.have.property('code')
      expect(res.body.countries[0]).to.have.property('country')
    })
  })

  it('returns whop countries when PAYMENT_PROVIDER=whop', async () => {
    await withPaymentProvider('whop', async () => {
      const user = await registerAndLogin(agent)
      const res = await agent
        .get('/user/account/countries')
        .set('Authorization', user.headers.authorization)
        .expect(200)

      expect(res.body.provider).to.equal('whop')
      expect(res.body.countries).to.be.an('array')
      expect(res.body.countries.length).to.equal(WHOP_SUPPORTED_COUNTRIES.length)
      expect(res.body.countries.find((c: any) => c.code === 'AR')).to.exist
    })
  })
})
