const assert = require('assert')
const request = require('supertest')
const expect = require('chai').expect
const api = require('../src/server').default
const agent = request.agent(api)
const nock = require('nock')
const { truncateModels } = require('./helpers')
const models = require('../src/models')

const payoutData = require('./data/stripe/payout')

describe('webhooks for connect', () => {
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

  describe('webhooks for charge', () => {
    it('should notify the transfer when a webhook payout.create is triggered and create a new payout', (done) => {
      models.User.build({
        email: 'teste@mail.com',
        password: 'teste',
        account_id: 'acct_1CZ5vkLlCJ9CeQRe'
      })
        .save()
        .then((user) => {
          agent
            .post('/webhooks/stripe-connect')
            .send(payoutData.created)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              models.Payout.findOne({ where: { source_id: res.body.data.object.id } })
                .then((payout) => {
                  expect(res.statusCode).to.equal(200)
                  const event = res.body
                  expect(event).to.exist
                  expect(event.id).to.equal('evt_1CdprOLlCJ9CeQRe4QDlbGRY')
                  expect(payout.dataValues.status).to.equal('in_transit')
                  done(err)
                })
                .catch(done)
            })
        })
        .catch(done)
    })

    it('should not create a new payout when a webhook payout.create triggers again', (done) => {
      models.User.build({
        email: 'teste@mail.com',
        password: 'teste',
        account_id: 'acct_1CZ5vkLlCJ9CeQRe'
      })
        .save()
        .then(async (user) => {
          await models.Payout.create({
            source_id: 'po_1CdprNLlCJ9CeQRefEuMMLo6',
            amount: 7311,
            currency: 'brl',
            status: 'in_transit',
            description: 'STRIPE TRANSFER',
            userId: user.dataValues.id,
            method: 'bank_account'
          })
          agent
            .post('/webhooks/stripe-connect')
            .send(payoutData.created)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              const event = res.body
              models.Payout.findAll().then((payouts) => {
                expect(payouts.statusCode).to.equal(200)
                expect(event).to.exist
                expect(event.id).to.equal('evt_1CdprOLlCJ9CeQRe4QDlbGRY')
                expect(payouts.length).to.equal(1)
              })
              models.Payout.findOne({ where: { source_id: res.body.data.object.id } }).then(
                (payout) => {
                  expect(res.statusCode).to.equal(200)
                  expect(event).to.exist
                  expect(event.id).to.equal('evt_1CdprOLlCJ9CeQRe4QDlbGRY')
                  expect(payout.dataValues.status).to.equal('in_transit')
                }
              )
              done(err)
            })
        })
        .catch(done)
    })

    it('should notify the transfer when a webhook payout.paid is triggered and update payout status', (done) => {
      models.User.build({
        email: 'teste@mail.com',
        password: 'teste',
        account_id: 'acct_1CZ5vkLlCJ9CeQRe'
      })
        .save()
        .then((user) => {
          models.Payout.build({
            source_id: 'po_1CdprNLlCJ9CeQRefEuMMLo6',
            amount: 7311,
            currency: 'brl',
            status: 'in_transit',
            description: 'STRIPE TRANSFER',
            userId: user.dataValues.id,
            method: 'bank_account'
          })
            .save()
            .then((newPayout) => {
              agent
                .post('/webhooks/stripe-connect')
                .send(payoutData.done)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                  const event = res.body
                  expect(res.statusCode).to.equal(200)
                  expect(event).to.exist
                  expect(event.id).to.equal('evt_1CeM4PLlCJ9CeQReQrtxB9GJ')
                  models.Payout.findOne({ where: { id: newPayout.dataValues.id } })
                    .then((payout) => {
                      expect(payout.dataValues.status).to.equal('paid')
                      expect(payout.dataValues.paid).to.equal(true)
                      expect(payout.dataValues.amount).to.equal('7311')
                      done(err)
                    })
                    .catch(done)
                })
            })
            .catch(done)
        })
        .catch(done)
    })

    xit('should update the order when a webhook payout.failed is triggered', (done) => {
      models.User.build({
        email: 'teste@mail.com',
        password: 'teste',
        account_id: 'acct_1CdjXFAcSPl6ox0l'
      })
        .save()
        .then((user) => {
          agent
            .post('/webhooks/stripe-connect')
            .send(payoutData.failed)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              expect(res.statusCode).to.equal(200)
              const event = res.body
              expect(event).to.exist
              expect(event.id).to.equal('evt_1ChFtEAcSPl6ox0l3VSifPWa')
              done(err)
            })
        })
        .catch(done)
    })
  })
})
