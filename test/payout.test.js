'use strict'
const assert = require('assert')
const request = require('supertest')
const expect = require('chai').expect
const chai = require('chai')
const spies = require('chai-spies')
const api = require('../server')
const agent = request.agent(api)
const nock = require('nock')
const { createTask, createOrder, createAssign, createPayout, truncateModels } = require('./helpers')
const models = require('../models')

// Common function to create payout
const createPayoutData = async (userId, source_id) => {
  const res = await agent
    .post('/payouts/create')
    .send({
      userId: userId,
      source_id: source_id,
      method: 'stripe',
      amount: 200,
      currency: 'usd',
    });
  return res;
}

describe("payout", () => {
  describe("Initial payout with one credit card and account activated", () => {
    beforeEach(async () => {
      await truncateModels(models.Task);
      await truncateModels(models.User);
      await truncateModels(models.Assign);
      await truncateModels(models.Order);
      await truncateModels(models.Payout);
    })
    afterEach(async () => {
      nock.cleanAll()
    })
    it("should not create payout with no userId", async () => {
      try {
        const res = await createPayoutData(null, '1234');
        expect(res.body).to.exist;
        expect(res.body.error).to.equal('No userId');
      } catch (e) {
        console.log('error on payout', e);
        throw e;
      }
    })
    it("should create payout with userId and payout id", async () => {
      try {
        const user = await models.User.create({
          email: 'test@gmail.com',

        });
        const userId = user.dataValues.id;
        const res = await createPayoutData(userId, '123');
        expect(res.body).to.exist;
        expect(res.body.id).to.exist;
        expect(res.body.source_id).to.equal('123');
        expect(res.body.userId).to.exist;
      } catch (e) {
        console.log('error on payout', e);
        throw e;
      }
    })


    it("should search payouts", async () => {
      try {
        const user = await models.User.build({
          email: 'teste@mail.com',
          password: 'teste',
          account_id: 'acct_1CZ5vkLlCJ9CeQRe'
        })
        .save()
        const payout = await models.Payout.build({
          source_id: 'po_1CdprNLlCJ9CeQRefEuMMLo6',
          amount: 7311,
          currency: 'brl',
          status: 'in_transit',
          description: 'STRIPE TRANSFER',
          userId: user.dataValues.id,
          method: 'bank_account',
        }).save()
        const res = await agent
          .get('/payouts/search')
          .query({userId: user.dataValues.id});
        expect(res.body).to.exist;
        expect(res.body.length).to.equal(1);
      } catch (e) {
        console.log('error on transfer', e);
        throw e;
      }
    })

  })

})
