'use strict'
const assert = require('assert')
const request = require('supertest')
const expect = require('chai').expect
const chai = require('chai')
const spies = require('chai-spies')
const api = require('../src/server').default
const ContactMail = require('../src/modules/mail/contact')
const agent = request.agent(api)

describe('Contact', () => {
  describe('Contact recruiters', () => {
    xit('should contact recruiters', (done) => {
      chai.use(spies)
      const mailSpySuccess = chai.spy.on(ContactMail, 'recruiters')
      agent
        .post('/contact/recruiters')
        .send({
          name: 'Foo',
          title: 'Bar',
          email: 'email',
          phone: 'phone',
          company: 'company',
          country: 'country',
          message: 'message',
        })
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.exist
          expect(mailSpySuccess).to.have.been.called()
          done(err)
        })
    })
  })
})
