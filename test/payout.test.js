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
      destination: userId,
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
  })

})
