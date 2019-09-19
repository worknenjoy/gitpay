'use strict'

const assert = require('assert')
const request = require('supertest')
const expect = require('chai').expect
const api = require('../server');
const agent = request.agent(api);
const models = require('../models');
const { registerAndLogin, register, login } = require('./helpers')
const nock = require('nock')
const githubOrg = require('./data/github.org')
const secrets = require('../config/secrets')

describe("Users", () => {

  beforeEach(() => {

    nock.cleanAll()

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
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.exist;
          done();
        })
    })
  })

  describe('register User', () => {
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
    it('dont allow register with the same user', (done) => {
      agent
        .post('/auth/register')
        .send({email: 'teste43434343@gmail.com', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          agent
            .post('/auth/register')
            .send({email: 'teste43434343@gmail.com', password: 'teste'})
            .expect('Content-Type', /json/)
            .expect(403)
            .end((err, res) => {
              expect(res.statusCode).to.equal(403);
              expect(res.body.error).to.equal('user.exist');
              done();
            })
        })
    })
  })

  describe('login User Local', () => {
    it('should user local', (done) => {
      agent
        .post('/authorize/local')
        .send({email: 'teste@gmail.com', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(302)
        .end((err, res) => {
          expect(res.statusCode).to.equal(302);
          done();
        })
    })
  })

  describe('login User social networks', () => {
    it('should user authenticated', (done) => {
      agent
        .get('/authenticated')
        .set('authorization', 'Bearer token-123') // 1) using the authorization header
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
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
          done();
        })
    })
    it('should user login with github', (done) => {
      agent
        .get('/authorize/github')
        .send({email: 'teste@gmail.com', password: 'teste'})
        .expect(302)
        .end((err, res) => {

          expect(res.statusCode).to.equal(302);
          expect(res.headers.location).to.include('https://github.com/login/oauth/authorize?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback%2Fgithub&scope=user%3Aemail&client_id=')
          done();
        })
    })
    it('should user ask permissions with github to access private issue', (done) => {
      agent
        .get('/authorize/github/private')
        .send({userId: 2, url: 'https://github.com/alexanmtz/project/issues/2', code: '123'})
        .expect(302)
        .end((err, res) => {
          expect(res.statusCode).to.equal(302);
          expect(res.headers.location).to.include('https://github.com/login/oauth/authorize?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback%2Fgithub%2Fprivate%3FuserId%3Dundefined%26url%3Dundefined&scope=repo&client_id=')
          done();
        })
    })
  })

  describe("Customer get", () => {
    it('should try get customer info with no customer', (done) => {
      registerAndLogin(agent).then(res => {
        agent
          .get(`/user/customer/`)
          .set('Authorization', res.headers.authorization)
          .expect(200)
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.equal(false);
            done();
          })
      })
    });
    it('should try get customer info with customer id set', (done) => {
      registerAndLogin(agent, {
        customer_id: 'cus_Ec8ZOuHXnSlBh8'
      }).then(res => {
        nock('https://api.stripe.com')
        .get('/v1/customers/cus_Ec8ZOuHXnSlBh8')
        .reply(200, {
          id: 'cus_Ec8ZOuHXnSlBh8',
          object: 'customer',
        })
        nock('https://api.stripe.com')
        .post('/v1/accounts')
        .reply(200, {});
        agent
          .get(`/user/customer/`)
          .set('Authorization', res.headers.authorization)
          .expect(200)
          .end((err, user) => {
            expect(user.statusCode).to.equal(200);
            expect(user.body.object).to.equal('customer');
            done();
          })
      })
    });
  });

  describe('user preferences', () => {
    it('should retrieve user preferences', (done) => {
      registerAndLogin(agent, {
        email: 'teste@gmail.com',
        password: 'teste',
        country: 'usa',
        language: 'en'
      }).then(res => {
        agent
          .get(`/user/preferences`)
          .set('Authorization', res.headers.authorization)
          .expect(200)
          .end((err, user) => {
            expect(user.statusCode).to.equal(200);
            expect(user.body.language).to.exist;
            expect(user.body.country).to.exist;
            done();
          })
      })
    });
  })

  describe('user organizations', () => {
    it('should create organization and associate with an user', (done) => {
      nock('https://api.github.com')
        .get(`/users/test/orgs?client_id=${secrets.github.id}&client_secret=${secrets.github.secret}`)
        .reply(200, githubOrg);
      register(agent, {
        email: 'test_user_organizations_create@gmail.com',
        username: 'test',
        password: 'test',
        provider: 'github'
      }).then(res => {
          const UserId = res.body.id
          login(agent, {
            email: 'test_user_organizations_create@gmail.com',
            password: 'test'
          }).then(login => {
            agent
            .post(`/organizations/create`)
            .send({ UserId, name: 'test' })
            .set('Authorization', login.headers.authorization)
            .expect(200)
            .end((err, org) => {
              expect(org.statusCode).to.equal(200);
              agent
              .get(`/user/organizations`)
              .send({ id: UserId })
              .set('Authorization', login.headers.authorization)
              .expect(200)
              .end((err, orgs) => {
                expect(orgs.statusCode).to.equal(200);
                expect(orgs.body[0].name).to.equal('test');
                expect(orgs.body[0].imported).to.equal(true);
                done();
              })
            })
          })
        })
    })
    it('should retrieve user github organizations', (done) => {
      nock('https://api.github.com')
        .get(`/users/test/orgs?client_id=${secrets.github.id}&client_secret=${secrets.github.secret}`)
        .reply(200, githubOrg);
      register(agent, {
        email: 'test_user_organizations@gmail.com',
        username: 'test',
        password: 'test',
        provider: 'github'
      }).then(res => {
          const userId = res.body.id
          login(agent, {
            email: 'test_user_organizations@gmail.com',
            password: 'test'
          }).then(login => {
            agent
            .get(`/user/organizations`)
            .send({ id: userId })
            .set('Authorization', login.headers.authorization)
            .expect(200)
            .end((err, orgs) => {
              expect(orgs.statusCode).to.equal(200);
              console.log('orgs list', orgs.body)
              expect(orgs.body[0].name).to.equal('test');
              expect(orgs.body[0].imported).to.equal(false);
              done();
            })
          })
        })
    });
    xit('should check if that organizations exist, if exist return true if already imported', (done) => {
      nock('https://api.github.com')
        .get(`/users/test/orgs?client_id=${secrets.github.id}&client_secret=${secrets.github.secret}`)
        .reply(200, githubOrg);
      register(agent, {
        email: 'test_user_organizations_exist@gmail.com',
        username: 'test',
        password: 'test',
        provider: 'github'
      }).then(res => {
          const userId = res.body.id
          login(agent, {
            email: 'test_user_organizations_exist@gmail.com',
            password: 'test'
          }).then(login => {
            agent
            .get(`/user/organizations`)
            .send({ id: userId, organization: 'foo' })
            .set('Authorization', login.headers.authorization)
            .expect(200)
            .end((err, user) => {
              expect(user.statusCode).to.equal(200);
              expect(user.body).to.equal(false);
              done();
            })
          })
        })
    });
  })

  describe('user account', () => {
    it('should retrieve account for user', (done) => {
      nock('https://api.stripe.com')
        .get('/v1/accounts/acct_1CVSl2EI8tTzMKoL')
        .reply(200, {
          object: 'account'
        });
      register(agent, {
        email: 'test_user_account@gmail.com',
        password: 'test',
        account_id: 'acct_1CVSl2EI8tTzMKoL'
      }).then(res => {
          const userId = res.body.id
          login(agent, {
            email: 'test_user_account@gmail.com',
            password: 'test'
          }).then(login => {
            agent
            .get(`/user/account`)
            .send({ id: userId })
            .set('Authorization', login.headers.authorization)
            .expect(200)
            .end((err, user) => {
              expect(user.statusCode).to.equal(200);
              expect(user.body.object).to.equal('account');
              done();
            })
          })
        })
    });
    it('should create account for user in US', (done) => {
      nock('https://api.stripe.com')
            .post('/v1/accounts')
            .replyWithFile(200, __dirname + '/data/account.json', {
              'Content-Type': 'application/json',
            })
      register(agent, {
        email: 'test_user_account_create@gmail.com',
        password: 'test'
      }).then(res => {
          const userId = res.body.id
          login(agent, {
            email: 'test_user_account_create@gmail.com',
            password: 'test'
          }).then(login => {
            agent
            .post(`/user/account`)
            .send({ id: userId, country: 'US' })
            .set('Authorization', login.headers.authorization)
            .expect(200)
            .end((err, user) => {
              expect(user.statusCode).to.equal(200);
              expect(user.body.object).to.equal('account');
              expect(user.body.country).to.equal('US');
              done();
            })
          })
        })
    });
    it('should update account for user', (done) => {
      nock('https://api.stripe.com')
        .post('/v1/accounts/acct_1CVSl2EI8tTzMKoL')
        .reply(200, {
          object: 'account'
        });
      register(agent, {
        email: 'test_user_account_update@gmail.com',
        password: 'test',
        account_id: 'acct_1CVSl2EI8tTzMKoL'
      }).then(res => {
          const userId = res.body.id
          login(agent, {
            email: 'test_user_account_update@gmail.com',
            password: 'test'
          }).then(login => {
            agent
            .put(`/user/account`)
            .send({
              id: userId,
              account: {}
            })
            .set('Authorization', login.headers.authorization)
            .expect(200)
            .end((err, user) => {
              expect(user.statusCode).to.equal(200);
              expect(user.body.object).to.equal('account');
              done();
            })
          })
        })
    });
  });

});
