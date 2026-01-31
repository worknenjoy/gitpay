import { expect } from 'chai'
import request from 'supertest'
import nock from 'nock'
import api from '../src/server'
import Models from '../src/models'
import { truncateModels, registerAndLogin } from './helpers'
import invoiceBasic from './data/stripe/stripe.invoice.basic'
import invoiceItem from './data/stripe/stripe.invoiceitem'
import customer from './data/stripe/stripe.customer'

const agent = request.agent(api)
const models = Models as any

describe('WalletOrder', () => {
  beforeEach(async () => {
    await truncateModels(models.User)
    await truncateModels(models.Wallet)
    await truncateModels(models.WalletOrder)
  })
  describe('creating wallet order', () => {
    beforeEach(() => {
      nock('https://api.stripe.com').post('/v1/invoices').reply(200, invoiceBasic.created, {
        'Content-Type': 'application/json'
      })
      nock('https://api.stripe.com').post('/v1/invoiceitems').reply(200, invoiceItem.created, {
        'Content-Type': 'application/json'
      })

      nock('https://api.stripe.com')
        .post('/v1/invoices/in_1Q2fh8BrSjgsps2DUqQsGLDj/finalize')
        .reply(200, invoiceBasic.created, {
          'Content-Type': 'application/json'
        })
    })
    it('should create an initial wallet Order', async () => {
      nock('https://api.stripe.com').post('/v1/customers').reply(200, customer.customer, {
        'Content-Type': 'application/json'
      })
      const user = await registerAndLogin(agent)
      const wallet = await models.Wallet.create({
        userId: user.body.id,
        name: 'Test Wallet',
        balance: 0
      })
      const res = await agent
        .post('/wallets/orders')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('authorization', user.headers.authorization)
        .expect(201)
        .send({
          walletId: wallet.id,
          amount: 100
        })
      expect(res.body).to.exist
      expect(res.body.id).to.exist
      expect(res.body.amount).to.equal('100')
      expect(res.body.status).to.equal('open')
      expect(res.body.walletId).to.equal(wallet.id)
      expect(res.body.source_id).to.equal('ii_1Q2fh8BrSjgsps2DQqY9k2h3')
      expect(res.body.source_type).to.equal('invoice-item')
      expect(res.body.currency).to.equal('usd')
      expect(res.body.source).to.equal('in_1Q2fh8BrSjgsps2DUqQsGLDj')
      expect(res.body.paid).to.equal(false)

      const walletUpdated = await models.Wallet.findOne({
        where: {
          id: wallet.id
        }
      })

      expect(walletUpdated.balance).to.equal('0.00')
    })
  })
  describe('updating wallet order', () => {
    beforeEach(() => {
      nock('https://api.stripe.com').post('/v1/invoices').reply(200, invoiceBasic.created, {
        'Content-Type': 'application/json'
      })
      nock('https://api.stripe.com').post('/v1/invoiceitems').reply(200, invoiceItem.created, {
        'Content-Type': 'application/json'
      })

      nock('https://api.stripe.com')
        .post('/v1/invoices/in_1Q2fh8BrSjgsps2DUqQsGLDj/finalize')
        .reply(200, invoiceBasic.updated, {
          'Content-Type': 'application/json'
        })
    })
    it('should update an initial wallet Order with balance updated when order is paid', async () => {
      const user = await registerAndLogin(agent)
      const wallet = await models.Wallet.create({
        userId: user.body.id,
        name: 'Test Wallet',
        balance: 0
      })
      const walletOrder = await models.WalletOrder.create({
        walletId: wallet.id,
        amount: 100
      })
      const res = await agent
        .put(`/wallets/orders/${walletOrder.id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('authorization', user.headers.authorization)
        .expect(200)
        .send({
          status: 'paid'
        })

      expect(res.body).to.exist
      expect(res.body.id).to.exist
      expect(res.body.amount).to.equal('100')
      expect(res.body.status).to.equal('paid')
      expect(res.body.walletId).to.equal(wallet.id)

      const walletUpdated = await models.Wallet.findOne({
        where: {
          id: wallet.id
        }
      })

      expect(walletUpdated.balance).to.equal('100.00')
    })
    it('should create many wallet Orders with balance updated when order is succeeded', async () => {
      const user = await registerAndLogin(agent)
      const wallet = await models.Wallet.create({
        userId: user.body.id,
        name: 'Test Wallet',
        balance: 0
      })

      const walletOrder = await models.WalletOrder.create({
        walletId: wallet.id,
        amount: 100
      })
      await agent
        .put(`/wallets/orders/${walletOrder.id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('authorization', user.headers.authorization)
        .expect(200)
        .send({
          status: 'paid'
        })

      const walletOrder2 = await models.WalletOrder.create({
        walletId: wallet.id,
        amount: 100
      })
      await agent
        .put(`/wallets/orders/${walletOrder2.id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('authorization', user.headers.authorization)
        .expect(200)
        .send({
          status: 'paid'
        })

      const walletOrder3 = await models.WalletOrder.create({
        walletId: wallet.id,
        amount: 108
      })
      await agent
        .put(`/wallets/orders/${walletOrder3.id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('authorization', user.headers.authorization)
        .expect(200)
        .send({
          status: 'open'
        })

      const walletUpdated = await models.Wallet.findOne({
        where: {
          id: wallet.id
        }
      })

      expect(walletUpdated.balance).to.equal('200.00')
    })
    it('should update wallet order', async () => {
      const user = await registerAndLogin(agent)
      const wallet = await models.Wallet.create({
        userId: user.body.id,
        name: 'Test Wallet',
        balance: 0
      })
      const walletOrder = await models.WalletOrder.create({
        walletId: wallet.id,
        amount: 100,
        status: 'pending'
      })
      const res = await agent
        .put(`/wallets/orders/${walletOrder.id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('authorization', user.headers.authorization)
        .expect(200)
        .send({
          status: 'paid'
        })
      expect(res.body).to.exist
      expect(res.body.id).to.exist
      expect(res.body.status).to.equal('paid')

      const walletUpdated = await models.Wallet.findOne({
        where: {
          id: wallet.id
        }
      })

      expect(walletUpdated.balance).to.equal('100.00')
    })
  })
  describe('list wallet orders', () => {
    it('should list wallet orders', async () => {
      const user = await registerAndLogin(agent)
      const wallet = await models.Wallet.create({
        userId: user.body.id,
        name: 'Test Wallet',
        balance: 0
      })
      const walletOrder = await models.WalletOrder.create({
        walletId: wallet.id,
        amount: 100,
        status: 'pending'
      })
      const res = await agent
        .get('/wallets/orders')
        .query({ walletId: wallet.id })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('authorization', user.headers.authorization)
        .expect(200)
      expect(res.body).to.exist
      expect(res.body[0].id).to.exist
      expect(res.body[0].amount).to.equal('100')
      expect(res.body[0].status).to.equal('pending')
      expect(res.body[0].walletId).to.equal(wallet.id)
    })
  })
  describe('fetch wallet orders', () => {
    beforeEach(() => {
      nock('https://api.stripe.com')
        .get(`/v1/invoices/in_1Q2fh8BrSjgsps2DUqQsGLDj`)
        .reply(200, invoiceBasic.updated, {
          'Content-Type': 'application/json'
        })
    })
    it('should fetch wallet order', async () => {
      const user = await registerAndLogin(agent)
      const wallet = await models.Wallet.create({
        userId: user.body.id,
        name: 'Test Wallet',
        balance: 0
      })
      const walletOrder = await models.WalletOrder.create({
        walletId: wallet.id,
        amount: 100,
        status: 'paid',
        source_id: 'ii_1Q2fh8BrSjgsps2DQqY9k2h3',
        source_type: 'invoice-item',
        currency: 'usd',
        source: 'in_1Q2fh8BrSjgsps2DUqQsGLDj'
      })
      const res = await agent
        .get(`/wallets/orders/${walletOrder.id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('authorization', user.headers.authorization)
        .expect(200)
      expect(res.body).to.exist
      expect(res.body.id).to.exist
      expect(res.body.amount).to.equal('100')
      expect(res.body.status).to.equal('paid')
      expect(res.body.walletId).to.equal(wallet.id)
      expect(res.body.invoice.hosted_invoice_url).to.equal(
        'https://stripe.com/invoice/invst_1Q2fh8BrSjgsps2DUqQsGLDj'
      )
    })
  })
})
