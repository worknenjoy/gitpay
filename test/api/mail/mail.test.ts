import request from 'supertest'
import { expect } from 'chai'
import chai from 'chai'
import api from '../../../src/server'
import Models from '../../../src/models'
import { register, createTask, truncateModels } from '../../helpers'
import PaymentRequestMail from '../../../src/mail/paymentRequest'
import sinon from 'sinon'
import * as constants from '../../../src/mail/constants'
import { sendgrid } from '../../../src/config/secrets'
import nock from 'nock'

const agent = request.agent(api)
const models = Models as any

describe('POST /mail', () => {
  before(() => {
    sinon.stub(sendgrid, 'apiKey').get(() => 'SG.TEST_API_KEY')
  })

  after(() => {
    sinon.restore()
  })

  beforeEach(async () => {
    await truncateModels(models.User)
  })

  afterEach(() => {
    nock.cleanAll()
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

  it('should show the real platform fee (not $0) and Whop\'s own processing cut for a direct-charge transfer-initiated email', async () => {
    let capturedHtml = ''
    nock('https://api.sendgrid.com')
      .persist()
      .post('/v3/mail/send')
      .reply(202, (_uri: string, requestBody: any) => {
        const htmlContent = requestBody?.content?.find((c: any) => c.type === 'text/html')
        capturedHtml = htmlContent?.value || ''
        return [{ type: 'text/html', value: 'email content' }]
      })

    const user = await register(agent)
    const { body } = user

    // Mirrors a real direct-charge payment: gross $100, Whop's amount_after_fees $86.63
    // (already net of both Whop's own cut and Gitpay's application-fee commission), and
    // provider_fee_amount $8 — the application_fee_amount Whop echoes back, which for a
    // direct charge IS Gitpay's 8% commission, not a separate "Whop fee".
    await PaymentRequestMail.transferInitiatedForPaymentRequest(
      body,
      { title: 'Direct charge PR', description: 'desc', currency: 'usd', provider: 'whop' },
      86.63,
      86.63,
      null,
      {
        amount: 100,
        amount_after_fees: 86.63,
        provider_fee_amount: 8,
        destination_account_id: 'biz_submerchant_1'
      }
    )

    expect(capturedHtml).to.include('Platform Fee (8%)')
    expect(capturedHtml).to.include('- $ 8')
    expect(capturedHtml).to.include('Whop Processing Fee')
    expect(capturedHtml).to.include('- $ 5.37')
    expect(capturedHtml).to.not.include('Whop Fee')
    expect(capturedHtml).to.not.include('- $ 0')

    // Row order should match the non-direct-charge email: Whop's own cut listed
    // before the platform fee, even though both are deducted from the same charge.
    const whopRowIndex = capturedHtml.indexOf('Whop Processing Fee')
    const platformRowIndex = capturedHtml.indexOf('Platform Fee (8%)')
    expect(whopRowIndex).to.be.greaterThan(-1)
    expect(platformRowIndex).to.be.greaterThan(-1)
    expect(whopRowIndex).to.be.lessThan(platformRowIndex)
  })
})
