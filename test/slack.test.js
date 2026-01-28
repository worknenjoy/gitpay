const expect = require('chai').expect
const nock = require('nock')
const { notifyNewIssue, notifyBountyOnSlack } = require('../src/modules/shared/slack')

describe('Slack Notifications', () => {
  beforeEach(() => {
    process.env.SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/TEST/WEBHOOK/URL'
  })

  afterEach(() => {
    nock.cleanAll()
    delete process.env.SLACK_WEBHOOK_URL
  })

  describe('New Issue Notifications', () => {
    it('should send Slack notification when new issue is imported', async () => {
      const slackWebhook = nock('https://hooks.slack.com')
        .post('/services/TEST/WEBHOOK/URL')
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
        .post('/services/TEST/WEBHOOK/URL')
        .reply(200, 'ok')

      await notifyBountyOnSlack(
        { id: 1, title: 'Test Task' },
        { amount: 100, currency: 'USD' },
        { username: 'testuser' }
      )

      expect(slackWebhook.isDone()).to.be.true
    })

    it('should handle missing order data gracefully', async () => {
      await notifyBountyOnSlack({ id: 1, title: 'Test' }, null, { username: 'test' })
      await notifyBountyOnSlack({ id: 1, title: 'Test' }, {}, { username: 'test' })
    })
  })
})
