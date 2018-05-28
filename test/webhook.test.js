'use strict';

const assert = require('assert')
const request = require('supertest')
const expect = require('chai').expect
const api = require('../server');
const agent = request.agent(api);
const models = require('../loading/loading');

describe("webhooks", () => {

  beforeEach(() => {
    models.Order.destroy({where: {}, truncate: true, cascade: true}).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
      if(rowDeleted === 1){
        console.log('Deleted successfully');
      }
    }, function(err){
      console.log(err);
    });
  })

  describe('webhooks', () => {
    it('should return false when the request is not a charge event', (done) => {
      agent
        .post('/orders/create/')
        .send({
          source_id: '12345',
          currency: 'BRL',
          amount: 200,
          source: 'foo',
          email: 'testing@gitpay.me'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          console.log('order created');
          console.log(res.body);
          agent
            .post('/webhooks/update')
            .send({

            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              console.log('called update');
              console.log(res.body);
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.exist;
              expect(res.body).to.equal(false);
              done();
            })
        })

    });

    it('should update the order when a webhook is triggered', (done) => {
      agent
        .post('/orders/create/')
        .send({
          source_id: '12345',
          currency: 'BRL',
          amount: 200,
          source: 'foo',
          email: 'testing@gitpay.me'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, order) => {
          agent
            .post('/webhooks/update')
            .send({
              object: "charge",
              id: "foo",
              metadata: {
                order_id: order.body.id
              }
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.exist;
              expect(res.body.id).to.equal('foo');
              models.Order.findById(order.body.id).then((o) => {
                expect(o.dataValues.source).to.equal('foo');
                //expect(o.dataValues.paid).to.equal(true);
                done();
              });
            })
        })

    })

  })
});
