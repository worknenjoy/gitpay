const request = require('supertest')
const expect = require('chai').expect
const api = require('../server')
const agent = request.agent(api)
const nock = require('nock')
const models = require('../models')
const { registerAndLogin } = require('./helpers')

describe('orders', () => {
  beforeEach(() => {
    models.Order.destroy({ where: {}, truncate: true, cascade: true }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
      if (rowDeleted === 1) {
        // eslint-disable-next-line no-console
        console.log('Deleted successfully')
      }
    }, function (err) {
      // eslint-disable-next-line no-console
      console.log(err)
    })
    models.User.destroy({where: {}, truncate: true, cascade: true}).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
      if(rowDeleted === 1){
        console.log('Deleted successfully');
      }
    }, function(err){
      console.log(err);
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
    it('should create a new order', (done) => {
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
            console.log('request body from test:')
            console.log(res.body);
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.exist;
            expect(res.body.source_id).to.equal('12345');
            expect(res.body.currency).to.equal('BRL');
            expect(res.body.amount).to.equal('200');
            done();
          })
      })
    })

    it('should create a new paypal order', (done) => {
      const url = process.env.PAYPAL_HOST
      const path = '/v1/oauth2/token'
      const anotherPath = '/v1/payments/payment'
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
          ]
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
          done();
        })
      })
    })

    it('should update a paypal order', (done) => {
      models.Order.build({
        source_id: 'PAY-TEST',
        currency: 'USD',
        amount: 200
      }).save().then((order) => {
        agent
          .get('/orders/update/?paymentId=PAY-TEST&token=EC-TEST&PayerID=TESTPAYERID')
          .expect(302)
          .end((err, res) => {
            console.log(err);
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
})
