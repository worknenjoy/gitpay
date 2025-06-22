
const assert = require('assert')
const request = require('supertest')
const expect = require('chai').expect
const api = require('../server')
const agent = request.agent(api)
const nock = require('nock')
const { truncateModels, registerAndLogin, createTransfer } = require('./helpers')
const models = require('../models')

const chargeData = require('./data/stripe/charge')
const transferData = require('./data/stripe/transfer')
const payoutData = require('./data/stripe/payout')
const cardData = require('./data/stripe/card')
const balanceData = require('./data/stripe/balance')
const refundData = require('./data/stripe/refund')
const githubWebhookMain = require('./data/github/github.event.main')
const githubWebhookIssue = require('./data/github/github.issue.create')
const githubWebhookIssueLabeled = require('./data/github/github.issue.labeled')
const invoiceUpdated = require('./data/stripe/stripe.invoice.update')
const invoiceCreated = require('./data/stripe/stripe.invoice.create')
const invoicePaid = require('./data/stripe/stripe.invoice.paid')
const invoiceWebhookPaid = require('./data/stripe/stripe.webhook.invoice')
const eventCheckout = require('./data/stripe/stripe.webhook.checkout.session.completed')

describe('webhooks', () => {
  beforeEach(async () => {
    await truncateModels(models.Task);
    await truncateModels(models.User);
    await truncateModels(models.Assign);
    await truncateModels(models.Order);
    await truncateModels(models.Transfer);
    await truncateModels(models.PaymentRequest);
  })

  afterEach(async () => {
    nock.cleanAll()
  })

  describe('webhooks for charge', () => {
    xit('should return false when the request is not a charge event', done => {
      agent
        .post('/webhooks')
        .send({})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.exist
          expect(res.body).to.equal(false)
          done(err)
        })
    })

    xit('should update the order when a webhook charge.update is triggered', done => {
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
                      models.Order.findByPk(order.dataValues.id).then(o => {
                        expect(o.dataValues.source).to.equal(
                          'ch_1CcdmsBrSjgsps2DNZiZAyvG'
                        )
                        expect(o.dataValues.paid).to.equal(true)
                        expect(o.dataValues.status).to.equal('succeeded')
                        done()
                      })
                    })
                }).catch(done)
            }).catch(done)
        }).catch(done)
    })

    xit('should update balance after a refund is triggered', done => {
      models.User.build({ email: 'testrefund@mail.com', password: 'teste' })
        .save()
        .then(user => {
          models.Task.build({
            url: 'https://github.com/worknenjoy/truppie/issues/199',
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
                  source: 'card_1FTTdSBrSjgsps2DFfBwigSm',
                  userId: user.dataValues.id
                })
                .then(order => {
                  agent
                    .post('/webhooks')
                    .send(refundData.refund)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err, res) => {
                      expect(res.statusCode).to.equal(200)
                      expect(res.body).to.exist
                      expect(res.body.id).to.equal(
                        'ch_1FTTdqBrSjgsps2DQjHwwqr4'
                      )
                      models.Order.findByPk(order.dataValues.id).then(o => {
                        expect(o.dataValues.source).to.equal(
                          'ch_1CcdmsBrSjgsps2DNZiZAyvG'
                        )
                        expect(o.dataValues.paid).to.equal(false)
                        expect(o.dataValues.status).to.equal('refunded')
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
                      models.Order.findByPk(order.dataValues.id).then(o => {
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

    it('should create the order when a webhook charge.succeeded is triggered and the order does not exist', done => {
      models.User.build({ email: 'teste@mail.com', password: 'teste' })
        .save()
        .then(user => {
          models.Task.build({
            id: 25,
            url: 'https://github.com/worknenjoy/truppie/issues/99',
            provider: 'github',
            userId: user.dataValues.id
          })
            .save()
            .then(() => {
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
                  models.Order.findByPk(chargeData.success.data.object.metadata.order_id).then(o => {
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

    it('should update the order when a webhook charge.failed is triggered', done => {
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
                  source_id: 'card_1D8FH6BrSjgsps2DtehhSR4l',
                  currency: 'BRL',
                  amount: 200,
                  source: 'ch_1D8FHBBrSjgsps2DJawS1hYk',
                  userId: user.dataValues.id
                })
                .then(order => {
                  agent
                    .post('/webhooks')
                    .send(chargeData.failed)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err, res) => {
                      expect(res.statusCode).to.equal(200)
                      expect(res.body).to.exist
                      expect(res.body.id).to.equal(
                        'evt_1D8FHCBrSjgsps2DKkdcPqfg'
                      )
                      models.Order.findByPk(order.dataValues.id).then(o => {
                        expect(o.dataValues.source).to.equal(
                          'ch_1D8FHBBrSjgsps2DJawS1hYk'
                        )
                        expect(o.dataValues.paid).to.equal(false)
                        expect(o.dataValues.status).to.equal('failed')
                        done(err)
                      }).catch(done)
                    })
                }).catch(done)
            }).catch(done)
        }).catch(done)
    })

    it('should update the order when a webhook invoice.payment_failed is triggered', done => {
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
                  source_id: 'card_1D8FH6BrSjgsps2DtehhSR4l',
                  currency: 'BRL',
                  amount: 200,
                  source: 'ch_3Q9RUEBrSjgsps2D27S1mdjK',
                  userId: user.dataValues.id
                })
                .then(order => {
                  agent
                    .post('/webhooks')
                    .send(invoiceWebhookPaid.payment_failed)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err, res) => {
                      expect(res.statusCode).to.equal(200)
                      expect(res.body).to.exist
                      expect(res.body.id).to.equal(
                        'evt_1Q9RVHBrSjgsps2D9rGhy2En'
                      )
                      models.Order.findByPk(order.dataValues.id).then(o => {
                        expect(o.dataValues.source).to.equal(
                          'ch_3Q9RUEBrSjgsps2D27S1mdjK'
                        )
                        expect(o.dataValues.paid).to.equal(false)
                        expect(o.dataValues.status).to.equal('open')
                        done(err)
                      }).catch(done)
                    })
                }).catch(done)
            }).catch(done)
        }).catch(done)
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
                done(err)
              })
          }).catch(done)
      })

      it('should notify about the transfer and update status when a webhook transfer.created is triggered', done => {
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
                      .update({ assigned: assign.dataValues.id }, { where: { id: task.id } })
                      .then(updatedTask => {
                        createTransfer({ userId: user.dataValues.id, transfer_method: 'stripe', taskId: task.id, transfer_id: 'tr_1CcGcaBrSjgsps2DGToaoNF5', to: assign.dataValues.userId, status: 'pending' }).then(transfer => {
                          agent
                            .post('/webhooks')
                            .send(transferData.updated)
                            .expect('Content-Type', /json/)
                            .expect(200)
                            .end((err, res) => {
                              models.Transfer.findOne({ where: { id: transfer.dataValues.id } }).then(transfer => {
                                expect(res.statusCode).to.equal(200)
                                expect(res.body).to.exist
                                expect(res.body.id).to.equal(
                                  'evt_1CcecMBrSjgsps2DMFZw5Tyx'
                                )
                                expect(transfer.dataValues.status).to.equal('created')
                                done(err);
                              }).catch(done)
                            })
                        }).catch(done)
                      }).catch(done)

                  }).catch(done)
              }).catch(done)
          }).catch(done)
      })

      it('should notify the transfer when a webhook payout.create is triggered and create a new payout', done => {
        models.User.build({
          email: 'teste@mail.com',
          password: 'teste',
          account_id: 'acct_1CZ5vkLlCJ9CeQRe'
        })
          .save()
          .then(user => {
            agent
              .post('/webhooks')
              .send(payoutData.created)
              .expect('Content-Type', /json/)
              .expect(200)
              .end((err, res) => {
                models.Payout.findOne({ where: { source_id: res.body.data.object.id } }).then(payout => {
                  expect(res.statusCode).to.equal(200)
                  expect(res.body).to.exist
                  expect(res.body.id).to.equal(
                    'evt_1CdprOLlCJ9CeQRe4QDlbGRY'
                  )
                  expect(payout.dataValues.status).to.equal('in_transit')
                  done(err);
                }).catch(done)
              })
          }).catch(done)
      })

      it('should not create a new payout when a webhook payout.create triggers again', done => {
        models.User.build({
          email: 'teste@mail.com',
          password: 'teste',
          account_id: 'acct_1CZ5vkLlCJ9CeQRe'
        })
          .save()
          .then(async user => {
            await models.Payout.create({
              source_id: 'po_1CdprNLlCJ9CeQRefEuMMLo6',
              amount: 7311,
              currency: 'brl',
              status: 'in_transit',
              description: 'STRIPE TRANSFER',
              userId: user.dataValues.id,
              method: 'bank_account',
            })
            agent
              .post('/webhooks')
              .send(payoutData.created)
              .expect('Content-Type', /json/)
              .expect(200)
              .end((err, res) => {
                models.Payout.findAll().then(payouts => {
                  expect(payouts.statusCode).to.equal(200)
                  expect(payouts.body).to.exist
                  expect(payouts.body.id).to.equal(
                    'evt_1CdprOLlCJ9CeQRe4QDlbGRY'
                  )
                  expect(payouts.length).to.equal(1)
                })
                models.Payout.findOne({ where: { source_id: res.body.data.object.id } }).then(payout => {
                  expect(res.statusCode).to.equal(200)
                  expect(res.body).to.exist
                  expect(res.body.id).to.equal(
                    'evt_1CdprOLlCJ9CeQRe4QDlbGRY'
                  )
                  expect(payout.dataValues.status).to.equal('in_transit')
                  
                })
                done(err)
              })
          }).catch(done)
      })

      it('should notify the transfer when a webhook payout.paid is triggered and update payout status', done => {
        models.User.build({
          email: 'teste@mail.com',
          password: 'teste',
          account_id: 'acct_1CZ5vkLlCJ9CeQRe'
        })
          .save()
          .then(user => {
            models.Payout.build({
              source_id: 'po_1CdprNLlCJ9CeQRefEuMMLo6',
              amount: 7311,
              currency: 'brl',
              status: 'in_transit',
              description: 'STRIPE TRANSFER',
              userId: user.dataValues.id,
              method: 'bank_account',
            }).save().then(newPayout => {
              agent
                .post('/webhooks')
                .send(payoutData.done)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                  expect(res.statusCode).to.equal(200)
                  expect(res.body).to.exist
                  expect(res.body.id).to.equal(
                    'evt_1CeM4PLlCJ9CeQReQrtxB9GJ'
                  )
                  models.Payout.findOne({ where: { id: newPayout.dataValues.id } }).then(payout => {
                    expect(payout.dataValues.status).to.equal('paid')
                    expect(payout.dataValues.paid).to.equal(true)
                    expect(payout.dataValues.amount).to.equal('7311')
                    done(err);
                  }).catch(done)
                })
            }).catch(done)
          }).catch(done)
      })

      xit('should update the order when a webhook payout.failed is triggered', done => {
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
                done(err)
              })
          }).catch(done)
      })
    })
  })

  describe('webhooks for balance', () => {
    it('should notify the user when he/she gets a new balance', done => {
      agent
        .post('/webhooks')
        .send(balanceData.update)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.exist
          expect(res.body.id).to.equal('evt_1234')
          done(err)
        })
    })
  })

  describe('webhooks for invoice', () => {
    it('should notify the user when the invoice is created', done => {
      agent
        .post('/auth/register')
        .send({ email: 'invoice_test@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((user) => {
          const userId = user.body.id;
          const github_url = 'https://github.com/worknenjoy/truppie/issues/76';
          models.Task.build({ url: github_url, provider: 'github', userId: userId }).save().then((task) => {
            task.createAssign({ userId: userId }).then((assign) => {
              task.update({ assigned: assign.dataValues.id }).then(taskUpdated => {
                task.createOrder({
                  provider: 'stripe',
                  type: 'invoice-item',
                  source_id: 'in_1Il9COBrSjgsps2DtvLrFalB',
                  userId: userId,
                  currency: 'usd',
                  amount: 200
                }).then(order => {
                  agent
                    .post('/webhooks')
                    .send(invoiceCreated.created)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err, res) => {
                      expect(res.statusCode).to.equal(200)
                      expect(res.body).to.exist
                      expect(res.body.id).to.equal('evt_1CcecMBrSjgsps2DMFZw5Tyx')
                      expect(res.body.data.object.id).to.equal('in_1Il9COBrSjgsps2DtvLrFalB')
                      models.Order.findOne({
                        where: {
                          id: order.id
                        },
                        include: [models.Task]
                      }).then(orderFinal => {
                        expect(orderFinal.dataValues.paid).to.equal(false)
                        expect(orderFinal.dataValues.source_id).to.equal('in_1Il9COBrSjgsps2DtvLrFalB')
                        expect(orderFinal.dataValues.Task.dataValues.url).to.equal(github_url)
                        done()
                      }).catch(e => done(e))
                    })
                })
              }).catch(e => console.log('cant create order', e))
            })
          })
        })
    })
    it('should notify the user when the invoice is updated', done => {
      agent
        .post('/auth/register')
        .send({ email: 'invoice_test@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((user) => {
          if (!user) console.log('error to register user')
          const userId = user.body.id;
          const github_url = 'https://github.com/worknenjoy/truppie/issues/76';
          models.Task.build({ url: github_url, provider: 'github', userId: userId }).save().then((task) => {
            task.createAssign({ userId: userId }).then((assign) => {
              task.update({ assigned: assign.dataValues.id }).then(taskUpdated => {
                task.createOrder({
                  provider: 'stripe',
                  type: 'invoice-item',
                  source_id: 'in_1Il9COBrSjgsps2DtvLrFalB',
                  userId: userId,
                  currency: 'usd',
                  amount: 200
                }).then(order => {
                  agent
                    .post('/webhooks')
                    .send(invoiceUpdated.updated)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err, res) => {
                      expect(res.statusCode).to.equal(200)
                      expect(res.body).to.exist
                      expect(res.body.id).to.equal('evt_1CcecMBrSjgsps2DMFZw5Tyx')
                      expect(res.body.data.object.id).to.equal('in_1Il9COBrSjgsps2DtvLrFalB')
                      models.Order.findOne({
                        where: {
                          id: order.id
                        },
                        include: [models.Task]
                      }).then(orderFinal => {
                        expect(orderFinal.dataValues.paid).to.equal(true)
                        expect(orderFinal.dataValues.status).to.equal('succeeded')
                        expect(orderFinal.dataValues.source).to.equal('ch_1IlAjBBrSjgsps2DLjTdMXwJ')
                        expect(orderFinal.dataValues.Task.dataValues.url).to.equal(github_url)
                        done()
                      }).catch(e => done(e))
                    })
                })
              }).catch(e => console.log('cant create order', e))
            })
          })
        })
    })
    xit('should update order and create an user with funding type when the invoice payment is a success', done => {
      agent
        .post('/auth/register')
        .send({ email: 'invoice_test@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((user) => {
          if (!user) console.log('error to register user')
          const userId = user.body.id;
          const github_url = 'https://github.com/worknenjoy/truppie/issues/76';
          models.Task.build({ url: github_url, provider: 'github', userId: userId }).save().then((task) => {
            task.createAssign({ userId: userId }).then((assign) => {
              task.update({ assigned: assign.dataValues.id }).then(taskUpdated => {
                task.createOrder({
                  provider: 'stripe',
                  type: 'invoice-item',
                  userId: userId,
                  currency: 'usd',
                  amount: 200,
                  taskId: task.id,
                  customer_id: 'cus_J4zTz8uySTkLlL',
                  email: 'test@fitnowbrasil.com.br',
                  source_id: 'in_1KknpoBrSjgsps2DMwiQEzJ9'
                }).then(order => {
                  agent
                    .post('/webhooks')
                    .send(invoicePaid.paid)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err, res) => {
                      expect(res.statusCode).to.equal(200)
                      expect(res.body).to.exist
                      expect(res.body.id[0]).to.equal('evt_1KkomkBrSjgsps2DGGBtipW4')
                      expect(res.body.data.object.id[0]).to.equal('in_1KknpoBrSjgsps2DMwiQEzJ9')
                      models.Order.findOne({
                        where: {
                          id: order.id
                        },
                        include: [models.Task]
                      }).then(orderFinal => {
                        expect(orderFinal.dataValues.paid).to.equal(true)
                        expect(orderFinal.dataValues.status).to.equal('paid')
                        expect(orderFinal.dataValues.source).to.equal('ch_3KknvTBrSjgsps2D036v7gVJ')
                        expect(orderFinal.dataValues.Task.dataValues.url).to.equal(github_url)

                        models.User.findOne(
                          {
                            where: {
                              active: false,
                              email: "test@fitnowbrasil.com.br"
                            },
                          }
                        ).then(async user => {
                          const types = await user.getTypes({ where: { name: "funding" } })
                          expect(types).to.not.be.empty
                          done()
                        }).catch(e => done(e))
                      })
                    })
                })
              }).catch(e => console.log('cant create order', e))
            })
          })
        })
    })
  })

  describe('wehooks for Wallet order', () => {
    it('should update a new wallet order when a webhook invoice.paid is triggered', async () => {
      const user = await registerAndLogin(agent)
      const wallet = await models.Wallet.create({
        name: 'Test Wallet',
        userId: user.body.id,
        balance: 0
      })
      await models.WalletOrder.create({
        amount: 100,
        status: 'open',
        source_id: 'ii_1Q2fh8BrSjgsps2DQqY9k2h3',
        source_type: 'invoice-item',
        source: 'in_1Q2fh8BrSjgsps2DUqQsGLDj',
        walletId: wallet.id
      })
      const res = await agent
        .post('/webhooks')
        .send(invoiceWebhookPaid.paid)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.statusCode).to.equal(200)
      expect(res.body).to.exist
      expect(res.body.id).to.equal('evt_1Q2fklBrSjgsps2Dx0mEXsXv')
      expect(res.body.data.object.id).to.equal('in_1Q2fh8BrSjgsps2DUqQsGLDj')
      const walletOrder = await models.WalletOrder.findOne({
        where: {
          source: res.body.data.object.id
        }
      })
      expect(walletOrder).to.exist
      expect(walletOrder.status).to.equal('paid')
    })
    it('should create a new wallet order when a webhook invoice.create is triggered', async () => {
      const user = await registerAndLogin(agent)
      const wallet = await models.Wallet.create({
        name: 'Test Wallet',
        userId: user.body.id,
        balance: 0
      })
      const invoiceWebhookCreated = invoiceWebhookPaid.created
      invoiceWebhookCreated.data.object.metadata['wallet_id'] = wallet.id
      const res = await agent
        .post('/webhooks')
        .send(invoiceWebhookCreated)
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.statusCode).to.equal(200)
      expect(res.body).to.exist
      expect(res.body.id).to.equal('evt_1Q8JR1BrSjgsps2DTYquL0UC')
      expect(res.body.data.object.id).to.equal('in_1Q8JR1BrSjgsps2DmN3iPASq')
      const walletOrder = await models.WalletOrder.findOne({
        where: {
          source: res.body.data.object.id
        }
      })
      expect(walletOrder).to.exist
      expect(walletOrder.status).to.equal('draft')
      expect(walletOrder.amount).to.equal('108.00')
    })
    it('should create a new wallet order when a webhook invoice.updated is triggered', async () => {
      const user = await registerAndLogin(agent)
      const wallet = await models.Wallet.create({
        name: 'Test Wallet',
        userId: user.body.id,
        balance: 0
      })
      const invoiceWebhookUpdated = invoiceWebhookPaid.updated
      invoiceWebhookUpdated.data.object.metadata['wallet_id'] = wallet.id
      const res = await agent
        .post('/webhooks')
        .send(invoiceWebhookUpdated)
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.statusCode).to.equal(200)
      expect(res.body).to.exist
      expect(res.body.id).to.equal('evt_1Q8JR1BrSjgsps2DTYquL0UC')
      expect(res.body.data.object.id).to.equal('in_1Q8JR1BrSjgsps2DmN3iPASq')
      const walletOrder = await models.WalletOrder.findOne({
        where: {
          source: res.body.data.object.id
        }
      })
      expect(walletOrder).to.exist
      expect(walletOrder.status).to.equal('draft')
      expect(walletOrder.amount).to.equal('108.00')
    })
    it('should create a new wallet order when a webhook invoice.payment_failed is triggered', async () => {
      const user = await registerAndLogin(agent)
      const wallet = await models.Wallet.create({
        name: 'Test Wallet',
        userId: user.body.id,
        balance: 0
      })
      const invoiceWebhookUpdated = invoiceWebhookPaid.payment_failed
      invoiceWebhookUpdated.data.object.metadata['wallet_id'] = wallet.id
      const res = await agent
        .post('/webhooks')
        .send(invoiceWebhookUpdated)
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.statusCode).to.equal(200)
      expect(res.body).to.exist
      expect(res.body.id).to.equal('evt_1Q9RVHBrSjgsps2D9rGhy2En')
      expect(res.body.data.object.id).to.equal('in_1Q9RUDBrSjgsps2DRUgEGbgc')
      const walletOrder = await models.WalletOrder.findOne({
        where: {
          source: res.body.data.object.id
        }
      })
      expect(walletOrder).to.exist
      expect(walletOrder.status).to.equal('open')
      expect(walletOrder.amount).to.equal('21.00')
    })
  })

  describe('webhooks for Github events', () => {
    it('should post event from github webhooks', done => {
      agent
        .post('/webhooks/github')
        .send(githubWebhookMain.main)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.exist
          expect(res.body.hook_id).to.equal(74489783)
          done()
        })
    })
    it('should update when issue on github is updated', done => {
      let customIssue = githubWebhookIssue.issue
      customIssue.action = 'opened'
      models.User.build({ email: 'teste@mail.com', username: 'alexanmtz', password: 'teste' })
        .save()
        .then(async user => {
          const task = await models.Task.create({ provider: 'github', url: 'https://github.com/worknenjoy/gitpay/issues/244', userId: user.dataValues.id, status: 'closed' })
          agent
            .post('/webhooks/github')
            .set('Authorization', `Bearer ${process.env.GITHUB_WEBHOOK_APP_TOKEN}`)
            .send(customIssue)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(async (err, res) => {
              if (err) console.log(err)
              else {
                expect(res.body).to.exist
                expect(res.body.task.status).to.equal('open')
                expect(res.statusCode).to.equal(200)
                done()
              }
            })
        })
    })
    xit('should create new task when an event of new issue is triggered', done => {
      agent
        .post('/webhooks/github')
        .set('Authorization', `Bearer ${process.env.GITHUB_WEBHOOK_APP_TOKEN}`)
        .send(githubWebhookIssueLabeled.issue)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          const taskTitle = 'The filters and tabs on task list is not opening a new tab'
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.exist
          expect(res.body.action).to.equal('labeled')
          expect(res.body.issue.title).to.equal(taskTitle)
          expect(res.body.task.title).to.equal(taskTitle)
          done()
        })
    })
    xit('should create a task from the issue created webhook and associate with the user', done => {
      models.User.build({ email: 'teste@mail.com', username: 'alexanmtz', password: 'teste' })
        .save()
        .then(user => {
          agent
            .post('/webhooks/github')
            .set('Authorization', `Bearer ${process.env.GITHUB_WEBHOOK_APP_TOKEN}`)
            .send(githubWebhookIssueLabeled.issue)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              expect(res.statusCode).to.equal(200)
              expect(res.body).to.exist
              expect(res.body.action).to.equal('labeled')
              expect(res.body.task.userId).to.equal(user.dataValues.id)
              done()
            })
        })
    })

    xit('should  handle two or more labels at once', done => {
      let customIssue = githubWebhookIssue.issue
      customIssue.action = 'labeled'
      customIssue.issue.labels = [{ name: 'gitpay' }, { name: 'notify' }]
      models.User.build({ email: 'alexanmtz@gmail.com', username: 'alexanmtz', password: 'teste' })
        .save()
        .then(async user => {
          const task = await models.Task.create({ provider: 'github', url: 'https://github.com/worknenjoy/gitpay/issues/244', userId: user.dataValues.id })
          agent
            .post('/webhooks/github')
            .set('Authorization', `Bearer ${process.env.GITHUB_WEBHOOK_APP_TOKEN}`)
            .send(customIssue)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(async (err, res) => {
              const taskAfter = await models.Task.findOne({ where: { id: task.dataValues.id } })
              expect(res.statusCode).to.equal(200)
              expect(res.body).to.exist
              expect(res.body.action).to.equal('labeled')
              expect(res.body.totalLabelResponse.length).to.equal(2)
              expect(res.body.totalLabelResponse[0].label).to.equal('gitpay')
              expect(res.body.totalLabelResponse[1].label).to.equal('notify')
              expect(taskAfter.notified).to.equal(true)
              done(err)
            })
        })
    })

    it('should persist a label that does not exist before', done => {
      let customIssue = githubWebhookIssue.issue
      customIssue.action = 'labeled'
      customIssue.issue.labels = [{ name: 'notexist' }]
      models.User.build({ email: 'alexanmtz@gmail.com', username: 'alexanmtz', password: 'teste' })
        .save()
        .then(async user => {
          agent
            .post('/webhooks/github')
            .set('Authorization', `Bearer ${process.env.GITHUB_WEBHOOK_APP_TOKEN}`)
            .send(customIssue)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(async (err, res) => {
              const newLabel = await models.Label.findOne({ where: { name: 'notexist' } })
              expect(res.statusCode).to.equal(200)
              expect(res.body).to.exist
              expect(res.body.action).to.equal('labeled')
              expect(newLabel.name).to.equal('notexist')
              done(err)
            })
        }).catch(done)
    })
  })
  describe('webhooks for payment links', () => {
    it('should make a transfer when a payment link is paid', async () => {
      nock('https://api.stripe.com')
        .post('/v1/transfers')
        .reply(200, {
          id: 'tr_1KkomkBrSjgsps2DGGBtipW4',
          amount: 1000,
          currency: 'usd',
          destination: 'acct_1KkomkBrSjgsps2DGGGtipW4',
          status: 'paid',
          transfer_group: 'group_1KkomkBrSjgsps2DGGBtipW4',
          created: 1633036800,
          livemode: false,
          metadata: {
            payment_link_id: 'plink_1KknpoBrSjgsps2DMwiQEzJ9',
            user_id: 'user_1KkomkBrSjgsps2DGGBtipW4'
          }
        }, {
          'Content-Type': 'application/json'
        });
      const user = await registerAndLogin(agent)
      const paymentRequest = models.PaymentRequest.create({
        amount: 1000,
        currency: 'usd',
        description: 'Payment for services',
        payment_link_id: 'plink_1RcnYCBrSjgsps2DsAPjr1km',
        userId: user.body.id
      });
      const res = await agent
        .post('/webhooks')
        .send(eventCheckout.completed.success)
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.statusCode).to.equal(200)
      expect(res.body).to.exist
      expect(res.body.id).to.equal('evt_1Q2fklBrSjgsps2Dx0mEXsXv')
      expect(res.body.data.object.payment_link).to.equal('plink_1RcnYCBrSjgsps2DsAPjr1km')
      const paymentLink = await models.PaymentRequest.findOne({
        where: {
          payment_link_id: res.body.data.object.payment_link
        }
      })
      expect(paymentLink).to.exist
      expect(paymentLink.status).to.equal('paid')
      expect(paymentLink.amount).to.equal('1000')
      expect(paymentLink.currency).to.equal('usd')
      expect(paymentLink.userId).to.equal(user.body.id)
    })
  })
})
