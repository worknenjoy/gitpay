'use strict';

const assert = require('assert')
const request = require('supertest')
const expect = require('chai').expect
const api = require('../server');
const agent = request.agent(api);
const models = require('../loading/loading');

const chargeData = require('./data/charge');

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

  describe('webhooks for charge', () => {
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
          agent
            .post('/webhooks')
            .send({

            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.exist;
              expect(res.body).to.equal(false);
              done();
            })
        })

    });

    it('should update the order when a webhook charge.update is triggered', (done) => {
      agent
        .post('/auth/register')
        .send({email: 'alexanmtz@gmail.com', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, user) => {
          agent
            .post('/orders/create/')
            .send({
              source_id: 'card_1CcdmoBrSjgsps2Dw7RRQDwp',
              currency: 'BRL',
              amount: 200,
              source: 'ch_1CcdmsBrSjgsps2DNZiZAyvG',
              email: 'testing@gitpay.me',
              userId: user.body.id
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, order) => {
              agent
                .post('/webhooks')
                .send(chargeData.update)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                  expect(res.statusCode).to.equal(200);
                  expect(res.body).to.exist;
                  expect(res.body.id).to.equal('evt_1CcecMBrSjgsps2DMFZw5Tyx');
                  models.Order.findById(order.body.id).then((o) => {
                    expect(o.dataValues.source).to.equal('ch_1CcdmsBrSjgsps2DNZiZAyvG');
                    expect(o.dataValues.paid).to.equal(true);
                    expect(o.dataValues.status).to.equal('succeeded');
                    done();
                  });
                })
            })
        })
    })

  })
});
