'use strict'

const assert = require('assert')
const request = require('supertest')
const expect = require('chai').expect
const api = require('../server');
const agent = request.agent(api);


describe('list tasks', () => {
  it('should list tasks', (done) => {
    agent
      .get('/tasks')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.exist;
        done();
      })
  })
})
