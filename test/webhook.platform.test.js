// webhook.platform.test.js

const assert = require('assert')
const request = require('supertest')
const expect = require('chai').expect
const api = require('../server')
const agent = request.agent(api)
const nock = require('nock')
const { truncateModels, registerAndLogin, createTransfer } = require('./helpers')
const models = require('../models')

const chargeData = require('./data/stripe/charge')
const createTransferData = require('./data/stripe/stripe.transfer.created')
const updatedTransferData = require('./data/stripe/stripe.transfer.updated')
const payoutData = require('./data/stripe/payout')
const cardData = require('./data/stripe/card')
const balanceData = require('./data/stripe/balance')
const refundData = require('./data/stripe/refund')
const invoiceUpdated = require('./data/stripe/stripe.invoice.update')
const invoiceCreated = require('./data/stripe/stripe.invoice.create')
const invoicePaid = require('./data/stripe/stripe.invoice.paid')
const invoiceWebhookPaid = require('./data/stripe/stripe.webhook.invoice')
const eventCheckout = require('./data/stripe/stripe.webhook.checkout.session.completed')

describe('webhooks for platform', () => {
  beforeEach(async () => {
    await truncateModels(models.Task);
    await truncateModels(models.User);
    await truncateModels(models.Assign);
    await truncateModels(models.Order);
    await truncateModels(models.Transfer);
    await truncateModels(models.PaymentRequest);
    await truncateModels(models.PaymentRequestTransfer);
  })

  afterEach(async () => {
    nock.cleanAll()
  })

  describe('webhooks for charge', () => {
    xit('should return false when the request is not a charge event', async () => {
      const res = await agent
        .post('/webhooks/stripe-platform')
        .send({})
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.statusCode).to.equal(200)
      expect(res.body).to.exist
      expect(res.body).to.equal(false)
    })

    xit('should update the order when a webhook charge.update is triggered', async () => {
      const user = await models.User.create({ email: 'teste@mail.com', password: 'teste' })
      const task = await models.Task.create({
        url: 'https://github.com/worknenjoy/truppie/issues/99',
        provider: 'github',
        userId: user.id
      })
      const order = await task.createOrder({
        source_id: 'card_1CcdmoBrSjgsps2Dw7RRQDwp',
        currency: 'BRL',
        amount: 200,
        source: 'ch_1CcdmsBrSjgsps2DNZiZAyvG',
        userId: user.id
      })
      const res = await agent
        .post('/webhooks/stripe-platform')
        .send(chargeData.update)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.statusCode).to.equal(200)
      expect(res.body).to.exist
      expect(res.body.id).to.equal('evt_1CcecMBrSjgsps2DMFZw5Tyx')
      const o = await models.Order.findByPk(order.id)
      expect(o.source).to.equal('ch_1CcdmsBrSjgsps2DNZiZAyvG')
      expect(o.paid).to.equal(true)
      expect(o.status).to.equal('succeeded')
    })

    xit('should update balance after a refund is triggered', async () => {
      const user = await models.User.create({ email: 'testrefund@mail.com', password: 'teste' })
      const task = await models.Task.create({
        url: 'https://github.com/worknenjoy/truppie/issues/199',
        provider: 'github',
        userId: user.id
      })
      const order = await task.createOrder({
        source_id: 'card_1CcdmoBrSjgsps2Dw7RRQDwp',
        currency: 'BRL',
        amount: 200,
        source: 'card_1FTTdSBrSjgsps2DFfBwigSm',
        userId: user.id
      })
      const res = await agent
        .post('/webhooks/stripe-platform')
        .send(refundData.refund)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.statusCode).to.equal(200)
      expect(res.body).to.exist
      expect(res.body.id).to.equal('ch_1FTTdqBrSjgsps2DQjHwwqr4')
      const o = await models.Order.findByPk(order.id)
      expect(o.source).to.equal('ch_1CcdmsBrSjgsps2DNZiZAyvG')
      expect(o.paid).to.equal(false)
      expect(o.status).to.equal('refunded')
    })

    it('should update the order when a webhook charge.succeeded is triggered', async () => {
      const user = await models.User.create({ email: 'teste@mail.com', password: 'teste' })
      const task = await models.Task.create({
        url: 'https://github.com/worknenjoy/truppie/issues/99',
        provider: 'github',
        userId: user.id
      })
      const order = await task.createOrder({
        source_id: 'card_1CeLZgBrSjgsps2D46GUqEBB',
        currency: 'BRL',
        amount: 200,
        source: 'ch_1CeLZkBrSjgsps2DCNBQmnLA',
        userId: user.id
      })
      const res = await agent
        .post('/webhooks/stripe-platform')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(chargeData.success))
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.statusCode).to.equal(200)
      const event = JSON.parse(Buffer.from(res.body).toString())
      expect(event).to.exist
      expect(event.id).to.equal('evt_1CeLZlBrSjgsps2DYpOlFCuW')
      const o = await models.Order.findByPk(order.id)
      expect(o.source).to.equal('ch_1CeLZkBrSjgsps2DCNBQmnLA')
      expect(o.paid).to.equal(true)
      expect(o.status).to.equal('succeeded')
    })

    it('should create the order when a webhook charge.succeeded is triggered and the order does not exist', async () => {
      const user = await models.User.create({ email: 'teste@mail.com', password: 'teste' })
      await models.Task.create({
        id: 25,
        url: 'https://github.com/worknenjoy/truppie/issues/99',
        provider: 'github',
        userId: user.id
      })
      const res = await agent
        .post('/webhooks/stripe-platform')
        .send(chargeData.success)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.statusCode).to.equal(200)
      const event = JSON.parse(Buffer.from(res.body).toString())
      expect(event).to.exist
      expect(event.id).to.equal('evt_1CeLZlBrSjgsps2DYpOlFCuW')
      const o = await models.Order.findByPk(chargeData.success.data.object.metadata.order_id)
      expect(o.source).to.equal('ch_1CeLZkBrSjgsps2DCNBQmnLA')
      expect(o.paid).to.equal(true)
      expect(o.status).to.equal('succeeded')
    })

    it('should update the order when a webhook charge.failed is triggered', async () => {
      const user = await models.User.create({ email: 'teste@mail.com', password: 'teste' })
      const task = await models.Task.create({
        url: 'https://github.com/worknenjoy/truppie/issues/99',
        provider: 'github',
        userId: user.id
      })
      const order = await task.createOrder({
        source_id: 'card_1D8FH6BrSjgsps2DtehhSR4l',
        currency: 'BRL',
        amount: 200,
        source: 'ch_1D8FHBBrSjgsps2DJawS1hYk',
        userId: user.id
      })
      const res = await agent
        .post('/webhooks/stripe-platform')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(chargeData.failed))
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.statusCode).to.equal(200)
      const event = res.body
      expect(event).to.exist
      expect(event.id).to.equal('evt_1D8FHCBrSjgsps2DKkdcPqfg')
      const o = await models.Order.findByPk(order.id)
      expect(o.source).to.equal('ch_1D8FHBBrSjgsps2DJawS1hYk')
      expect(o.paid).to.equal(false)
      expect(o.status).to.equal('failed')
    })

    xit('should update the order when a webhook invoice.payment_failed is triggered', async () => {
      const user = await models.User.create({ email: 'teste@mail.com', password: 'teste' })
      const task = await models.Task.create({
        url: 'https://github.com/worknenjoy/truppie/issues/99',
        provider: 'github',
        userId: user.id
      })
      const order = await task.createOrder({
        source_id: 'card_1D8FH6BrSjgsps2DtehhSR4l',
        currency: 'BRL',
        amount: 200,
        source: 'ch_3Q9RUEBrSjgsps2D27S1mdjK',
        userId: user.id
      })
      const res = await agent
        .post('/webhooks/stripe-platform')
        .send(invoiceWebhookPaid.payment_failed)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.statusCode).to.equal(200)
      const event = res.body
      expect(event).to.exist
      expect(event.id).to.equal('evt_1Q9RVHBrSjgsps2D9rGhy2En')
      const o = await models.Order.findByPk(order.id)
      expect(o.source).to.equal('ch_3Q9RUEBrSjgsps2D27S1mdjK')
      expect(o.paid).to.equal(false)
      expect(o.status).to.equal('open')
    })

    describe('webhooks for transfer', () => {
      it('should notify the transfer when a webhook customer.source.created is triggered', async () => {
        const user = await models.User.create({
          email: 'teste@gmail.com',
          password: 'teste',
          customer_id: cardData.sourceCreated.data.object.customer
        })
        const res = await agent
          .post('/webhooks/stripe-platform')
          .send(cardData.sourceCreated)
          .expect('Content-Type', /json/)
          .expect(200)
        expect(res.statusCode).to.equal(200)
        const event = res.body
        expect(event).to.exist
        expect(event.id).to.equal(cardData.sourceCreated.id)
      })

      it('should notify about the transfer and update status when a webhook transfer.created is triggered', async () => {
        const user = await models.User.create({ email: 'teste@mail.com', password: 'teste' })
        const task = await models.Task.create({
          url: 'https://github.com/worknenjoy/truppie/issues/99',
          provider: 'github',
          transfer_id: 'tr_test_123',
          paid: true
        })
        const assign = await task.createAssign({ userId: user.id })
        await task.update({ assigned: assign.id }, { where: { id: task.id } })
        const transfer = await createTransfer({ userId: user.id, transfer_method: 'stripe', taskId: task.id, transfer_id: 'tr_test_123', to: assign.userId, status: 'pending' })
        const res = await agent
          .post('/webhooks/stripe-platform')
          .send(createTransferData.created)
          .expect('Content-Type', /json/)
          .expect(200)
        const transferUpdated = await models.Transfer.findOne({ where: { id: transfer.id } })
        expect(res.statusCode).to.equal(200)
        const event = res.body
        expect(event).to.exist
        expect(event.id).to.equal('evt_test_123')
        expect(transferUpdated.status).to.equal('created')
      })

      it('should notify the transfer when a webhook payout.create is triggered and create a new payout', async () => {
        const user = await models.User.create({
          email: 'teste@mail.com',
          password: 'teste',
          account_id: 'acct_1CZ5vkLlCJ9CeQRe'
        })
        const res = await agent
          .post('/webhooks/stripe-platform')
          .send(payoutData.created)
          .expect('Content-Type', /json/)
          .expect(200)
        const payout = await models.Payout.findOne({ where: { source_id: res.body.data.object.id } })
        expect(res.statusCode).to.equal(200)
        const event = res.body
        expect(event).to.exist
        expect(event.id).to.equal('evt_1CdprOLlCJ9CeQRe4QDlbGRY')
        expect(payout.status).to.equal('in_transit')
      })

      it('should not create a new payout when a webhook payout.create triggers again', async () => {
        const user = await models.User.create({
          email: 'teste@mail.com',
          password: 'teste',
          account_id: 'acct_1CZ5vkLlCJ9CeQRe'
        })
        await models.Payout.create({
          source_id: 'po_1CdprNLlCJ9CeQRefEuMMLo6',
          amount: 7311,
          currency: 'brl',
          status: 'in_transit',
          description: 'STRIPE TRANSFER',
          userId: user.id,
          method: 'bank_account',
        })
        const res = await agent
          .post('/webhooks/stripe-platform')
          .send(payoutData.created)
          .expect('Content-Type', /json/)
          .expect(200)
        const event = res.body
        const payouts = await models.Payout.findAll()
        expect(res.statusCode).to.equal(200)
        expect(event).to.exist
        expect(event.id).to.equal('evt_1CdprOLlCJ9CeQRe4QDlbGRY')
        expect(payouts.length).to.equal(1)
        const payout = await models.Payout.findOne({ where: { source_id: res.body.data.object.id } })
        expect(payout.status).to.equal('in_transit')
      })

      it('should notify the transfer when a webhook payout.paid is triggered and update payout status', async () => {
        const user = await models.User.create({
          email: 'teste@mail.com',
          password: 'teste',
          account_id: 'acct_1CZ5vkLlCJ9CeQRe'
        })
        const newPayout = await models.Payout.create({
          source_id: 'po_1CdprNLlCJ9CeQRefEuMMLo6',
          amount: 7311,
          currency: 'brl',
          status: 'in_transit',
          description: 'STRIPE TRANSFER',
          userId: user.id,
          method: 'bank_account',
        })
        const res = await agent
          .post('/webhooks/stripe-platform')
          .send(payoutData.done)
          .expect('Content-Type', /json/)
          .expect(200)
        const event = res.body
        expect(res.statusCode).to.equal(200)
        expect(event).to.exist
        expect(event.id).to.equal('evt_1CeM4PLlCJ9CeQReQrtxB9GJ')
        const payout = await models.Payout.findOne({ where: { id: newPayout.id } })
        expect(payout.status).to.equal('paid')
        expect(payout.paid).to.equal(true)
        expect(payout.amount).to.equal('7311')
      })

      xit('should update the order when a webhook payout.failed is triggered', async () => {
        const user = await models.User.create({
          email: 'teste@mail.com',
          password: 'teste',
          account_id: 'acct_1CdjXFAcSPl6ox0l'
        })
        const res = await agent
          .post('/webhooks/stripe-platform')
          .send(payoutData.failed)
          .expect('Content-Type', /json/)
          .expect(200)
        expect(res.statusCode).to.equal(200)
        const event = res.body
        expect(event).to.exist
        expect(event.id).to.equal('evt_1ChFtEAcSPl6ox0l3VSifPWa')
      })
    })
  })

  describe('webhooks for balance', () => {
    it('should notify the user when he/she gets a new balance', async () => {
      const res = await agent
        .post('/webhooks/stripe-platform')
        .send(balanceData.update)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.statusCode).to.equal(200)
      const event = res.body
      expect(event).to.exist
      expect(event.id).to.equal('evt_1234')
    })
  })

  describe('webhooks for invoice', () => {
    it('should notify the user when the invoice is created', async () => {
      const user = await agent
        .post('/auth/register')
        .send({ email: 'invoice_test@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(200)
      const userId = user.body.id
      const github_url = 'https://github.com/worknenjoy/truppie/issues/76'
      const task = await models.Task.create({ url: github_url, provider: 'github', userId: userId })
      const assign = await task.createAssign({ userId: userId })
      await task.update({ assigned: assign.id })
      const order = await task.createOrder({
        provider: 'stripe',
        type: 'invoice-item',
        source_id: 'in_1Il9COBrSjgsps2DtvLrFalB',
        userId: userId,
        currency: 'usd',
        amount: 200
      })
      const res = await agent
        .post('/webhooks/stripe-platform')
        .send(invoiceCreated.created)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.statusCode).to.equal(200)
      const event = res.body
      expect(event).to.exist
      expect(event.id).to.equal('evt_1CcecMBrSjgsps2DMFZw5Tyx')
      expect(event.data.object.id).to.equal('in_1Il9COBrSjgsps2DtvLrFalB')
      const orderFinal = await models.Order.findOne({
        where: { id: order.id },
        include: [models.Task]
      })
      expect(orderFinal.paid).to.equal(false)
      expect(orderFinal.source_id).to.equal('in_1Il9COBrSjgsps2DtvLrFalB')
      expect(orderFinal.Task.url).to.equal(github_url)
    })
    it('should notify the user when the invoice is updated', async () => {
      const user = await agent
        .post('/auth/register')
        .send({ email: 'invoice_test@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(200)
      const userId = user.body.id
      const github_url = 'https://github.com/worknenjoy/truppie/issues/76'
      const task = await models.Task.create({ url: github_url, provider: 'github', userId: userId })
      const assign = await task.createAssign({ userId: userId })
      await task.update({ assigned: assign.id })
      const order = await task.createOrder({
        provider: 'stripe',
        type: 'invoice-item',
        source_id: 'in_1Il9COBrSjgsps2DtvLrFalB',
        userId: userId,
        currency: 'usd',
        amount: 200
      })
      const res = await agent
        .post('/webhooks/stripe-platform')
        .send(invoiceUpdated.updated)
        .expect('Content-Type', /json/)
        .expect(200)
      const event = res.body
      expect(res.statusCode).to.equal(200)
      expect(event).to.exist
      expect(event.id).to.equal('evt_1CcecMBrSjgsps2DMFZw5Tyx')
      expect(event.data.object.id).to.equal('in_1Il9COBrSjgsps2DtvLrFalB')
      const orderFinal = await models.Order.findOne({
        where: { id: order.id },
        include: [models.Task]
      })
      expect(orderFinal.paid).to.equal(true)
      expect(orderFinal.status).to.equal('succeeded')
      expect(orderFinal.source).to.equal('ch_1IlAjBBrSjgsps2DLjTdMXwJ')
      expect(orderFinal.Task.url).to.equal(github_url)
    })
    xit('should update order and create an user with funding type when the invoice payment is a success', async () => {
      const user = await agent
        .post('/auth/register')
        .send({ email: 'invoice_test@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(200)
      const userId = user.body.id
      const github_url = 'https://github.com/worknenjoy/truppie/issues/76'
      const task = await models.Task.create({ url: github_url, provider: 'github', userId: userId })
      const assign = await task.createAssign({ userId: userId })
      await task.update({ assigned: assign.id })
      const order = await task.createOrder({
        provider: 'stripe',
        type: 'invoice-item',
        userId: userId,
        currency: 'usd',
        amount: 200,
        taskId: task.id,
        customer_id: 'cus_J4zTz8uySTkLlL',
        email: 'test@fitnowbrasil.com.br',
        source_id: 'in_1KknpoBrSjgsps2DMwiQEzJ9'
      })
      const res = await agent
        .post('/webhooks/stripe-platform')
        .send(invoicePaid.paid)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.statusCode).to.equal(200)
      const event = res.body
      expect(event).to.exist
      expect(event.id[0]).to.equal('evt_1KkomkBrSjgsps2DGGBtipW4')
      expect(event.data.object.id[0]).to.equal('in_1KknpoBrSjgsps2DMwiQEzJ9')
      const orderFinal = await models.Order.findOne({
        where: { id: order.id },
        include: [models.Task]
      })
      expect(orderFinal.paid).to.equal(true)
      expect(orderFinal.status).to.equal('paid')
      expect(orderFinal.source).to.equal('ch_3KknvTBrSjgsps2D036v7gVJ')
      expect(orderFinal.Task.url).to.equal(github_url)
      const userFunding = await models.User.findOne({
        where: { active: false, email: "test@fitnowbrasil.com.br" }
      })
      const types = await userFunding.getTypes({ where: { name: "funding" } })
      expect(types).to.not.be.empty
    })
  })

  describe('wehooks for Wallet order', () => {
    it('should update a new wallet order when a webhook invoice.paid is triggered', async () => {
      const user = await registerAndLogin(agent)
      const wallet = await models.Wallet.create({
        name: 'Test Wallet',
        userId: user.body.id,
        balance: 0
      })
      await models.WalletOrder.create({
        amount: 100,
        status: 'open',
        source_id: 'ii_1Q2fh8BrSjgsps2DQqY9k2h3',
        source_type: 'invoice-item',
        source: 'in_1Q2fh8BrSjgsps2DUqQsGLDj',
        walletId: wallet.id
      })
      const res = await agent
        .post('/webhooks/stripe-platform')
        .send(invoiceWebhookPaid.paid)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.statusCode).to.equal(200)
      const event = res.body
      expect(event).to.exist
      expect(event.id).to.equal('evt_1Q2fklBrSjgsps2Dx0mEXsXv')
      expect(event.data.object.id).to.equal('in_1Q2fh8BrSjgsps2DUqQsGLDj')
      const walletOrder = await models.WalletOrder.findOne({
        where: { source: event.data.object.id }
      })
      expect(walletOrder).to.exist
      expect(walletOrder.status).to.equal('paid')
    })
    it('should create a new wallet order when a webhook invoice.create is triggered', async () => {
      const user = await registerAndLogin(agent)
      const wallet = await models.Wallet.create({
        name: 'Test Wallet',
        userId: user.body.id,
        balance: 0
      })
      const invoiceWebhookCreated = invoiceWebhookPaid.created
      invoiceWebhookCreated.data.object.metadata['wallet_id'] = wallet.id
      const res = await agent
        .post('/webhooks/stripe-platform')
        .send(invoiceWebhookCreated)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.statusCode).to.equal(200)
      const event = res.body
      expect(event).to.exist
      expect(event.id).to.equal('evt_1Q8JR1BrSjgsps2DTYquL0UC')
      expect(event.data.object.id).to.equal('in_1Q8JR1BrSjgsps2DmN3iPASq')
      const walletOrder = await models.WalletOrder.findOne({
        where: { source: event.data.object.id }
      })
      expect(walletOrder).to.exist
      expect(walletOrder.status).to.equal('draft')
      expect(walletOrder.amount).to.equal('108.00')
    })
    it('should create a new wallet order when a webhook invoice.updated is triggered', async () => {
      const user = await registerAndLogin(agent)
      const wallet = await models.Wallet.create({
        name: 'Test Wallet',
        userId: user.body.id,
        balance: 0
      })
      const invoiceWebhookUpdated = invoiceWebhookPaid.updated
      invoiceWebhookUpdated.data.object.metadata['wallet_id'] = wallet.id
      const res = await agent
        .post('/webhooks/stripe-platform')
        .send(invoiceWebhookUpdated)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.statusCode).to.equal(200)
      const event = res.body
      expect(event).to.exist
      expect(event.id).to.equal('evt_1Q8JR1BrSjgsps2DTYquL0UC')
      expect(event.data.object.id).to.equal('in_1Q8JR1BrSjgsps2DmN3iPASq')
      const walletOrder = await models.WalletOrder.findOne({
        where: { source: event.data.object.id }
      })
      expect(walletOrder).to.exist
      expect(walletOrder.status).to.equal('draft')
      expect(walletOrder.amount).to.equal('108.00')
    })
    it('should create a new wallet order when a webhook invoice.payment_failed is triggered', async () => {
      const user = await registerAndLogin(agent)
      const wallet = await models.Wallet.create({
        name: 'Test Wallet',
        userId: user.body.id,
        balance: 0
      })
      const invoiceWebhookUpdated = invoiceWebhookPaid.payment_failed
      invoiceWebhookUpdated.data.object.metadata['wallet_id'] = wallet.id
      const res = await agent
        .post('/webhooks/stripe-platform')
        .send(invoiceWebhookUpdated)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.statusCode).to.equal(200)
      const event = res.body
      expect(event).to.exist
      expect(event.id).to.equal('evt_1Q9RVHBrSjgsps2D9rGhy2En')
      expect(event.data.object.id).to.equal('in_1Q9RUDBrSjgsps2DRUgEGbgc')
      const walletOrder = await models.WalletOrder.findOne({
        where: { source: event.data.object.id }
      })
      expect(walletOrder).to.exist
      expect(walletOrder.status).to.equal('open')
      expect(walletOrder.amount).to.equal('21.00')
    })
  })

  describe('webhooks for payment requests', () => {
    it('should make a transfer when a payment request is paid', async () => {
      nock('https://api.stripe.com')
        .post('/v1/transfers')
        .reply(200, {
          id: 'tr_1KkomkBrSjgsps2DGGBtipW4',
          amount: 1000,
          currency: 'usd',
          destination: 'acct_1KkomkBrSjgsps2DGGGtipW4',
          status: 'paid',
          transfer_group: 'group_1KkomkBrSjgsps2DGGBtipW4',
          created: 1633036800,
          livemode: false,
          metadata: {
            payment_link_id: 'plink_1KknpoBrSjgsps2DMwiQEzJ9',
            user_id: 'user_1KkomkBrSjgsps2DGGBtipW4'
          }
        }, {
          'Content-Type': 'application/json'
        });

      nock('https://api.stripe.com')
        .post('/v1/payment_links/plink_1RcnYCBrSjgsps2DsAPjr1km')
        .reply(200, {
          active: false,
        })
      const user = await registerAndLogin(agent)
      await models.PaymentRequest.create({
        title: 'Payment for services',
        amount: 1000,
        currency: 'usd',
        description: 'Payment for services',
        payment_link_id: 'plink_1RcnYCBrSjgsps2DsAPjr1km',
        deactivate_after_payment: true,
        userId: user.body.id
      })
      const res = await agent
        .post('/webhooks/stripe-platform')
        .send(eventCheckout.completed.success)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.statusCode).to.equal(200)
      const event = JSON.parse(Buffer.from(res.body).toString())
      expect(event).to.exist
      expect(event.id).to.equal('evt_1Q2fklBrSjgsps2Dx0mEXsXv')
      expect(event.data.object.payment_link).to.equal('plink_1RcnYCBrSjgsps2DsAPjr1km')
      const paymentLink = await models.PaymentRequest.findOne({
        where: { payment_link_id: event.data.object.payment_link }
      })
      expect(paymentLink).to.exist
      expect(paymentLink.status).to.equal('paid')
      expect(paymentLink.amount).to.equal('1000')
      expect(paymentLink.currency).to.equal('usd')
      expect(paymentLink.userId).to.equal(user.body.id)
      expect(paymentLink.description).to.equal('Payment for services')
      expect(paymentLink.title).to.equal('Payment for services')
      expect(paymentLink.transfer_status).to.equal('initiated')
      expect(paymentLink.transfer_id).to.equal('tr_1KkomkBrSjgsps2DGGBtipW4')
      expect(paymentLink.active).to.equal(false)
    })
  })
  describe('webhooks for payment request transfers', () => {
    it('should create the payment request transfer when a payment request transfer is created', async () => {
      const user = await registerAndLogin(agent)
      const paymentRequest = await models.PaymentRequest.create({
        title: 'Payment for services',
        amount: 1000,
        currency: 'usd',
        description: 'Payment for services',
        userId: user.body.id,
        transfer_status: 'pending'
      })
      
      const res = await agent
        .post('/webhooks/stripe-platform')
        .send(createTransferData.createdFromPaymentRequest)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.statusCode).to.equal(200)
      const event = res.body
      expect(event).to.exist
      expect(event.id).to.equal('evt_test_456')
      const transfer = await models.PaymentRequestTransfer.findOne({
        where: { paymentRequestId: paymentRequest.id },
        include: [models.PaymentRequest]
      })
      expect(transfer).to.exist
      expect(transfer.id).to.equal(1)
      expect(transfer.transfer_id).to.equal('tr_test_456')
      expect(transfer.value).to.equal('10')
      expect(transfer.status).to.equal('created')
      expect(transfer.PaymentRequest.id).to.equal(paymentRequest.id)
      expect(transfer.PaymentRequest.title).to.equal('Payment for services')
      expect(transfer.PaymentRequest.amount).to.equal('1000')
      expect(transfer.PaymentRequest.currency).to.equal('usd')
      expect(transfer.PaymentRequest.description).to.equal('Payment for services')
    })
  })
})
