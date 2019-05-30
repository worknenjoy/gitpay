'use strict'

const assert = require('assert')
const request = require('supertest')
const expect = require('chai').expect
const api = require('../server');
const agent = request.agent(api);
const models = require('../models');
const { register, login } = require('./helpers')

describe("Organizations", () => {

  beforeEach(() => {

    models.User.destroy({ where: {}, truncate: true, cascade: true }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
      if (rowDeleted === 1) {
        console.log('Deleted successfully');
      }
    }, function (err) {
      console.log(err);
    });

    models.Organization.destroy({ where: {}, truncate: true, cascade: true }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
      if (rowDeleted === 1) {
        console.log('Deleted successfully');
      }
    }, function (err) {
      console.log(err);
    });

  })

  xdescribe('findAll Organizations', () => {
    it('should find user', (done) => {
      agent
        .get('/organizations')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.exist;
          done();
        })
    })
  })

  describe('register Organization', () => {
    it('should register new organization with a user', (done) => {
      register(agent, {
        email: 'test_register_organization@gmail.com',
        username: 'test',
        password: 'test',
        provider: 'github'
      }).then(res => {
          const UserId = res.body.id
          login(agent, {
            email: 'test_register_organization@gmail.com',
            password: 'test'
          }).then(login => {
            agent
            .post(`/organizations/create`)
            .send({ UserId, name: 'foo' })
            .set('Authorization', login.headers.authorization)
            .expect(200)
            .end((err, org) => {
              expect(org.statusCode).to.equal(200);
              expect(org.body.name).to.equal('foo');
              done();
            })
          })
        })
    })
    xit('dont allow register with the same organization', (done) => {
      agent
        .post('/auth/register')
        .send({ email: 'teste43434343@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          agent
            .post('/auth/register')
            .send({ email: 'teste43434343@gmail.com', password: 'teste' })
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
});