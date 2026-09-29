import { expect } from 'chai'
import request from 'supertest'
import nock from 'nock'
import api from '../../../src/server'
import { registerAndLogin, truncateModels } from '../../helpers'
import Models from '../../../src/models'
import { PaymentRequestFactory } from '../../factories'

const agent = request.agent(api)
const models = Models as any

const samplePullRequest = {
  html_url: 'https://github.com/worknenjoy/gitpay/pull/1301',
  title: 'Add Whop payout provider to the payout settings screen',
  state: 'closed',
  merged: true,
  user: { login: 'alexanmtz' }
}

const sampleUnmergedPullRequest = {
  html_url: 'https://github.com/worknenjoy/gitpay/pull/1302',
  title: 'Fix currency rounding on payout summary',
  state: 'open',
  merged: false,
  user: { login: 'alexanmtz' }
}

describe('GET /pull-requests', () => {
  beforeEach(async () => {
    await truncateModels(models.User)
    await truncateModels(models.PaymentRequest)
  })
  afterEach(async () => {
    nock.cleanAll()
  })

  it('resolves a pull request the user authored', async () => {
    nock('https://api.github.com')
      .get('/repos/worknenjoy/gitpay/pulls/1301')
      .query(true)
      .reply(200, samplePullRequest)

    const user = await registerAndLogin(agent)
    await models.User.update({ provider: 'github', provider_username: 'alexanmtz' }, {
      where: { id: user.body.id }
    })

    const res = await agent
      .get('/pull-requests')
      .query({ url: 'https://github.com/worknenjoy/gitpay/pull/1301' })
      .set('authorization', user.headers.authorization)
      .expect(200)

    expect(res.body.repo).to.equal('worknenjoy/gitpay')
    expect(res.body.number).to.equal(1301)
    expect(res.body.title).to.equal(samplePullRequest.title)
    expect(res.body.state).to.equal('merged')
  })

  it('rejects when the pull request has not been merged', async () => {
    nock('https://api.github.com')
      .get('/repos/worknenjoy/gitpay/pulls/1302')
      .query(true)
      .reply(200, sampleUnmergedPullRequest)

    const user = await registerAndLogin(agent)
    await models.User.update({ provider: 'github', provider_username: 'alexanmtz' }, {
      where: { id: user.body.id }
    })

    const res = await agent
      .get('/pull-requests')
      .query({ url: 'https://github.com/worknenjoy/gitpay/pull/1302' })
      .set('authorization', user.headers.authorization)
      .expect(400)

    expect(res.body.error).to.equal('PULL_REQUEST_NOT_MERGED')
  })

  it('returns 404 when the pull request does not exist', async () => {
    nock('https://api.github.com')
      .get('/repos/worknenjoy/gitpay/pulls/999999')
      .query(true)
      .reply(404, { message: 'Not Found' })

    const user = await registerAndLogin(agent)
    await models.User.update({ provider: 'github', provider_username: 'alexanmtz' }, {
      where: { id: user.body.id }
    })

    await agent
      .get('/pull-requests')
      .query({ url: 'https://github.com/worknenjoy/gitpay/pull/999999' })
      .set('authorization', user.headers.authorization)
      .expect(404)
  })

  it('rejects when the user has not linked GitHub', async () => {
    nock('https://api.github.com')
      .get('/repos/worknenjoy/gitpay/pulls/1301')
      .query(true)
      .reply(200, samplePullRequest)

    const user = await registerAndLogin(agent)

    const res = await agent
      .get('/pull-requests')
      .query({ url: 'https://github.com/worknenjoy/gitpay/pull/1301' })
      .set('authorization', user.headers.authorization)
      .expect(400)

    expect(res.body.error).to.equal('GITHUB_ACCOUNT_NOT_LINKED')
  })

  it('rejects when the pull request was not authored by the user', async () => {
    nock('https://api.github.com')
      .get('/repos/worknenjoy/gitpay/pulls/1301')
      .query(true)
      .reply(200, samplePullRequest)

    const user = await registerAndLogin(agent)
    await models.User.update({ provider: 'github', provider_username: 'someone-else' }, {
      where: { id: user.body.id }
    })

    const res = await agent
      .get('/pull-requests')
      .query({ url: 'https://github.com/worknenjoy/gitpay/pull/1301' })
      .set('authorization', user.headers.authorization)
      .expect(400)

    expect(res.body.error).to.equal('PULL_REQUEST_NOT_AUTHORED_BY_USER')
  })

  it('matches the author case-insensitively', async () => {
    nock('https://api.github.com')
      .get('/repos/worknenjoy/gitpay/pulls/1301')
      .query(true)
      .reply(200, samplePullRequest)

    const user = await registerAndLogin(agent)
    await models.User.update({ provider: 'github', provider_username: 'AlexanMTZ' }, {
      where: { id: user.body.id }
    })

    const res = await agent
      .get('/pull-requests')
      .query({ url: 'https://github.com/worknenjoy/gitpay/pull/1301' })
      .set('authorization', user.headers.authorization)
      .expect(200)

    expect(res.body.repo).to.equal('worknenjoy/gitpay')
  })
})

