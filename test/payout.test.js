'use strict'
const assert = require('assert')
const request = require('supertest')
const expect = require('chai').expect
const chai = require('chai')
const spies = require('chai-spies')
const api = require('../src/server').default
const agent = request.agent(api)
const nock = require('nock')
const { registerAndLogin, truncateModels } = require('./helpers')
const models = require('../src/models')
const { register } = require('module')

// Common function to create payout
const createPayoutData = async (source_id, noLogin = false) => {
  const user = await registerAndLogin(agent)
  const res = await agent
    .post('/payouts/create')
    .set('Authorization', noLogin ? '' : user.headers.authorization)
    .send({
      source_id: source_id,
      method: 'stripe',
      amount: 200,
      currency: 'usd',
    })
  return res
}

describe('Payouts', () => {
  describe('Initial payout with one credit card and account activated', () => {
    beforeEach(async () => {
      await truncateModels(models.Task)
      await truncateModels(models.User)
      await truncateModels(models.Assign)
      await truncateModels(models.Order)
      await truncateModels(models.Payout)
    })
    afterEach(async () => {
      nock.cleanAll()
    })
    it('should not create payout with no userId', async () => {
      const res = await createPayoutData('1234', true)
      expect(res.body.errors[0]).to.exist
      expect(res.body.errors[0]).to.equal('No token provided')
    })
    it('should not create payout with existing payout id', async () => {
      const user = await models.User.build({
        email: 'teste@mail.com',
        password: 'teste',
        account_id: 'acct_1CZ5vkLlCJ9CeQRe',
      }).save()
      const payout = await models.Payout.create({
        source_id: '123',
        userId: user.dataValues.id,
        amount: 200,
        currency: 'usd',
        method: 'stripe',
        status: 'in_transit',
      })
      const res = await createPayoutData('123')
      expect(res.body).to.exist
      expect(res.body.error).to.equal('This payout already exists')
    })

    it('should create payout with userId and payout id', async () => {
      const res = await createPayoutData('123')
      expect(res.body).to.exist
      expect(res.body.id).to.exist
      expect(res.body.source_id).to.equal('123')
      expect(res.body.userId).to.exist
    })

    it('should search payouts', async () => {
      const user = await registerAndLogin(agent, {
        email: 'teste@mail.com',
        password: 'teste',
        account_id: 'acct_1CZ5vkLlCJ9CeQRe',
      })

      const payout = await models.Payout.build({
        source_id: 'po_1CdprNLlCJ9CeQRefEuMMLo6',
        amount: 7311,
        currency: 'brl',
        status: 'in_transit',
        description: 'STRIPE TRANSFER',
        userId: user.body.id,
        method: 'bank_account',
      }).save()
      const res = await agent
        .get('/payouts/search')
        .set('Authorization', user.headers.authorization)
      expect(res.body).to.exist
      expect(res.body.length).to.equal(1)
    })
  })
  describe('Payout request', () => {
    it('should create a payout request', async () => {
      nock('https://api.stripe.com').post('/v1/payouts').reply(200, {
        id: 'po_1CdprNLlCJ9CeQRefEuMMLo6',
        amount: 10000,
        currency: 'usd',
        status: 'created',
        method: 'bank_account',
      })
      const user = await registerAndLogin(agent, {
        account_id: 'acct_1CZ5vkLlCJ9CeQRe',
      })
      const res = await agent
        .post('/payouts/request')
        .set('Authorization', user.headers.authorization)
        .send({
          amount: 100,
          currency: 'usd',
          method: 'bank_account',
        })
      expect(res.body).to.exist
      expect(res.body.id).to.exist
      expect(res.body.amount).to.equal('10000')
      expect(res.body.currency).to.equal('usd')
      expect(res.body.method).to.equal('bank_account')
      expect(res.body.status).to.equal('created')
    })
  })
})
