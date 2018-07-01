const request = require('supertest')
const expect = require('chai').expect
const api = require('../server')
const agent = request.agent(api)
const models = require('../loading/loading')

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
      agent
        .post('/orders/create/')
        .send({
          source_id: '12345',
          currency: 'BRL',
          amount: 200,
          email: 'testing@gitpay.me'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          console.log(err);
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.exist;
          expect(res.body.source_id).to.equal('12345');
          expect(res.body.currency).to.equal('BRL');
          expect(res.body.amount).to.equal('200');
          done();
        })
    })

    it('should create a new paypal order', (done) => {
      agent
        .post('/orders/create/')
        .send({
          source_id: '12345',
          currency: 'BRL',
          provider: 'paypal',
          amount: 200,
          email: 'testing@gitpay.me'
        })
        //.expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          console.log(err);
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.exist;
          expect(res.body.source_id).to.equal('12345');
          expect(res.body.currency).to.equal('BRL');
          expect(res.body.amount).to.equal('200');
          done();
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
