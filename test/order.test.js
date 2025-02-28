const request = require('supertest')
const Promise = require('bluebird')
const expect = require('chai').expect
const chai = require('chai')
const spies = require('chai-spies')
const api = require('../server')
const agent = request.agent(api)
const nock = require('nock')
const models = require('../models')
const { registerAndLogin, register, login, truncateModels } = require('./helpers')
const PaymentMail = require('../modules/mail/payment')
const plan = require('../models/plan')
const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_KEY)
const customerData = require('./data/stripe.customer')

describe('orders', () => {
  beforeEach(async () => {
    await truncateModels(models.Task);
    await truncateModels(models.User);
    await truncateModels(models.Assign);
    await truncateModels(models.Order);
    await truncateModels(models.Transfer);
    await truncateModels(models.Wallet);
  })
  afterEach(async () => {
    nock.cleanAll()
  })

  describe('list orders', () => {
    it('should list orders', (done) => {
      agent
        .get('/orders/list')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.exist
          done()
        })
    })
  })

  describe('create Order', () => {
    it('should create a new order', (done) => {
      registerAndLogin(agent).then(user => {
        agent
          .post('/orders/create/')
          .send({
            source_id: '12345',
            currency: 'BRL',
            amount: 200,
            email: 'testing@gitpay.me',
            userId: user.body.id
          })
          .set('Authorization', user.headers.authorization)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.exist;
            expect(res.body.source_id).to.equal('12345');
            expect(res.body.currency).to.equal('BRL');
            expect(res.body.amount).to.equal('200');
            done(err);
          })
      }).catch(done)
    })

    describe('Order with Plan', () => {
      let PlanSchema
      beforeEach(async () => {
        PlanSchema = await models.PlanSchema.build({
          plan: 'open source',
          name: 'Open Source - default',
          description: 'open source',
          fee: 8,
          feeType: 'charge'
        });
        PlanSchema = await models.PlanSchema.build({
          plan: 'open source',
          name: 'Open Source - no fee',
          description: 'open source with no fee',
          fee: 0,
          feeType: 'charge'
        });
      })
      it('should create a new order with a plan', async () => {
        try {
          const user = await registerAndLogin(agent);
          const res = await agent
            .post('/orders/create/')
            .send({
            source_id: '12345',
            currency: 'BRL',
            amount: 100,
            email: 'testing@gitpay.me',
            userId: user.body.id,
            plan: 'open source'
          })
          .set('Authorization', user.headers.authorization)
          .expect('Content-Type', /json/)
          .expect(200);

          expect(res.statusCode).to.equal(200);
          expect(res.body).to.exist;
          expect(res.body.source_id).to.equal('12345');
          expect(res.body.currency).to.equal('BRL');
          expect(res.body.amount).to.equal('100');
          expect(res.body.Plan.plan).to.equal('open source');
          expect(res.body.Plan.fee).to.equal('8');
          expect(res.body.Plan.feePercentage).to.equal(8);
          expect(res.body.Plan.PlanSchema.name).to.equal('Open Source - default');
          expect(res.body.Plan.PlanSchema.feeType).to.equal('charge');

        } catch (err) {
          throw err;
        }
      });

      it('should create a new order with no exact amount with a plan', async () => {
        try {
          const user = await registerAndLogin(agent);
          const res = await agent
            .post('/orders/create/')
            .send({
            source_id: '12345',
            currency: 'BRL',
            amount: 832,
            email: 'testing@gitpay.me',
            userId: user.body.id,
            plan: 'open source'
          })
          .set('Authorization', user.headers.authorization)
          .expect('Content-Type', /json/)
          .expect(200);

          expect(res.statusCode).to.equal(200);
          expect(res.body).to.exist;
          expect(res.body.source_id).to.equal('12345');
          expect(res.body.currency).to.equal('BRL');
          expect(res.body.amount).to.equal('832');
          expect(res.body.Plan.plan).to.equal('open source');
          expect(res.body.Plan.fee).to.equal('66.56');
          expect(res.body.Plan.feePercentage).to.equal(8);
          expect(res.body.Plan.PlanSchema.name).to.equal('Open Source - default');
          expect(res.body.Plan.PlanSchema.feeType).to.equal('charge');

        } catch (err) {
          throw err;
        }
      });

      it('should create a new order with a plan above 5000', async () => {
        try {
          const user = await registerAndLogin(agent);
          const res = await agent
            .post('/orders/create/')
            .send({
            source_id: '12345',
            currency: 'BRL',
            amount: 5000,
            email: 'testing@gitpay.me',
            userId: user.body.id,
            plan: 'open source'
          })
          .set('Authorization', user.headers.authorization)
          .expect('Content-Type', /json/)
          .expect(200);

          expect(res.statusCode).to.equal(200);
          expect(res.body).to.exist;
          expect(res.body.source_id).to.equal('12345');
          expect(res.body.currency).to.equal('BRL');
          expect(res.body.amount).to.equal('5000');
          expect(res.body.Plan.plan).to.equal('open source');
          expect(res.body.Plan.fee).to.equal('0');
          expect(res.body.Plan.feePercentage).to.equal(0);
          expect(res.body.Plan.PlanSchema.name).to.equal('Open Source - no fee');
          expect(res.body.Plan.PlanSchema.feeType).to.equal('charge');

        } catch (err) {
          throw err;
        }
      });
    })

    it('should create a order type invoice-item and create customer if theres no customer associated', async () => {
      nock('https://api.stripe.com')
      .post('/v1/invoices')
      .reply(200, {id: 'foo'}, {
        'Content-Type': 'application/json',
      })
      nock('https://api.stripe.com')
      .post('/v1/invoiceitems')
      .reply(200, {id: 'foo'}, {
        'Content-Type': 'application/json',
      })

      nock('https://api.stripe.com')
      .post('/v1/invoices/foo/send')
      .reply(200, {id: 'foo'}, {
        'Content-Type': 'application/json',
      })

      nock('https://api.stripe.com')
      .post('/v1/invoices/foo/finalize')
      .reply(200, {id: 'foo'}, {
        'Content-Type': 'application/json',
      })

      nock('https://api.stripe.com')
      .post('/v1/customers')
      .reply(200, customerData.customer, {
        'Content-Type': 'application/json',
      })

      try {
      const user = await registerAndLogin(agent);
      const res = await agent
        .post('/orders/create/')
        .send({
        source_id: '12345',
        currency: 'BRL',
        amount: 200,
        email: 'test@gmail.com',
        source_type: 'invoice-item',
        customer_id: null,
        provider: 'stripe',
        userId: user.body.id,
        plan: 'open source'
        })
        .set('Authorization', user.headers.authorization)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.statusCode).to.equal(200);
      expect(res.body).to.exist;
      expect(res.body.source_id).to.exist;
      expect(res.body.currency).to.equal('BRL');
      expect(res.body.amount).to.equal('200');
      expect(res.body.Plan).to.exist;
      expect(res.body.Plan.plan).to.equal('open source');
      expect(res.body.Plan.fee).to.equal('16');
      expect(res.body.Plan.feePercentage).to.equal(8);
      expect(res.body.User.id).to.equal(user.body.id);
      expect(res.body.User.customer_id).to.exist;
      } catch (err) {
      throw err;
      }
    })

    it('should create a order type invoice-item with a existing customer', async () => {
      nock('https://api.stripe.com')
      .post('/v1/invoices')
      .reply(200, {id: 'foo'}, {
        'Content-Type': 'application/json',
      })
      nock('https://api.stripe.com')
      .post('/v1/invoiceitems')
      .reply(200, {id: 'foo'}, {
        'Content-Type': 'application/json',
      })

      nock('https://api.stripe.com')
      .post('/v1/invoices/foo/send')
      .reply(200, {id: 'foo'}, {
        'Content-Type': 'application/json',
      })

      nock('https://api.stripe.com')
      .post('/v1/invoices/foo/finalize')
      .reply(200, {id: 'foo'}, {
        'Content-Type': 'application/json',
      })

      try {
      const user = await registerAndLogin(agent);
      const res = await agent
        .post('/orders/create/')
        .send({
        source_id: '12345',
        currency: 'BRL',
        amount: 200,
        email: 'test@gmail.com',
        source_type: 'invoice-item',
        customer_id: 'cus_12345',
        provider: 'stripe',
        userId: user.body.id,
        plan: 'open source'
        })
        .set('Authorization', user.headers.authorization)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.statusCode).to.equal(200);
      expect(res.body).to.exist;
      expect(res.body.source_id).to.exist;
      expect(res.body.currency).to.equal('BRL');
      expect(res.body.amount).to.equal('200');
      expect(res.body.Plan).to.exist;
      expect(res.body.Plan.plan).to.equal('open source');
      expect(res.body.Plan.fee).to.equal('16');
      expect(res.body.Plan.feePercentage).to.equal(8);
      } catch (err) {
      throw err;
      }
    }) 

    xit('should create a order type invoice-item above 5000', (done) => {
      chai.use(spies);
      const invoiceItem = chai.spy.on(stripe.invoiceItems, 'create')

      nock('https://api.stripe.com')
        .post('/v1/invoices')
        .reply(200, {id: 'foo'}, {
          'Content-Type': 'application/json',
        })
      nock('https://api.stripe.com')
        .post('/v1/invoiceitems')
        .reply(200, {id: 'foo'}, {
          'Content-Type': 'application/json',
        })

      nock('https://api.stripe.com')
        .post('/v1/invoices/foo/send')
        .reply(200, {id: 'foo'}, {
          'Content-Type': 'application/json',
        })

      nock('https://api.stripe.com')
        .post('/v1/invoices/foo/finalize')
        .reply(200, {id: 'foo'}, {
          'Content-Type': 'application/json',
        })

      registerAndLogin(agent).then(user => {
        agent
          .post('/orders/create/')
          .send({
            source_id: '12345',
            currency: 'BRL',
            amount: 5000,
            email: 'test@gmail.com',
            source_type: 'invoice-item',
            customer_id: 'cus_12345',
            provider: 'stripe',
            userId: user.body.id,
            plan: 'open source'
          })
          .set('Authorization', user.headers.authorization)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.exist;
            expect(res.body.source_id).to.exist;
            expect(res.body.currency).to.equal('BRL');
            expect(res.body.amount).to.equal('5000');
            expect(res.body.Plan).to.exist;
            expect(res.body.Plan.plan).to.equal('open source');
            expect(res.body.Plan.fee).to.equal('0');
            expect(res.body.Plan.feePercentage).to.equal(0);
            expect(invoiceItem).to.have.been.called();
            chai.spy.restore(stripe.invoiceItems, 'create');
            done(err);
          })
        }
      ).catch(done)
    })

    it('should create a order type wallet funds', async () => {
      const user = await registerAndLogin(agent)
      const newWallet = await models.Wallet.create({
        name: 'Test Wallet',
        balance: 0,
        userId: user.body.id
      });
      const WalletOrder = await models.WalletOrder.create({
        walletId: newWallet.id,
        amount: 400,
        status: 'paid'
      });
      const task = await models.Task.create({
        url: 'https://foo',
        userId: user.body.id
      })
      const res = await agent
        .post('/orders/create/')
        .send({
          walletId: newWallet.id,
          currency: 'usd',
          amount: 200,
          provider: 'wallet',
          source_type: 'wallet-funds',
          userId: user.body.id,
          taskId: task.id
        })
        .set('Authorization', user.headers.authorization)
        .expect(200)
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.exist;
      expect(res.body.source_id).to.exist;
      expect(res.body.currency).to.equal('usd');
      expect(res.body.amount).to.equal('200');
      expect(res.body.status).to.equal('succeeded');
      const wallet = await models.Wallet.findOne({
        where: {
          userId: user.body.id
        }
      })
      expect(wallet.balance).to.equal('184.00')
    })

    it('should create a order type wallet funds with enough balance', async () => {
      const user = await registerAndLogin(agent)
      const newWallet = await models.Wallet.create({
        name: 'Test Wallet',
        balance: 0,
        userId: user.body.id
      });
      const WalletOrder = await models.WalletOrder.create({
        walletId: newWallet.id,
        amount: 1929,
        status: 'paid'
      });
      const task = await models.Task.create({
        url: 'https://foo',
        userId: user.body.id
      })
      const res = await agent
        .post('/orders/create/')
        .send({
          walletId: newWallet.id,
          currency: 'usd',
          amount: 250,
          provider: 'wallet',
          source_type: 'wallet-funds',
          userId: user.body.id,
          taskId: task.id
        })
        .set('Authorization', user.headers.authorization)
        .expect(200)
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.exist;
      expect(res.body.source_id).to.exist;
      expect(res.body.currency).to.equal('usd');
      expect(res.body.amount).to.equal('250');
      expect(res.body.status).to.equal('succeeded');
      const wallet = await models.Wallet.findOne({
        where: {
          userId: user.body.id
        }
      })
      expect(wallet.balance).to.equal('1659.00')
    })

    xit('should create a new paypal order', (done) => {
      const url = 'https://api.sandbox.paypal.com'
      const path = '/v1/oauth2/token'
      const anotherPath = '/v2/checkout/orders'
      nock(url)
        .post(path)
        .reply(200, {access_token: 'foo'}, {
          'Content-Type': 'application/json',
        })
      nock(url)
        .post(anotherPath)
        .reply(200, {
          id: 1,
          links: [
            {href: 'http://foo.com'},
            {href: 'http://foo.com'}
          ],
          'purchase_units': [{
            'payments': {
              'authorizations': [{
                id: 'foo'
              }]
            }
          }]
        }, {
          'Content-Type': 'application/json',
        })
      registerAndLogin(agent).then(res => {
        agent
        .post('/orders/create/')
        .set('Authorization', res.headers.authorization)
        .send({
          currency: 'USD',
          provider: 'paypal',
          amount: 200
        })
        //.expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.exist
          expect(res.body.currency).to.equal('USD')
          expect(res.body.amount).to.equal('200')
          expect(res.body.authorization_id).to.equal('foo')
          done(err);
        })
      }).catch(done)
    })

    it('should cancel a paypal order', (done) => {
      const url = 'https://api.sandbox.paypal.com'
      const path = '/v1/oauth2/token'
      const anotherPath = '/v2/checkout/orders'
      nock(url)
      .persist()
      .post(path)
      .reply(200, {access_token: 'foo'}, {
        'Content-Type': 'application/json',
      })
      nock(url)
      .post(anotherPath)
      .reply(200, {
        id: 1,
        links: [
          {href: 'http://foo.com'},
          {href: 'http://foo.com'}
        ],
        'purchase_units': [{
          'payments': {
            'authorizations': [{
              id: 'foo'
            }]
          }
        }]
      }, {
        'Content-Type': 'application/json',
      })
      register(agent, {email: 'testcancelorder@gitpay.me'}).then(user => {
        login(agent, {email: 'testcancelorder@gitpay.me'}).then(res => {
          chai.use(spies);
          const mailSpySuccess = chai.spy.on(PaymentMail, 'cancel')
          agent
          .post('/orders/create/')
          .set('Authorization', res.headers.authorization)
          .send({
            currency: 'USD',
            provider: 'paypal',
            amount: 200,
            userId: user.body.id
          })
          .expect(200).end((err, order) => {
            if(err) done(err)
            const orderData = order.body
            const cancelPath = `/v2/payments/authorizations/foo/void`
            nock(url)
              .post(cancelPath)
              .reply(204)
            agent
            .post('/orders/cancel')
            .set('Authorization', res.headers.authorization)
            .send({
              id: orderData.id
            })
            .expect(200)
            .end((err, canceled) => {
              expect(canceled.statusCode).to.equal(200)
              expect(canceled.body).to.exist
              expect(canceled.body.currency).to.equal('USD')
              expect(canceled.body.amount).to.equal('200')
              expect(canceled.body.status).to.equal('canceled')
              expect(canceled.body.paid).to.equal(false)
              expect(mailSpySuccess).to.have.been.called()
              done(err);
            })
          })
        }).catch(done)
      }).catch(done)
    })

    xit('should fetch a paypal order with details', (done) => {
      const url = 'https://api.sandbox.paypal.com'
      const path = '/v1/oauth2/token'
      const anotherPath = '/v2/checkout/orders'
      nock(url)
      .persist()
      .post(path)
      .reply(200, {access_token: 'foo'}, {
        'Content-Type': 'application/json',
      })
      nock(url)
      .post(anotherPath)
      .reply(200, {
        id: 'order_foo',
        links: [
          {href: 'http://foo.com'},
          {href: 'http://foo.com'}
        ],
        'purchase_units': [{
          'payments': {
            'authorizations': [{
              id: 'auth_foo'
            }]
          }
        }]
      }, {
        'Content-Type': 'application/json',
      })
      register(agent, {email: 'testcancelorder@gitpay.me'}).then(res => {
        login(agent, {email: 'testcancelorder@gitpay.me'}).then(user => {
          agent
          .post('/orders/create/')
          .set('Authorization', user.headers.authorization)
          .send({
            currency: 'USD',
            provider: 'paypal',
            amount: 200,
            userId: user.body.id
          })
          .expect(200).end((err, order) => {
            const orderData = order.body
            const detailsPath = `/v2/checkout/orders/${orderData.source_id}`
            nock(url)
              .get(detailsPath)
              .reply(200, {
                id: 'order_foo',
                status: 'CREATED'
              })
            agent
            .get(`/orders/details/${orderData.id}`)
            .set('Authorization', user.headers.authorization)
            .expect(200)
            .end((err, orderDetails) => {
              expect(orderDetails.statusCode).to.equal(200)
              expect(orderDetails.body).to.exist
              expect(orderDetails.body.currency).to.equal('USD')
              expect(orderDetails.body.amount).to.equal('200')
              expect(orderDetails.body.status).to.equal('open')
              expect(orderDetails.body.paid).to.equal(false)
              expect(orderDetails.body.paypal.status).to.equal('CREATED')
              done();
            })
          })
        })
      })
    })

    it('should authorize a paypal order', (done) => {
      // need mock update route for Paypal api tests as the previous tests
      models.Order.build({
        source_id: 'PAY-TEST',
        currency: 'USD',
        amount: 200
      }).save().then((order) => {
        agent
          .get('/orders/authorize/?paymentId=PAY-TEST&token=EC-TEST&PayerID=TESTPAYERID')
          .expect(302)
          .end((err, res) => {
            expect(res.statusCode).to.equal(302);
            done();
          })
      })
    })

    xit('should update a paypal order', (done) => {
      const url = 'https://api.sandbox.paypal.com'
      const path = '/v1/oauth2/token'
      const anotherPath = '/v2/checkout/orders'
      nock(url)
      .persist()
      .post(path)
      .reply(200, {access_token: 'foo'}, {
        'Content-Type': 'application/json',
      })
      nock(url)
      .post(anotherPath)
      .reply(200, {
        id: 'order_foo',
        links: [
          {href: 'http://foo.com'},
          {href: 'http://foo.com'}
        ],
        'purchase_units': [{
          'payments': {
            'authorizations': [{
              id: 'auth_foo'
            }]
          }
        }]
      }, {
        'Content-Type': 'application/json',
      })
      models.Order.build({
        source_id: 'PAY-TEST',
        currency: 'USD',
        amount: 200,
        provider: 'paypal'
      }).save().then((order) => {
        agent
          .put('/orders/update/', { id: order.dataValues.id })
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.exist;
            expect(res.body).to.equal('PAY-TEST');
            done();
          })
      })
    })

    it('should fetch order', (done) => {
      models.Order.build({
        source_id: '12345',
        currency: 'BRL',
        amount: 200
      }).save().then((order) => {
        agent
          .get(`/orders/fetch/${order.dataValues.id}`)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.exist;
            expect(res.body.source_id).to.equal('12345');
            expect(res.body.currency).to.equal('BRL');
            expect(res.body.amount).to.equal('200');
            done();
          })
        })
      });
    })
    // weird response happening
    xit('should transfer a Stripe order', (done) => {
      register(agent, {email: 'test_transfer_order@gitpay.me'}).then(user => {
        login(agent, {email: 'test_transfer_order@gitpay.me'}).then(res => {
            Promise.all([
              models.Task.build({url: 'https://github.com/worknenjoy/truppie/issues/7363', userId: user.body.id}).save(),
              models.Task.build({url: 'https://github.com/worknenjoy/truppie/issues/7364', userId: user.body.id, status: 'in_progress'}).save()
            ]).then( tasks => {
              models.Order.build({
                source_id: '12345',
                currency: 'BRL',
                amount: 200,
                taskId: tasks[0].dataValues.id
              }).save().then((order) => {
                agent
                  .post(`/orders/transfer/${order.dataValues.id}`)
                  .send({
                    taskId: tasks[1].dataValues.id
                  })
                  .set('Authorization', res.headers.authorization)
                  .expect('Content-Type', /json/)
                  .expect(200, done)
                  .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.exist;
                    expect(res.body.source_id).to.equal('12345');
                    expect(res.body.currency).to.equal('BRL');
                    expect(res.body.amount).to.equal('200');
                    done();
                  }).catch(e => {
                    // eslint-disable-next-line no-console
                    //console.log('error on catch 1', e)
                    done(e)
                  })
                }).catch(e => {
                  // eslint-disable-next-line no-console
                  //console.log('error on catch 2', e)
                  done(e)
                })
            }).catch(e => {
              // eslint-disable-next-line no-console
              //console.log('error on catch 3', e)
              done(e)
            })
        }).catch(e => {
          // eslint-disable-next-line no-console
          //console.log('error on catch 4', e)
          done(e)
        })
      }).catch(e => {
        // eslint-disable-next-line no-console
        //console.log('error on catch 4', e)
        done(e)
      })
    });
})
