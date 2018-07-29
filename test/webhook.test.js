'use strict'

const assert = require('assert')
const request = require('supertest')
const expect = require('chai').expect
const api = require('../server')
const agent = request.agent(api)
const models = require('../loading/loading')

const chargeData = require('./data/charge')
const transferData = require('./data/transfer')
const payoutData = require('./data/payout')
const cardData = require('./data/card')

describe('webhooks', () => {
  beforeEach(() => {
    models.Task.destroy({ where: {}, truncate: true, cascade: true }).then(
      function(rowDeleted) {
        // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
          console.log('Deleted successfully')
        }
      },
      function(err) {
        console.log(err)
      }
    )
    models.User.destroy({ where: {}, truncate: true, cascade: true }).then(
      function(rowDeleted) {
        // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
          console.log('Deleted successfully')
        }
      },
      function(err) {
        console.log(err)
      }
    )
  })

  describe('webhooks for charge', () => {
    it('should return false when the request is not a charge event', done => {
      agent
        .post('/webhooks')
        .send({})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.exist
          expect(res.body).to.equal(false)
          done()
        })
    })

    it('should update the order when a webhook charge.update is triggered', done => {
      models.User.build({ email: 'teste@mail.com', password: 'teste' })
        .save()
        .then(user => {
          models.Task.build({
            url: 'https://github.com/worknenjoy/truppie/issues/99',
            provider: 'github',
            userId: user.dataValues.id
          })
            .save()
            .then(task => {
              task
                .createOrder({
                  source_id: 'card_1CcdmoBrSjgsps2Dw7RRQDwp',
                  currency: 'BRL',
                  amount: 200,
                  source: 'ch_1CcdmsBrSjgsps2DNZiZAyvG',
                  userId: user.dataValues.id
                })
                .then(order => {
                  agent
                    .post('/webhooks')
                    .send(chargeData.update)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err, res) => {
                      expect(res.statusCode).to.equal(200)
                      expect(res.body).to.exist
                      expect(res.body.id).to.equal(
                        'evt_1CcecMBrSjgsps2DMFZw5Tyx'
                      )
                      models.Order.findById(order.dataValues.id).then(o => {
                        expect(o.dataValues.source).to.equal(
                          'ch_1CcdmsBrSjgsps2DNZiZAyvG'
                        )
                        expect(o.dataValues.paid).to.equal(true)
                        expect(o.dataValues.status).to.equal('succeeded')
                        done()
                      })
                    })
                })
            })
        })
    })

    it('should update the order when a webhook charge.succeeded is triggered', done => {
      models.User.build({ email: 'teste@mail.com', password: 'teste' })
        .save()
        .then(user => {
          models.Task.build({
            url: 'https://github.com/worknenjoy/truppie/issues/99',
            provider: 'github',
            userId: user.dataValues.id
          })
            .save()
            .then(task => {
              task
                .createOrder({
                  source_id: 'card_1CeLZgBrSjgsps2D46GUqEBB',
                  currency: 'BRL',
                  amount: 200,
                  source: 'ch_1CeLZkBrSjgsps2DCNBQmnLA',
                  userId: user.dataValues.id
                })
                .then(order => {
                  agent
                    .post('/webhooks')
                    .send(chargeData.success)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err, res) => {
                      expect(res.statusCode).to.equal(200)
                      expect(res.body).to.exist
                      expect(res.body.id).to.equal(
                        'evt_1CeLZlBrSjgsps2DYpOlFCuW'
                      )
                      models.Order.findById(order.dataValues.id).then(o => {
                        expect(o.dataValues.source).to.equal(
                          'ch_1CeLZkBrSjgsps2DCNBQmnLA'
                        )
                        expect(o.dataValues.paid).to.equal(true)
                        expect(o.dataValues.status).to.equal('succeeded')
                        done()
                      })
                    })
                })
            })
        })
    })

    describe('webhooks for transfer', () => {
      it('should notify the transfer when a webhook customer.source.created is triggered', done => {
        models.User.build({
          email: 'teste@gmail.com',
          password: 'teste',
          customer_id: cardData.sourceCreated.data.object.customer
        })
          .save()
          .then(user => {
            agent
              .post('/webhooks')
              .send(cardData.sourceCreated)
              .expect('Content-Type', /json/)
              .expect(200)
              .end((err, res) => {
                expect(res.statusCode).to.equal(200)
                expect(res.body).to.exist
                expect(res.body.id).to.equal(cardData.sourceCreated.id)
                done()
              })
          })
      })

      it('should notify the transfer when a webhook transfer.update is triggered', done => {
        models.User.build({ email: 'teste@mail.com', password: 'teste' })
          .save()
          .then(user => {
            models.Task.build({
              url: 'https://github.com/worknenjoy/truppie/issues/99',
              provider: 'github',
              transfer_id: 'tr_1CcGcaBrSjgsps2DGToaoNF5',
              paid: true
            })
              .save()
              .then(task => {
                task
                  .createAssign({ userId: user.dataValues.id })
                  .then(assign => {
                    task
                      .updateAttributes({ assigned: assign.dataValues.id })
                      .then(updatedTask => {
                        agent
                          .post('/webhooks')
                          .send(transferData.update)
                          .expect('Content-Type', /json/)
                          .expect(200)
                          .end((err, res) => {
                            expect(res.statusCode).to.equal(200)
                            expect(res.body).to.exist
                            expect(res.body.id).to.equal(
                              'evt_1CcecMBrSjgsps2DMFZw5Tyx'
                            )
                            done()
                          })
                      })
                  })
              })
          })
      })

      it('should notify the transfer when a webhook payout.create is triggered', done => {
        models.User.build({
          email: 'teste@mail.com',
          password: 'teste',
          account_id: 'acct_1CZ5vkLlCJ9CeQRe'
        })
          .save()
          .then(user => {
            agent
              .post('/webhooks')
              .send(payoutData.update)
              .expect('Content-Type', /json/)
              .expect(200)
              .end((err, res) => {
                expect(res.statusCode).to.equal(200)
                expect(res.body).to.exist
                expect(res.body.id).to.equal('evt_1CdprOLlCJ9CeQRe4QDlbGRY')
                done()
              })
          })
      })

      it('should update the order when a webhook payout.failed is triggered', done => {
        models.User.build({
          email: 'teste@mail.com',
          password: 'teste',
          account_id: 'acct_1CdjXFAcSPl6ox0l'
        })
          .save()
          .then(user => {
            agent
              .post('/webhooks')
              .send(payoutData.failed)
              .expect('Content-Type', /json/)
              .expect(200)
              .end((err, res) => {
                expect(res.statusCode).to.equal(200)
                expect(res.body).to.exist
                expect(res.body.id).to.equal('evt_1ChFtEAcSPl6ox0l3VSifPWa')
                done()
              })
          })
      })

      it('should notify the transfer when a webhook payout.done is triggered', done => {
        models.User.build({
          email: 'teste@mail.com',
          password: 'teste',
          account_id: 'acct_1CZ5vkLlCJ9CeQRe'
        })
          .save()
          .then(user => {
            agent
              .post('/webhooks')
              .send(payoutData.done)
              .expect('Content-Type', /json/)
              .expect(200)
              .end((err, res) => {
                expect(res.statusCode).to.equal(200)
                expect(res.body).to.exist
                expect(res.body.id).to.equal('evt_1CeM4PLlCJ9CeQReQrtxB9GJ')
                done()
              })
          })
      })
    })
  })
})
