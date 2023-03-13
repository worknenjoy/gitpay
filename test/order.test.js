const request = require('supertest')
const Promise = require('bluebird')
const expect = require('chai').expect
const chai = require('chai')
const spies = require('chai-spies')
const api = require('../server')
const agent = request.agent(api)
const nock = require('nock')
const models = require('../models')
const { registerAndLogin, register, login } = require('./helpers')
const PaymentMail = require('../modules/mail/payment')
const { error } = require('../modules/mail/transfer')

xdescribe('orders', () => {
  beforeEach(() => {
    models.Order.destroy({ where: {}, truncate: true, cascade: true }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
      if (rowDeleted === 1) {
        // eslint-disable-next-line no-console
        //console.log('Deleted successfully')
      }
    }, function (err) {
      // eslint-disable-next-line no-console
      //console.log(err)
    })
    models.User.destroy({where: {}, truncate: true, cascade: true}).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
      if(rowDeleted === 1){
        //console.log('Deleted successfully');
      }
    }, function(err){
      //console.log(err);
    });
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
    xit('should create a new order', (done) => {
      registerAndLogin(agent).then(user => {
        agent
          .post('/orders/create/')
          .send({
            source_id: '12345',
            currency: 'BRL',
            amount: 200,
            email: 'testing@gitpay.me'
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

    xit('should update a paypal order', (done) => {
      // need mock update route for Paypal api tests as the previous tests
      models.Order.build({
        source_id: 'PAY-TEST',
        currency: 'USD',
        amount: 200
      }).save().then((order) => {
        agent
          .get('/orders/update/?paymentId=PAY-TEST&token=EC-TEST&PayerID=TESTPAYERID')
          .expect(302)
          .end((err, res) => {
            //console.log(err);
            expect(res.statusCode).to.equal(302);
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
