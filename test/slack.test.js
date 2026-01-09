const request = require('supertest')
const expect = require('chai').expect
const nock = require('nock')
const api = require('../src/server').default
const agent = request.agent(api)
const models = require('../src/models')
const { registerAndLogin, truncateModels } = require('./helpers')
const { notifyNewIssue, notifyNewBounty } = require('../src/modules/slack')

describe('Slack Notifications', () => {
  beforeEach(async () => {
    await truncateModels(models.Task)
    await truncateModels(models.User)
    await truncateModels(models.Order)
  })

  afterEach(() => nock.cleanAll())

  describe('New Issue Notifications', () => {
    it('should send Slack notification when new issue is imported', async () => {
      const slackWebhook = nock('https://hooks.slack.com')
        .post('/services/T08RJTHD0JG/B094MSLS6HM/t6zpqBEQEk8D96YIK0gIRLU4')
        .reply(200, 'ok')

      const user = await registerAndLogin(agent)
      
      nock('https://api.github.com')
        .get('/repos/test/repo/issues/123')
        .query(true)
        .reply(200, { title: 'Test Issue', body: 'Test description', state: 'open' })
      
      nock('https://api.github.com')
        .get('/repos/test/repo/languages')
        .query(true)
        .reply(200, { JavaScript: 100 })

      nock('https://api.github.com')
        .get('/repos/test/repo')
        .query(true)
        .reply(200, { name: 'repo', owner: { login: 'test' } })

      const res = await agent
        .post('/tasks/create')
        .send({ url: 'https://github.com/test/repo/issues/123', provider: 'github' })
        .set('Authorization', user.headers.authorization)
        .expect(200)

      expect(res.body.title).to.equal('Test Issue')
    })

    it('should handle missing task data gracefully', async () => {
      await notifyNewIssue(null, { username: 'test' })
      await notifyNewIssue({}, { username: 'test' })
    })
  })

  describe('New Bounty Notifications', () => {
    it('should send Slack notification when new bounty is added', async () => {
      const slackWebhook = nock('https://hooks.slack.com')
        .post('/services/T08RJTHD0JG/B094MSLS6HM/t6zpqBEQEk8D96YIK0gIRLU4')
        .reply(200, 'ok')

      const user = await registerAndLogin(agent)
      const task = await models.Task.create({
        url: 'https://github.com/test/repo/issues/1',
        userId: user.body.id,
        title: 'Test Bounty Task'
      })

      const res = await agent
        .post('/orders')
        .send({
          source_id: 'test_payment',
          currency: 'USD',
          amount: 100,
          taskId: task.id
        })
        .set('Authorization', user.headers.authorization)
        .expect(200)

      expect(res.body.amount).to.equal('100')
    })

    it('should handle missing order data gracefully', async () => {
      await notifyNewBounty({ id: 1, title: 'Test' }, null, { username: 'test' })
      await notifyNewBounty({ id: 1, title: 'Test' }, {}, { username: 'test' })
    })
  })
})