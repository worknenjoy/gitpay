import request from 'supertest'
import { expect } from 'chai'
import chai from 'chai'
import api from '../src/server'
import Models from '../src/models'
import { register, createTask, truncateModels } from './helpers'
import PaymentRequestMail from '../src/modules/mail/paymentRequest'
import sinon from 'sinon'
import * as constants from '../src/modules/mail/constants'
import { sendgrid } from '../src/config/secrets'
import nock from 'nock'

const agent = request.agent(api)
const models = Models as any

describe('Mail', () => {
  before(() => {
    sinon.stub(sendgrid, 'apiKey').get(() => 'SG.TEST_API_KEY')
  })

  after(() => {
    sinon.restore()
  })

  beforeEach(async () => {
    await truncateModels(models.User)
  })

  it('should send transfer initiated email', async () => {
    nock('https://api.sendgrid.com')
      .persist()
      .post('/v3/mail/send')
      .reply(202, [
        {
          type: 'text/html',
          value: 'email content'
        }
      ])

    const user = await register(agent)
    const { body } = user

    const mailResponse = await PaymentRequestMail.paymentRequestInitiated(body, {
      title: 'Test Payment Request',
      description: 'This is a test payment request',
      currency: 'USD',
      amount: 100.0,
      paymentUrl: 'https://example.com/payment-link'
    })
    expect(mailResponse[0].statusCode).to.equal(202)
  })
})
