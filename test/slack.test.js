const expect = require('chai').expect
const nock = require('nock')
const { notifyNewIssue, notifyNewBounty } = require('../src/modules/slack')

describe('Slack Notifications', () => {
  afterEach(() => nock.cleanAll())

  describe('New Issue Notifications', () => {
    it('should send Slack notification when new issue is imported', async () => {
      const slackWebhook = nock('https://hooks.slack.com')
        .post('/services/T08RJTHD0JG/B094MSLS6HM/t6zpqBEQEk8D96YIK0gIRLU4')
        .reply(200, 'ok')

      await notifyNewIssue(
        { id: 1, title: 'Test Issue', description: 'Test description' },
        { username: 'testuser' }
      )

      expect(slackWebhook.isDone()).to.be.true
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

      await notifyNewBounty(
        { id: 1, title: 'Test Task' },
        { amount: 100, currency: 'USD' },
        { username: 'testuser' }
      )

      expect(slackWebhook.isDone()).to.be.true
    })

    it('should handle missing order data gracefully', async () => {
      await notifyNewBounty({ id: 1, title: 'Test' }, null, { username: 'test' })
      await notifyNewBounty({ id: 1, title: 'Test' }, {}, { username: 'test' })
    })
  })
})