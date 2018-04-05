'use strict'

const assert = require('assert')
const request = require('supertest')
const expect = require('chai').expect
const api = require('../server');
const agent = request.agent(api);
const models = require('../loading/loading');


describe('list tasks', () => {
  it('should list tasks', (done) => {
    agent
      .get('/tasks/list')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.exist;
        done();
      })
  })
})

describe('create Task', () => {
  it('should create a new task', (done) => {
    agent
      .post('/tasks/create/')
      .send({url: 'http://foo.com', provider: 'github', userId: 1})
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.exist;
        done();
      })
  })
})
