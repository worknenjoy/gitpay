import { expect } from 'chai'
import nock from 'nock'
import request from 'supertest'
import api from '../../../../../src/server'
import { truncateModels } from '../../../../helpers'
import Models from '../../../../../src/models'
// Use require to avoid TS type dependency on @types/sinon
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sinon = require('sinon')

import payoutData from '../../../../data/stripe/payout'
import { UserFactory, PayoutFactory } from '../../../../factories'

const agent = request.agent(api) as any
const models = Models as any
describe('webhooks for payout', () => {
  beforeEach(async () => {
    await truncateModels(models.Task)
    await truncateModels(models.User)
    await truncateModels(models.Assign)
    await truncateModels(models.Order)
    await truncateModels(models.Transfer)
    await truncateModels(models.PaymentRequest)
  })

  afterEach(async () => {
    nock.cleanAll()
  })

  describe('webhooks for payouts', () => {
    it('should notify the transfer when a webhook payout.create is triggered and create a new payout', async () => {
      await UserFactory({
        email: 'teste@mail.com',
        password: 'teste',
        account_id: 'acct_1CZ5vkLlCJ9CeQRe'
      })

      const res = await agent
        .post('/webhooks/stripe-connect')
        .send(payoutData.created)
        .expect('Content-Type', /json/)
        .expect(200)

      const payout = await models.Payout.findOne({ where: { source_id: res.body.data.object.id } })

      expect(res.statusCode).to.equal(200)
      expect(res.body).to.exist
      expect(res.body.id).to.equal('evt_1CdprOLlCJ9CeQRe4QDlbGRY')
      expect(payout).to.exist
      expect(payout.status).to.equal('in_transit')
      expect(payout.arrival_date).to.equal('1529280000')
    })

    it('should not create a new payout when a webhook payout.create triggers again', async () => {
      const user = await UserFactory({
        email: 'teste@mail.com',
        password: 'teste',
        account_id: 'acct_1CZ5vkLlCJ9CeQRe'
      })

      await PayoutFactory({
        source_id: 'po_1CdprNLlCJ9CeQRefEuMMLo6',
        amount: 7311,
        currency: 'brl',
        status: 'in_transit',
        description: 'STRIPE TRANSFER',
        userId: user.dataValues.id,
        method: 'bank_account'
      })

      const res = await agent
        .post('/webhooks/stripe-connect')
        .send(payoutData.created)
        .expect('Content-Type', /json/)
        .expect(200)

      const payouts = await models.Payout.findAll()
      const payout = await models.Payout.findOne({ where: { source_id: res.body.data.object.id } })

      expect(res.statusCode).to.equal(200)
      expect(res.body).to.exist
      expect(res.body.id).to.equal('evt_1CdprOLlCJ9CeQRe4QDlbGRY')
      expect(payouts).to.have.lengthOf(1)
      expect(payout).to.exist
      expect(payout?.dataValues.status).to.equal('in_transit')
    })

    it('should notify the transfer when a webhook payout.paid is triggered and update payout status', async () => {
      const user = await UserFactory({
        email: 'teste@mail.com',
        password: 'teste',
        account_id: 'acct_1CZ5vkLlCJ9CeQRe'
      })

      const newPayout = await PayoutFactory({
        source_id: 'po_1CdprNLlCJ9CeQRefEuMMLo6',
        amount: 7311,
        currency: 'brl',
        status: 'in_transit',
        description: 'STRIPE TRANSFER',
        userId: user.dataValues.id,
        method: 'bank_account'
      })

      const res = await agent
        .post('/webhooks/stripe-connect')
        .send(payoutData.done)
        .expect('Content-Type', /json/)
        .expect(200)

      const payout = await models.Payout.findOne({ where: { id: newPayout.dataValues.id } })

      expect(res.statusCode).to.equal(200)
      expect(res.body).to.exist
      expect(res.body.id).to.equal('evt_1CeM4PLlCJ9CeQReQrtxB9GJ')
      expect(payout).to.exist
      expect(payout.status).to.equal('paid')
      expect(payout.paid).to.equal(true)
      expect(payout.amount).to.equal('7311')
    })

    it('should update the payout when a webhook payout.updated is triggered', async () => {
      const user = await UserFactory({
        email: 'teste@mail.com',
        password: 'teste',
        account_id: 'acct_1CZ5vkLlCJ9CeQRe'
      })

      const newPayout = await PayoutFactory({
        source_id: 'po_1CdprNLlCJ9CeQRefEuMMLo6',
        amount: 7311,
        currency: 'brl',
        status: 'in_transit',
        description: 'STRIPE TRANSFER',
        userId: user.dataValues.id,
        method: 'bank_account'
      })

      const res = await agent
        .post('/webhooks/stripe-connect')
        .send(payoutData.updated)
        .expect('Content-Type', /json/)
        .expect(200)

      const payout = await models.Payout.findOne({ where: { id: newPayout.dataValues.id } })

      expect(res.statusCode).to.equal(200)
      expect(res.body).to.exist
      expect(res.body.id).to.equal('evt_1CeM4PLlCJ9CeQReQrtxB9GJ')
      expect(payout).to.exist
      expect(payout.status).to.equal('paid')
      expect(payout.paid).to.equal(true)
      expect(payout.amount).to.equal('7311')
      expect(payout.reference_number).to.equal('XXX-1234')
    })

    it('should know the user when a webhook payout.failed is triggered', async () => {
      await UserFactory({
        email: 'teste@mail.com',
        password: 'teste',
        account_id: 'acct_1CdjXFAcSPl6ox0l'
      })

      const res = await agent
        .post('/webhooks/stripe-connect')
        .send(payoutData.failed)
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.statusCode).to.equal(200)
      expect(res.body).to.exist
      expect(res.body.id).to.equal('evt_1ChFtEAcSPl6ox0l3VSifPWa')
    })
    it('should update order to failed payout when payout.failed is triggered', async () => {
      const user = await UserFactory({
        email: 'teste@mail.com',
        password: 'teste',
        account_id: 'acct_1CdjXFAcSPl6ox0l'
      })

      const payout = await PayoutFactory({
        source_id: 'po_1CgNDoAcSPl6ox0ljXdVYWx3',
        amount: 5000,
        currency: 'usd',
        status: 'paid',
        method: 'bank_account',
        userId: user.dataValues.id
      })

      const res = await agent
        .post('/webhooks/stripe-connect')
        .send(payoutData.failed)
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.statusCode).to.equal(200)
      expect(res.body).to.exist
      expect(res.body.id).to.equal('evt_1ChFtEAcSPl6ox0l3VSifPWa')

      const updatedPayout = await models.Payout.findOne({ where: { id: payout.dataValues.id } })

      expect(updatedPayout).to.exist
      expect(updatedPayout?.dataValues.status).to.equal('failed')
    })
  })
})
