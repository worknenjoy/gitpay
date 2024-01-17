The error can be fixed by wrapping the entire test body within a single `describe()` function and calling `done()` after each individual `it()` function. This will ensure that the test will complete only once, instead of calling `done()` multiple times per test. Here is the modified code:

```
describe('webhooks', () => {
  beforeEach(async () => {
    await truncateModels(models.Task);
    await truncateModels(models.User);
    await truncateModels(models.Assign);
    await truncateModels(models.Order);
    await truncateModels(models.Transfer);
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
          done(err)
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
                      models.Order.findByPk(order.dataValues.id).then(o => {
                        expect(o.dataValues.source).to.equal(
                          'ch_1CcdmsBrSjgsps2DNZiZAyvG'
                        )
                        expect(o.dataValues.paid).to.equal(true)
                        expect(o.dataValues.status).to.equal('succeeded')
                      }).catch(done)
                      done(err)
                    })
                }).catch(done)
            }).catch(done)
        }).catch(done)
    })

    it('should update balance after a refund is triggered', done => {
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
                      }).catch(done)
                      done(err)
                    })
                })
            })
        })
    })

    it('should update the order when a webhook charge.succeeded is triggered', done => {
      models.User.build({ email: 'teste@mail.com', password: 'teste' })
        .save()When calling `done`, there should be null passed for `err` when there is no error.
```
agent
              .post('/webhooks')
              .send(transferData.transfer)
              .expect('Content-Type', /json/)
              .expect(200)
              .end((err, res) => {
                expect(res.statusCode).to.equal(200)
                expect(res.body).to.exist
                expect(res.body.id).to.equal('evt_1CcecMBrSjgsps2DMFZw5Tyx')
                done()  // call done without error - pass `done()` as `err`
              })
```
If there is an error, check the status code and handle appropriately - maybe like this:
```
agent
              .post('/webhooks')
              .send(transferData.transfer)
              .expect('Content-Type', /json/)
              .end((err, res) => {
                if (err) {
                  res.statusCode.should.equal(500);
                  done(err);  // this will output the error, and should be worth looking into
                } else {
                  res.statusCode.should.equal(200);
                  expect(res.body).to.exist
                  expect(res.body.id).to.equal('evt_1CcecMBrSjgsps2DMFZw5Tyx')               
                  done()  // call done without error, it's settled
                }
              })
```

I'm using `should` library for testing, just to have this line of `.should.be.a.Number;`, which must be imported like this: `should = require('should');`. If you're also using `should`, import it.

### Writing to the file './test/webhook.test.js'

Open the file `./test/webhook.test.js` and change 

```js

```const agent = require('supertest').agent(app)
const models = require('../../models')

const githubWebhookMain = require('../fixtures/webhooksGithub/webhooks.main.js')
const githubWebhookIssue = require('../fixtures/webhooksGithub/webhooks.issue.js')
const githubWebhookIssueLabeled = require('../fixtures/webhooksGithub/webhooks.issue-labeled.js')
const invoicePaid = require('../fixtures/webhooksStripe/invoice_paid.js')

describe('POST: /webhooks', () => {

  afterEach(done => {
    models.sequelize.sync({ force: true })
      .then(() => done(null))
      .catch(e => done(e))
  })

  describe('webhooks general', () => {
    it('should return Bad Request when body is empty', done => {
      agent
        .post('/webhooks')
        .send('')
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          expect(res.statusCode).to.equal(400)
          expect(res.body.error).to.equal('Missing payload')
          done()
        })
    })

    it('should return Bad Request when body is not following a application/json content-type', done => {
      agent
        .post('/webhooks')
        .send('{}')
        .expect('Content-Type', /html/)
        .expect(400)
        .end((err, res) => {
          expect(res.statusCode).to.equal(400)
          expect(res.text).to.equal('invalid content type, only application/json is allowed.')
          done()
        })
    })

    it('should reject duplicated IDEM when processing an event twice by comparing the ID', done => {
      agent
        .post('/webhooks')
        .send({ id: '123', type: 'webhook' })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(() => {
          agent
            .post('/webhooks')
            .send({ id: '123', type: 'webhook' })
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              if (err) done(err)
              expect(res.body).to.exist
              expect(res.body.message).to.equal('ID 123 was already processed')
              done()
            })
        })
    })
  })

  describe('webhooks for Stripe events', () => {
    xit('should update order when an invoice is created', done => {
      models.User.build({ email: 'teste@mail.com', username: 'alexanmtz', password: 'teste' })
        .save()
        .then(() => {
          models.Task.build({url: 'https://github.com/worknenjoy/truppie/issues/76'}).save().then((task) => {
            task.createOrder({
              provider: 'stripe',
              type: 'invoice-item',
              userId: 1,
              currency: 'usd',
              amount: 200,
              taskId: task.dataValues.id,
              customer_id: 'cus_J4zTz8uySTkLlL',
              email: 'test@fitnowbrasil.com.br'})
                .then(order => {
                  expect(order.payment_info.status).to.equal('unpaid')
                  agent
                  .post('/webhooks')
                  .send(invoicePaid.unpaid)
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .end(() => {
                    models.Order.findOne({
                      where: {
                        id: order.id
                      }
                    }).then(order => {
                      expect(order.payment_info.status).to.equal('paid')
                      done()
                    })
                  })
                })
          })
        })
    })

    xit('should update order and create a task when the invoice payment is a success', done => {
      agent
      .post('/auth/register')
      .send({email: 'invoice_test@gmail.com', password: 'teste'})
      .expect('Content-Type', /json/)
      .expect(200)
      .then((user) => {
        const userId = user.body.id;
        const github_url = 'https://github.com/worknenjoy/truppie/issues/76';
        models.Task.build({url: github_url, provider: 'github', userId: userId}).save().then((task) => {
          task.createAssign({userId: userId}).then((assign) => {
            task.update({ assigned: assign.dataValues.id}).then(taskUpdated => {
              task.createOrder({
                provider: 'stripe',
                type: 'invoice-item',
                userId: userId,
                currency: 'usd',
                amount: 200,
                taskId: task.id,
                customer_id: 'cus_J4zTz8uySTkLlL',
                email: 'test@fitnowbrasil
