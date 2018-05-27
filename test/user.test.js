'use strict'

const assert = require('assert')
const request = require('supertest')
const expect = require('chai').expect
const api = require('../server');
const agent = request.agent(api);
const models = require('../loading/loading');

describe("Users", () => {

  before(() => {
    models.User.destroy({where: {}, truncate: true, cascade: true}).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
      if(rowDeleted === 1){
        console.log('Deleted successfully');
      }
    }, function(err){
      console.log(err);
    });
  })

  describe('findAll User', () => {
    it('should find user', (done) => {
      agent
        .get('/users')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          console.log(res, err)
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.exist;
          done();
        })
    })
  })

  describe.skip('register User', () => {
    it('should register', (done) => {
      agent
        .post('/auth/register')
        .send({email: 'teste@gmail.com', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.exist;
          done();
        })
    })
  })

  describe.skip('login User Local', () => {
    it('should user local', (done) => {
      agent
        .post('/authorize/local')
        .send({email: 'teste@gmail.com', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.exist;
          done();
        })
    })
  })

  describe.skip('login User social networks', () => {
    it('should user authenticated', (done) => {
      agent
        .get('/authenticated')
        .set('authorization', 'Bearer token-123') // 1) using the authorization header
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.authenticated).to.equal(true);
          done();
        })
    })

    it('should user google', (done) => {
      agent
        .get('/authorize/google')
        .send({email: 'teste@gmail.com', password: 'teste'})
        .expect(302)
        .end((err, res) => {

          expect(res.statusCode).to.equal(302);
          expect(res.headers.location).to.include('https://accounts.google.com/o/oauth2/v2/auth?access_type=')
          //expect(res.body.authenticated).to.equal(true);
          done();
        })
    })
    it('should user bitbucket', (done) => {
      agent
        .get('/authorize/bitbucket')
        .send({email: 'teste@gmail.com', password: 'teste'})
        .expect(302)
        .end((err, res) => {

          expect(res.statusCode).to.equal(302);
          expect(res.headers.location).to.include('https://bitbucket.org/site/oauth2/authorize')
          //expect(res.body.authenticated).to.equal(true);
          done();
        })
    })
  })

  describe.skip("Customer get", () => {
    it('should try get customer info with no customer', (done) => {
      agent
        .post('/auth/register')
        .send({email: 'teste@gmail.com', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.exist;
          agent
            .get(`/user/customer/`)
            .send({ id: res.body.id })
            .expect(200)
            .end((err, user) => {
              expect(user.statusCode).to.equal(200);
              expect(user.body).to.equal(false);
              done();
            })
        })
    });
    it('should try get customer info with customer id set', (done) => {
      agent
        .post('/auth/register')
        .send({email: 'teste@gmail.com', password: 'teste', customer_id: 'cus_CuK03K2mStPxBt'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.exist;
          console.log('user response');
          console.log(res.body);
          agent
            .get(`/user/customer/`)
            .send({ id: res.body.id })
            .expect(200)
            .end((err, user) => {
              expect(user.statusCode).to.equal(200);
              expect(user.body.object).to.equal('customer');
              done();
            })
        })
    });
  });

  describe.skip("user account", () => {
    it('should retrieve account for user', (done) => {
      agent
        .post('/auth/register')
        .send({email: 'teste@gmail.com', password: 'teste', account_id: 'acct_1CVSl2EI8tTzMKoL'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.exist;
          agent
            .get(`/users/${res.body.id}/account`)
            .send({ id: res.body.id })
            .expect(200)
            .end((err, user) => {
              expect(user.statusCode).to.equal(200);
              expect(user.body.object).to.equal('account');
              done();
            })
        })
    });
    it('should create account for user', (done) => {
      agent
        .post('/auth/register')
        .send({email: 'teste@gmail.com', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.exist;
          agent
            .post(`/user/account`)
            .send({ id: res.body.id })
            .expect(200)
            .end((err, account) => {
              expect(account.statusCode).to.equal(200);
              //expect(account.body.object).to.equal('account');
              done();
            })
        })
    });
    it('should update account for user', (done) => {
      agent
        .post('/auth/register')
        .send({email: 'teste@gmail.com', password: 'teste', account_id: 'acct_1CVlaHBN91lK7tu6'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.exist;
          agent
            .put(`/user/account`)
            .send({
              id: res.body.id,
              account: {}
            })
            .expect(200)
            .end((err, account) => {
              expect(account.statusCode).to.equal(200);
              console.log('response from account update');
              console.log(account.body);
              expect(account.body.object).to.equal('account');
              done();
            })
        })
    });
  });

});
