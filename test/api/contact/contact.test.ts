import { expect } from 'chai'
import chai from 'chai'
import spies from 'chai-spies'
import request from 'supertest'
import api from '../../../src/server'
import ContactMail from '../../../src/modules/mail/contact'

const agent = request.agent(api)

describe('POST /contact', () => {
  describe('Contact recruiters', () => {
    xit('should contact recruiters', async () => {
      chai.use(spies)
      const mailSpySuccess = chai.spy.on(ContactMail, 'recruiters')
      const res = await agent
        .post('/contact/recruiters')
        .send({
          name: 'Foo',
          title: 'Bar',
          email: 'email',
          phone: 'phone',
          company: 'company',
          country: 'country',
          message: 'message'
        })
        .expect(200)

      expect(res.statusCode).to.equal(200)
      expect(res.body).to.exist
      expect(mailSpySuccess).to.have.been.called()
    })
  })
})