describe('GET /pull-requests/mine', () => {
  beforeEach(async () => {
    await truncateModels(models.User)
  })
  afterEach(async () => {
    nock.cleanAll()
  })

  it("lists the user's pull requests", async () => {
    nock('https://api.github.com')
      .get('/search/issues')
      .query(true)
      .reply(200, {
        items: [
          {
            number: 1301,
            title: samplePullRequest.title,
            repository_url: 'https://api.github.com/repos/worknenjoy/gitpay',
            state: 'open',
            created_at: '2026-09-20T10:00:00Z'
          }
        ]
      })

    const user = await registerAndLogin(agent)
    await models.User.update({ provider: 'github', provider_username: 'alexanmtz' }, {
      where: { id: user.body.id }
    })

    const res = await agent
      .get('/pull-requests/mine')
      .set('authorization', user.headers.authorization)
      .expect(200)

    expect(res.body).to.have.lengthOf(1)
    expect(res.body[0].repo).to.equal('worknenjoy/gitpay')
    expect(res.body[0].number).to.equal(1301)
    expect(res.body[0].state).to.equal('open')
  })

  it('rejects when the user has not linked GitHub', async () => {
    const user = await registerAndLogin(agent)

    const res = await agent
      .get('/pull-requests/mine')
      .set('authorization', user.headers.authorization)
      .expect(400)

    expect(res.body.error).to.equal('GITHUB_ACCOUNT_NOT_LINKED')
  })
})

describe('POST /pull-requests/:paymentRequestId/comment', () => {
  beforeEach(async () => {
    await truncateModels(models.User)
    await truncateModels(models.PaymentRequest)
    await truncateModels(models.PaymentLinkType)
  })
  afterEach(async () => {
    nock.cleanAll()
  })

  it('returns 404 for a payment request that does not belong to the user', async () => {
    const pullRequestType = await models.PaymentLinkType.create({
      name: 'pull_request',
      label: 'Pull Request'
    })
    const owner = await registerAndLogin(agent)
    const paymentRequest = await PaymentRequestFactory({
      userId: owner.body.id,
      typeId: pullRequestType.id,
      url: 'https://github.com/worknenjoy/gitpay/pull/1301'
    })
    const otherUser = await registerAndLogin(agent)

    await agent
      .post(`/pull-requests/${paymentRequest.id}/comment`)
      .set('authorization', otherUser.headers.authorization)
      .send({ commentBody: 'Pay here: https://gitpay.me/pr/1301' })
      .expect(404)
  })

  it('returns 422 for a payment request that is not a pull-request link', async () => {
    const defaultType = await models.PaymentLinkType.create({ name: 'default', label: 'Default' })
    const user = await registerAndLogin(agent)
    const paymentRequest = await PaymentRequestFactory({
      userId: user.body.id,
      typeId: defaultType.id
    })

    const res = await agent
      .post(`/pull-requests/${paymentRequest.id}/comment`)
      .set('authorization', user.headers.authorization)
      .send({ commentBody: 'Pay here: https://gitpay.me/pr/1301' })
      .expect(422)

    expect(res.body.error).to.equal('PAYMENT_REQUEST_NOT_A_PULL_REQUEST')
  })

  it('requires the user to have granted GitHub write access', async () => {
    const pullRequestType = await models.PaymentLinkType.create({
      name: 'pull_request',
      label: 'Pull Request'
    })
    const user = await registerAndLogin(agent)
    await models.User.update(
      { provider: 'github', provider_username: 'alexanmtz' },
      { where: { id: user.body.id } }
    )
    const paymentRequest = await PaymentRequestFactory({
      userId: user.body.id,
      typeId: pullRequestType.id,
      url: 'https://github.com/worknenjoy/gitpay/pull/1301'
    })

    const res = await agent
      .post(`/pull-requests/${paymentRequest.id}/comment`)
      .set('authorization', user.headers.authorization)
      .send({ commentBody: 'Pay here: https://gitpay.me/pr/1301' })
      .expect(422)

    expect(res.body.error).to.equal('GITHUB_WRITE_ACCESS_REQUIRED')
  })

  it("posts the comment as the user once they've granted GitHub write access", async () => {
    const pullRequestType = await models.PaymentLinkType.create({
      name: 'pull_request',
      label: 'Pull Request'
    })
    const user = await registerAndLogin(agent)
    await models.User.update(
      { provider: 'github', provider_username: 'alexanmtz', github_access_token: 'user-token-123' },
      { where: { id: user.body.id } }
    )
    const paymentRequest = await PaymentRequestFactory({
      userId: user.body.id,
      typeId: pullRequestType.id,
      url: 'https://github.com/worknenjoy/gitpay/pull/1301'
    })

    let postedBody: any
    const githubScope = nock('https://api.github.com', {
      reqheaders: { Authorization: 'token user-token-123' }
    })
      .post('/repos/worknenjoy/gitpay/issues/1301/comments', (body) => {
        postedBody = body
        return true
      })
      .reply(201, {
        id: 1,
        html_url: 'https://github.com/worknenjoy/gitpay/pull/1301#issuecomment-1',
        body: 'ok'
      })

    const res = await agent
      .post(`/pull-requests/${paymentRequest.id}/comment`)
      .set('authorization', user.headers.authorization)
      .send({ commentBody: 'Pay here: https://gitpay.me/pr/1301' })
      .expect(200)

    expect(githubScope.isDone()).to.equal(true)
    expect(postedBody).to.deep.equal({ body: 'Pay here: https://gitpay.me/pr/1301' })
    expect(res.body.html_url).to.equal(
      'https://github.com/worknenjoy/gitpay/pull/1301#issuecomment-1'
    )
  })
})
