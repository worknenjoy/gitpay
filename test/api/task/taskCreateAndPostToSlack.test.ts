import { expect } from 'chai'
import nock from 'nock'
import request from 'supertest'
import api from '../../../src/server'
import { registerAndLogin, truncateModels } from '../../helpers'
import Models from '../../../src/models'
// Use require to avoid TS type dependency on @types/sinon
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sinon = require('sinon')
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
    sinon.restore()
  })

  it('should not call Slack methods when task is created with not_listed set to true', async () => {
    // Clear require cache to ensure fresh module load with stub
    delete require.cache[require.resolve('../../../src/modules/slack')]
    delete require.cache[require.resolve('../../../src/modules/slack/index')]
    delete require.cache[require.resolve('../../../src/modules/tasks/taskBuilds')]
    delete require.cache[require.resolve('../../../src/modules/tasks')]
    delete require.cache[require.resolve('../../../src/app/controllers/task')]

    // Setup GitHub API mocks
    setupGitHubMocks(999)

    // Stub the Slack notification method
    const SlackModule = require('../../../src/modules/slack')
    const slackStub = sinon.stub(SlackModule, 'notifyNewIssue').resolves(true)

    const user = await registerAndLogin(agent)
    const { headers } = user || {}

    try {
      await agent
        .post('/tasks/create')
        .send({
          url: 'https://github.com/worknenjoy/gitpay/issues/999',
          provider: 'github',
          not_listed: true
        })
        .set('Authorization', headers.authorization)
        .expect('Content-Type', /json/)
        .expect(200)

      // Assert that notifyNewIssue was not called
      expect(slackStub.called).to.equal(false)
    } finally {
      slackStub.restore()
      // Restore cache
      delete require.cache[require.resolve('../../../src/modules/slack')]
      delete require.cache[require.resolve('../../../src/modules/slack/index')]
      delete require.cache[require.resolve('../../../src/modules/tasks/taskBuilds')]
      delete require.cache[require.resolve('../../../src/modules/tasks')]
      delete require.cache[require.resolve('../../../src/app/controllers/task')]
    }
  })

  it('should not call Slack methods when task is created with private set to true', async () => {
    // Clear require cache to ensure fresh module load with stub
    delete require.cache[require.resolve('../../../src/modules/slack')]
    delete require.cache[require.resolve('../../../src/modules/slack/index')]
    delete require.cache[require.resolve('../../../src/modules/tasks/taskBuilds')]
    delete require.cache[require.resolve('../../../src/modules/tasks')]
    delete require.cache[require.resolve('../../../src/app/controllers/task')]

    // Setup GitHub API mocks
    setupGitHubMocks(998)

    // Stub the Slack notification method
    const SlackModule = require('../../../src/modules/slack')
    const slackStub = sinon.stub(SlackModule, 'notifyNewIssue').resolves(true)

    const user = await registerAndLogin(agent)
    const { headers } = user || {}

    try {
      await agent
        .post('/tasks/create')
        .send({
          url: 'https://github.com/worknenjoy/gitpay/issues/998',
          provider: 'github',
          private: true
        })
        .set('Authorization', headers.authorization)
        .expect('Content-Type', /json/)
        .expect(200)

      // Assert that notifyNewIssue was not called
      expect(slackStub.called).to.equal(false)
    } finally {
      slackStub.restore()
      // Restore cache
      delete require.cache[require.resolve('../../../src/modules/slack')]
      delete require.cache[require.resolve('../../../src/modules/slack/index')]
      delete require.cache[require.resolve('../../../src/modules/tasks/taskBuilds')]
      delete require.cache[require.resolve('../../../src/modules/tasks')]
      delete require.cache[require.resolve('../../../src/app/controllers/task')]
    }
  })

  it('should call Slack methods when task is created as public', async () => {
    // Clear require cache to ensure fresh module load with stub
    delete require.cache[require.resolve('../../../src/modules/slack')]
    delete require.cache[require.resolve('../../../src/modules/slack/index')]
    delete require.cache[require.resolve('../../../src/modules/tasks/taskBuilds')]
    delete require.cache[require.resolve('../../../src/modules/tasks')]
    delete require.cache[require.resolve('../../../src/app/controllers/task')]

    // Setup GitHub API mocks
    setupGitHubMocks(997)

    // Stub the Slack notification method
    const SlackModule = require('../../../src/modules/slack')
    const slackStub = sinon.stub(SlackModule, 'notifyNewIssue').resolves(true)

    const user = await registerAndLogin(agent)
    const { headers, body: currentUser } = user || {}

    try {
      await agent
        .post('/tasks/create')
        .send({
          url: 'https://github.com/worknenjoy/gitpay/issues/997',
          provider: 'github'
        })
        .set('Authorization', headers.authorization)
        .expect('Content-Type', /json/)
        .expect(200)

      // Assert that notifyNewIssue was called
      expect(slackStub.calledOnce).to.equal(true)

      // Verify the call arguments
      const [taskArg, userArg] = slackStub.firstCall.args
      expect(taskArg).to.exist
      expect(taskArg.id).to.exist
      expect(userArg).to.exist
      expect(userArg.id).to.equal(currentUser.id)
    } finally {
      slackStub.restore()
      // Restore cache
      delete require.cache[require.resolve('../../../src/modules/slack')]
      delete require.cache[require.resolve('../../../src/modules/slack/index')]
      delete require.cache[require.resolve('../../../src/modules/tasks/taskBuilds')]
      delete require.cache[require.resolve('../../../src/modules/tasks')]
      delete require.cache[require.resolve('../../../src/app/controllers/task')]
    }
  })
})
