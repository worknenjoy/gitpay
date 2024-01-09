'use strict'
const assert = require('assert')
const request = require('supertest')
const expect = require('chai').expect
const chai = require('chai')
const spies = require('chai-spies')
const api = require('../server')
const agent = request.agent(api)
const { registerAndLogin } = require('./helpers')

describe("Transfer", () => {
  describe("Initial transfer with one credit card and account activated", () => {
    it("should create a new single transfer", (done) => {
      registerAndLogin(agent).then((res) => {
        expect(res.text).to.contain('token')
        done();
      });
    })
  })
})