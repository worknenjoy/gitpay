import { expect } from 'chai'
import nock from 'nock'
import request from 'supertest'
import api from '../../../src/server'
import { registerAndLogin, truncateModels } from '../../helpers'
import Models from '../../../src/models'
const secrets = require('../../../src/config/secrets')
const getSingleIssue = require('../../data/github/github.issue.get')
const getSingleRepo = require('../../data/github/github.repository.get')

const agent = request.agent(api) as any
const models = Models as any

const setupGitHubMocks = (issueNumber: number) => {
  nock('https://api.github.com')
    .persist()
    .get(`/repos/worknenjoy/gitpay/issues/${issueNumber}`)
    .query({ client_id: secrets.github.id, client_secret: secrets.github.secret })
    .reply(200, getSingleIssue.issue)

  nock('https://api.github.com')
    .persist()
    .get('/repos/worknenjoy/gitpay')
    .query({ client_id: secrets.github.id, client_secret: secrets.github.secret })
    .reply(200, getSingleRepo.repo)

  nock('https://api.github.com')
    .persist()
    .get('/repos/worknenjoy/gitpay/languages')
    .query({ client_id: secrets.github.id, client_secret: secrets.github.secret })
    .reply(200, { JavaScript: 100000, HTML: 50000 })

  // Mock GitHub user API call (used when checking for company_owner role)
  nock('https://api.github.com')
    .persist()
    .get('/users/worknenjoy')
    .query({ client_id: secrets.github.id, client_secret: secrets.github.secret })
    .reply(200, { login: 'worknenjoy', email: null })
}

describe('Task Creation and Slack Notifications', () => {
  beforeEach(async () => {
    await truncateModels(models.Task)
    await truncateModels(models.User)
    await truncateModels(models.Project)
  })

  afterEach(() => {
    nock.cleanAll()
    delete process.env.SLACK_WEBHOOK_URL
  })

  it('should not call Slack methods when task is created with not_listed set to true', async () => {
    // Setup GitHub API mocks
    setupGitHubMocks(999)

    // Mock Slack webhook (following slack.test.js pattern)
    process.env.SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/TEST/WEBHOOK/URL'
    const slackWebhook = nock('https://hooks.slack.com')
      .post('/services/TEST/WEBHOOK/URL')
      .reply(200, 'ok')

    const user = await registerAndLogin(agent)
    const { headers } = user || {}

    await agent
      .post('/tasks/create')
      .send({
        url: 'https://github.com/worknenjoy/gitpay/issues/999',
        provider: 'github',
        not_listed: true
      })
      .set('Authorization', headers?.authorization)
      .expect('Content-Type', /json/)
      .expect(200)

    // Assert that Slack webhook was not called
    expect(slackWebhook.isDone()).to.equal(false)
  })

  it('should not call Slack methods when task is created with private set to true', async () => {
    // Setup GitHub API mocks
    setupGitHubMocks(998)

    // Mock Slack webhook (following slack.test.js pattern)
    process.env.SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/TEST/WEBHOOK/URL'
    const slackWebhook = nock('https://hooks.slack.com')
      .post('/services/TEST/WEBHOOK/URL')
      .reply(200, 'ok')

    const user = await registerAndLogin(agent)
    const { headers } = user || {}

    await agent
      .post('/tasks/create')
      .send({
        url: 'https://github.com/worknenjoy/gitpay/issues/998',
        provider: 'github',
        private: true
      })
      .set('Authorization', headers?.authorization)
      .expect('Content-Type', /json/)
      .expect(200)

    // Assert that Slack webhook was not called
    expect(slackWebhook.isDone()).to.equal(false)
  })

  it('should call Slack methods when task is created as public', async () => {
    // Setup GitHub API mocks
    setupGitHubMocks(997)

    // Mock Slack webhook (following slack.test.js pattern)
    process.env.SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/TEST/WEBHOOK/URL'
    const slackWebhook = nock('https://hooks.slack.com')
      .post('/services/TEST/WEBHOOK/URL')
      .reply(200, 'ok')

    const user = await registerAndLogin(agent)
    const { headers, body: currentUser } = user || {}

    await agent
      .post('/tasks/create')
      .send({
        url: 'https://github.com/worknenjoy/gitpay/issues/997',
        provider: 'github'
      })
      .set('Authorization', headers?.authorization)
      .expect('Content-Type', /json/)
      .expect(200)

    // Assert that Slack webhook was called
    expect(slackWebhook.isDone()).to.equal(true)
  })
})
