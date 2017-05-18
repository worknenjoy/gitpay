'use strict'

const assert = require('assert')
const request = require('supertest')
const expect = require('chai').expect
const api = require('../server');
const agent = request.agent(api)


describe('findAll User', () => {
    it('should find user', (done) => {
        agent
            .get('/getUserAll')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200)
                expect(res.body).to.exist;
                done();
            })
    })
})

