import { expect } from 'chai'
import nock from 'nock'
import { bountyClosedNotPaidComment } from '../../src/bot/bountyClosedNotPaidComment'
import { comment } from '../../src/bot/comment'
import { issueAddedComment } from '../../src/bot/issueAddedComment'

describe('Bot - GitHub issue comments', () => {
  const originalNodeEnv = process.env.NODE_ENV
  const originalFrontendHost = process.env.FRONTEND_HOST
  const originalBotToken = process.env.GITHUB_BOT_ACCESS_TOKEN

  beforeEach(() => {
    nock.cleanAll()
    process.env.NODE_ENV = 'production'
    process.env.FRONTEND_HOST = 'https://gitpay.me'
    process.env.GITHUB_BOT_ACCESS_TOKEN = 'test-bot-token'
  })

  afterEach(() => {
    nock.cleanAll()
    process.env.NODE_ENV = originalNodeEnv
    process.env.FRONTEND_HOST = originalFrontendHost
    process.env.GITHUB_BOT_ACCESS_TOKEN = originalBotToken
  })

  it('posts a concise issue-linked comment', async () => {
    let postedBody: any

    const githubScope = nock('https://api.github.com', {
      reqheaders: {
        Authorization: 'token test-bot-token',
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'gitpaybot',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
      .post('/repos/worknenjoy/gitpay/issues/244/comments', body => {
        postedBody = body
        return true
      })
      .reply(201, {
        id: 1,
        html_url: 'https://github.com/worknenjoy/gitpay/issues/244#issuecomment-1',
        body: 'ok'
      })

    const response = await issueAddedComment({
      dataValues: {
        provider: 'github',
        url: 'https://github.com/worknenjoy/gitpay/issues/244',
        id: 42
      }
    })

    expect(githubScope.isDone()).to.equal(true)
    expect(postedBody).to.deep.equal({
      body: 'GitPay linked this issue to task #42.\n\nView the task: https://gitpay.me/#/task/42'
    })
    expect(response?.html_url).to.equal(
      'https://github.com/worknenjoy/gitpay/issues/244#issuecomment-1'
    )
  })

  it('posts a concise bounty comment', async () => {
    let postedBody: any

    const githubScope = nock('https://api.github.com')
      .post('/repos/worknenjoy/gitpay/issues/244/comments', body => {
        postedBody = body
        return true
      })
      .reply(201, {
        id: 2,
        html_url: 'https://github.com/worknenjoy/gitpay/issues/244#issuecomment-2',
        body: 'ok'
      })

    await comment(
      { amount: '75', currency: 'USD' },
      {
        dataValues: {
          provider: 'github',
          url: 'https://github.com/worknenjoy/gitpay/issues/244',
          id: 43
        }
      }
    )

    expect(githubScope.isDone()).to.equal(true)
    expect(postedBody).to.deep.equal({
      body: 'GitPay recorded a bounty of 75 USD for this issue.\n\nView the task: https://gitpay.me/#/task/43'
    })
  })

  it('mentions the assigned GitHub user and uses the GitHub issue number in the reminder', async () => {
    let postedBody: any

    const githubScope = nock('https://api.github.com')
      .post('/repos/worknenjoy/gitpay/issues/244/comments', body => {
        postedBody = body
        return true
      })
      .reply(201, {
        id: 3,
        html_url: 'https://github.com/worknenjoy/gitpay/issues/244#issuecomment-3',
        body: 'ok'
      })

    await bountyClosedNotPaidComment(
      {
        dataValues: {
          provider: 'github',
          url: 'https://github.com/worknenjoy/gitpay/issues/244',
          id: 99,
          value: '120'
        }
      },
      {
        provider_username: 'octocat'
      }
    )

    expect(githubScope.isDone()).to.equal(true)
    expect(postedBody).to.deep.equal({
      body: '@octocat\n\nGitPay shows this issue as closed with an unpaid bounty of $120.\n\nIf your pull request for issue #244 was merged, claim the bounty here:\nhttps://gitpay.me/#/task/99'
    })
  })
})
