'use strict'
const nock = require('nock')
const assert = require('assert')
const request = require('supertest')
const expect = require('chai').expect
const api = require('../server');
const agent = request.agent(api);
const models = require('../models');
const { registerAndLogin, register, login, truncateModels} = require('./helpers')
const githubOrg = require('./data/github/github.org')
const secrets = require('../config/secrets')

describe("Users", () => {

  beforeEach(async () => {

    await truncateModels(models.Task);
    await truncateModels(models.User);
    await truncateModels(models.Assign);
    await truncateModels(models.Order);
    await truncateModels(models.Transfer);
  })
  afterEach(async () => {
    nock.cleanAll();
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
          done(err);
        })
    })
  })

  describe('register User', () => {
    it('should register and generate token', (done) => {
      agent
        .post('/auth/register')
        .send({email: 'teste@gmail.com', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.exist;
          expect(res.body.activation_token).to.exist
          expect(res.body.email_verified).to.equal(false)
          done(err);
        })
    })
    it('shouldnt register with long names', (done) => {
      agent
        .post('/auth/register')
        .send({
          name: 'a really llong name a really llong name a really llong name a really llong name a really llong name a really llong name a really llong name a really llong name a really llong name',
          email: 'teste@gmail.com',
          password: 'teste'
        })
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          expect(res.body).to.exist;
          expect(res.body.message).to.equal('user.name.too.long')
          done(err);
        })
    })
    it('shouldnt register with long email', (done) => {
      agent
        .post('/auth/register')
        .send({
          email: 'a really llong name a really llong name a really llong name a really llong name a really llong name a really llong name a really llong name a really llong name a really llong name@email.com',
          password: 'teste'
        })
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          expect(res.body).to.exist;
          expect(res.body.message).to.equal('user.email.too.long')
          done(err);
        })
    })
    it('shouldnt register with long password', (done) => {
      agent
        .post('/auth/register')
        .send({
          email: 'email@test.com',
          password: 'a really llong name a really llong name a really llong name a really llong name a really llong name a really llong name a really llong name a really llong name a really llong name@email.com'
        })
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          expect(res.body).to.exist;
          expect(res.body.message).to.equal('user.password.too.long')
          done(err);
        })
    })
    it('should validate user activation token', (done) => {
      agent
        .post('/auth/register')
        .send({email: 'teste22222@gmail.com', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          agent
            .get(`/auth/activate?token=${res.body.activation_token}&userId=${res.body.id}`)
            .expect(200)
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);
              expect(res.body['email_verified']).to.equal(true);
              done(err);
            })
        })
    })
    it('should resend activation token with no existing one', (done) => {
      registerAndLogin(agent).then(res => {
          agent
            .get(`/auth/resend-activation-email`)
            .set('Authorization', res.headers.authorization)
            .expect(200)
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);
              expect(res.body['email_verified']).to.equal(false);
              expect(res.body['activation_token']).to.exist
              done(err);
            })
        })
      
    })
    it('should resend user activation token', (done) => {
      agent
        .post('/auth/register')
        .send({email: 'teste22222@gmail.com', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          agent
            .get(`/auth/activate?token=${res.body.activation_token}&userId=${res.body.id}`)
            .expect(200)
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);
              expect(res.body['email_verified']).to.equal(true);
              done(err);
            })
        })
    })
    it('dont allow register with the same user', (done) => {
      agent
        .post('/auth/register')
        .send({email: 'teste43434343@gmail.com', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if(err) done(err)
          agent
            .post('/auth/register')
            .send({email: 'teste43434343@gmail.com', password: 'teste'})
            .expect('Content-Type', /json/)
            .expect(403)
            .end((err, res) => {
              expect(res.statusCode).to.equal(403);
              expect(res.body.message).to.equal('user.exist');
              done(err);
            })
        })
    })
    it('register with user Types', async () => {
      const res = await agent
        .post('/auth/register')
        .send({email: 'teste4343434322222@gmail.com', password: 'test', Types: ['1', '2']})
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.exist;
      expect(res.body.Types).to.exist;
      expect(res.body.Types[0].id).to.equal(1);
      expect(res.body.Types[0].name).to.equal('funding');
      expect(res.body.Types[1].id).to.equal(2);
      expect(res.body.Types[1].name).to.equal('contributor');
    })
  })

  describe('update User', () => {
    it('should update user', (done) => {
      registerAndLogin(agent).then(res => {
        agent
          .put(`/user/update`)
          .send({name: 'test', email: 'test@gmail.com'})
          .set('Authorization', res.headers.authorization)
          .expect(200)
          .end((err, user) => {
            expect(user.statusCode).to.equal(200);
            expect(user.body.name).to.equal('test');
            expect(user.body.email).to.equal('test@gmail.com');
            done(err);
          }
        )
      }).catch(done)
    })

    it('should reset password from the right token', (done) => {
      registerAndLogin(agent, {
        recover_password_token: '123'
      }).then(res => {
        agent
          .put(`/auth/reset-password`)
          .send({ password: '', token: '123' })
          .set('Authorization', res.headers.authorization)
          .expect(200)
          .end((err, user) => {
            expect(user.statusCode).to.equal(200);
            expect(user.text).to.equal('successfully change password');
            done(err);
          }
        )
      }).catch(done)
    })

    it('should not reset password from the wrong token', (done) => {
      registerAndLogin(agent, {
        recover_password_token: '1234'
      }).then(res => {
        agent
          .put(`/auth/reset-password`)
          .send({ password: '', token: '123' })
          .set('Authorization', res.headers.authorization)
          .expect(401)
          .end((err, user) => {
            expect(user.statusCode).to.equal(401);
            done(err);
          }
        )
      }).catch(done)
    })

    it('should not update if old password is incorrect (too small)', (done) => {
      registerAndLogin(agent).then(res => {
        agent
          .put(`/auth/change-password`)
          .send({old_password: '1232', password: ''})
          .set('Authorization', res.headers.authorization)
          .expect(400)
          .end((err, user) => {
            expect(user.statusCode).to.equal(400);
            expect(user.body.error).to.equal('user.password.current.incorrect.too_short');
            done(err);
          }
        )
      }).catch(done)
    })
    it('should not update if password is the same', (done) => {
      registerAndLogin(agent).then(res => {
        agent
          .put(`/auth/change-password`)
          .send({old_password: 'test12345678', password: 'test12345678'})
          .set('Authorization', res.headers.authorization)
          .expect(400)
          .end((err, user) => {
            expect(user.statusCode).to.equal(400);
            expect(user.body.error).to.equal('user.password.incorrect.same');
            done(err);
          }
        )
      }).catch(done)
    })
    it('should update if password is correct', (done) => {
      registerAndLogin(agent).then(res => {
        agent
          .put(`/auth/change-password`)
          .send({old_password: 'test12345678', password: 'test12345678910'})
          .set('Authorization', res.headers.authorization)
          .expect(200)
          .end((err, user) => {
            expect(user.statusCode).to.equal(200);
            expect(user.body).to.equal(true);
            done(err);
          }
        )
      }).catch(done)
    })
    it('should not update if new password is too small', (done) => {
      registerAndLogin(agent).then(res => {
        agent
          .put(`/auth/change-password`)
          .send({old_password: 'test12345678', password: 'test'})
          .set('Authorization', res.headers.authorization)
          .expect(400)
          .end((err, user) => {
            expect(user.statusCode).to.equal(400);
            expect(user.body.error).to.equal('user.password.new.incorrect.too_short');
            done(err);
          }
        )
      }).catch(done)
    })
    it('should not update if new password is too big', (done) => {
      registerAndLogin(agent).then(res => {
        agent
          .put(`/auth/change-password`)
          .send({old_password: 'test12345678', password: 'test12345678test12345678test12345678test12345678test12345678test12345678test12345678'})
          .set('Authorization', res.headers.authorization)
          .expect(400)
          .end((err, user) => {
            expect(user.statusCode).to.equal(400);
            expect(user.body.error).to.equal('user.password.new.incorrect.too_long');
            done(err);
          }
        )
      }).catch(done)
    })
    it('Should delete user', (done) => {
      registerAndLogin(agent).then(res => {
        console.log(res.statusCode, res.headers)
        const userId = res.body.id
        agent
          .delete(`/user/delete/`)
          .set('Authorization', res.headers.authorization)
          .expect(200)
          .end((err, user) => {
            expect(user.statusCode).to.equal(200);
            expect(user.text).to.equal('1');
            const users = models.User.findAll({where: {id: userId}})
            expect(users).to.exist;
            done(err);
          }
        )
      }).catch(done)
    })
  })

  describe('login User Local', () => {
    it('should user local', (done) => {
      agent
        .post('/auth/register')
        .send({email: 'teste@gmail.com', password: 'teste'})
        .type('form')
        .expect('Content-Type', /json/)
        .end((err, res) => {
          agent
            .post('/authorize/local')
            .send({username: 'teste@gmail.com', password: 'teste'})
            .type('form')
            .expect(302)
            .end((err, res) => {
              expect(res.statusCode).to.equal(302);
              expect(res.text).to.include('token')
              done(err);
            })
        }
      )
    })
  })

  describe('login User social networks', () => {
    it('should user wrong authentication', (done) => {
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
    xit('should callback after authorize on github', (done) => {
      agent
        .get('/callback/github')
        .send({scope:['user:email']})
        .expect(200)
        .end((err, res) => {
          expect(res.headers.location).to.include('https://github.com/login/oauth/authorize?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback%2Fgithub%2Fprivate%3FuserId%3Dundefined%26url%3Dundefined&scope=repo&client_id=')
          done(err);
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
          done(err);
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
            done(err);
          })
      }).catch(done)
    });
    it('should try get customer info with customer id set', (done) => {
      
      nock('https://api.stripe.com')
        .get('/v1/customers/cus_Ec8ZOuHXnSlBh8')
        .reply(200, {
          id: 'cus_Ec8ZOuHXnSlBh8',
          object: 'customer',
        })
      nock('https://api.stripe.com')
        .post('/v1/accounts')
        .reply(200, {});
      
      registerAndLogin(agent, {
        customer_id: 'cus_Ec8ZOuHXnSlBh8'
      }).then(res => {
        agent
          .get(`/user/customer/`)
          .set('Authorization', res.headers.authorization)
          .expect(200)
          .end((err, user) => {
            expect(user.statusCode).to.equal(200);
            expect(user.body.object).to.equal('customer');
            expect(user.body.id).to.equal('cus_Ec8ZOuHXnSlBh8');
            done(err);
          })
      }).catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err);
        done(err);
      })
    });
  });

  describe("Customer create", () => {
    it('should try to create new customer', (done) => {
      nock('https://api.stripe.com')
        .post('/v1/customers')
        .reply(200, {
          id: 'cus_Ec8ZOuHXnSlBh8',
          object: 'customer',
          name: 'test',
          email: 'test'
        })
      
      registerAndLogin(agent).then(res => {
        agent
          .post(`/user/customer/`)
          .send({ name: 'test', email: res.body.email })
          .set('Authorization', res.headers.authorization)
          .expect(200)
          .end((err, user) => {
            expect(user.statusCode).to.equal(200);
            expect(user.body.id).to.equal('cus_Ec8ZOuHXnSlBh8');

            done(err);
          })
      }).catch(done)
    });
  });

  describe("Customer update", () => {
    it('should try to update customer', (done) => {
      nock('https://api.stripe.com')
        .post('/v1/customers/cus_Ec8ZOuHXnSlBh8')
        .reply(200, {
          id: 'cus_Ec8ZOuHXnSlBh8',
          object: 'customer',
          name: 'test2',
          email: 'test'
        })
      
      registerAndLogin(agent, {
        customer_id: 'cus_Ec8ZOuHXnSlBh8'
      }).then(res => {
        agent
          .put(`/user/customer/`)
          .send({ name: 'test2' })
          .set('Authorization', res.headers.authorization)
          .expect(200)
          .end((err, user) => {
            expect(user.statusCode).to.equal(200);
            expect(user.body.id).to.equal('cus_Ec8ZOuHXnSlBh8');
            expect(user.body.name).to.equal('test2');
            done(err);
          })
      }).catch(done)
    });
  });

  describe('user preferences', () => {
    xit('should retrieve user preferences', (done) => {
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
            done(err);
          })
      }).catch(done)
    });
  })

  xdescribe('user organizations', () => {
    xit('should create organization and associate with an user', (done) => {
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
            .then((err, org) => {
              if(!err) {
                //expect(org.statusCode).to.equal(200);
                agent
                  .get(`/user/organizations`)
                  .send({ id: UserId })
                  .set('Authorization', login.headers.authorization)
                  .expect(200)
                  .end((err, orgs) => {
                    expect(orgs.statusCode).to.equal(200);
                    expect(orgs.body[0].name).to.equal('test');
                    expect(orgs.body[0].imported).to.equal(true);
                    done(err);
                  })
              } else {
                done(err)
              }
            })
          }).catch(done)
        }).catch(done)
    })
    xit('should retrieve user github organizations', (done) => {
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
              expect(orgs.body[0].name).to.equal('test');
              expect(orgs.body[0].imported).to.equal(false);
              done(err);
            })
          }).catch(done)
        }).catch(done)
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
              done(err);
            })
          }).catch(done)
        }).catch(done)
    });
    it('should retrieve country specs for user', (done) => {
      nock('https://api.stripe.com')
        .get('/v1/accounts/acct_1CVSl2EI8tTzMKoL')
        .reply(200, {
          object: 'account',
          country: 'US'
        });

      nock('https://api.stripe.com')
        .get('/v1/country_specs/US')
        .reply(200, {
          object: 'country_spec'
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
            .get(`/user/account/countries`)
            .send({ id: userId })
            .set('Authorization', login.headers.authorization)
            .expect(200)
            .end((err, user) => {
              expect(user.statusCode).to.equal(200);
              expect(user.body.object).to.equal('country_spec');
              done(err);
            })
          }).catch(done)
        }).catch(done)
    });
    xit('should create account for user in US', (done) => {
      nock('https://api.stripe.com')
            .post('/v1/accounts')
            .replyWithFile(200, __dirname + '/data/account.json', {
              'Content-Type': 'application/json',
            })
      register(agent, {
        email: 'test_user_account_create@gmail.com',
        password: 'test'
      }).then(user => {
          const userId = user.id
          login(agent, {
            email: 'test_user_account_create@gmail.com',
            password: 'test'
          }).then(res => {
            agent
            .post(`/user/account`)
            .send({ id: userId, country: 'US' })
            .set('Authorization', res.headers.authorization)
            .expect(200)
            .end((err, finalResponse) => {
              expect(finalResponse.statusCode).to.equal(200);
              expect(finalResponse.body.object).to.equal('account');
              expect(finalResponse.body.country).to.equal('US');
              done();
            })
          }).catch(done)
        }).catch(done)
    });
    xit('should update account for user', (done) => {
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
              done(err);
            })
          }).catch(done)
        }).catch(done)
    });
  });
  describe('bank account', () => {
    it('should update bank account for user', (done) => {
      nock('https://api.stripe.com')
        .get('/v1/accounts/acct_1CVSl2EI8tTzMKoL/external_accounts?object=bank_account')
        .reply(200, {
          object: 'list',
          data: [
            {
              object: 'bank_account',
              id: 'ba_1CVSl2EI8tTzMKoL'
            }
          ]
        });

      nock('https://api.stripe.com')
        .post('/v1/accounts/acct_1CVSl2EI8tTzMKoL/external_accounts/ba_1CVSl2EI8tTzMKoL')
        .reply(200, {
          object: 'account'
        });
      registerAndLogin(agent, {
        account_id: 'acct_1CVSl2EI8tTzMKoL'
      }).then(res => {
        agent
          .put(`/user/bank_accounts`)
          .send({ account_id: 'acct_1CVSl2EI8tTzMKoL', routing_number: '110000000', account_number: '000123456789', country: 'US' })
          .set('Authorization', res.headers.authorization)
          .expect(200)
          .end((err, user) => {
            expect(user.statusCode).to.equal(200);
            expect(user.body.object).to.exist;
            done(err);
          })
      }).catch(done)
    })
  });
});
