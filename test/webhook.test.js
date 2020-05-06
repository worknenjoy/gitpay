
const assert = require('assert')
const request = require('supertest')
const expect = require('chai').expect
const api = require('../server')
const agent = request.agent(api)
const models = require('../models')

const chargeData = require('./data/charge')
const transferData = require('./data/transfer')
const payoutData = require('./data/payout')
const cardData = require('./data/card')
const balanceData = require('./data/balance')
const refundData = require('./data/refund')
const githubWebhookMain = require('./data/github.event.main')
const githubWebhookIssue = require('./data/github.issue.create')
const githubWebhookIssueLabeled = require('./data/github.issue.labeled')

describe('webhooks', () => {
  beforeEach(() => {
    models.Task.destroy({ where: {}, truncate: true, cascade: true }).then(
      function (rowDeleted) {
        // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
          console.log('Deleted successfully')
        }
      },
      function (err) {
        console.log(err)
      }
    )
    models.User.destroy({ where: {}, truncate: true, cascade: true }).then(
      function (rowDeleted) {
        // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
          console.log('Deleted successfully')
        }
      },
      function (err) {
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
                      models.Order.findById(order.dataValues.id).then(o => {
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
                      models.Order.findById(order.dataValues.id).then(o => {
                        expect(o.dataValues.source).to.equal(
                          'ch_1D8FHBBrSjgsps2DJawS1hYk'
                        )
                        expect(o.dataValues.paid).to.equal(false)
                        expect(o.dataValues.status).to.equal('failed')
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
          done()
        })
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

    it('should  handle two or more labels at once', done => {
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
              done()
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
              done()
            })
        })
    })
  })
})
