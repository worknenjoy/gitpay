import { expect } from 'chai'
import nock from 'nock'
import { postGitHubPullRequestComment } from '../../src/bot/postGitHubPullRequestComment'

describe('Bot - GitHub pull request comments', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  it("posts the comment as the user, using the user's own access token", async () => {
    let postedBody: any

    const githubScope = nock('https://api.github.com', {
      reqheaders: {
        Authorization: 'token user-access-token',
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'gitpay',
        'X-GitHub-Api-Version': '2022-11-28'
      }
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

    const response = await postGitHubPullRequestComment({
      pullRequestUrl: 'https://github.com/worknenjoy/gitpay/pull/1301',
      commentBody: 'Pay here: https://gitpay.me/pr/1301',
      logContext: 'test',
      githubAccessToken: 'user-access-token'
    })

    expect(githubScope.isDone()).to.equal(true)
    expect(postedBody).to.deep.equal({ body: 'Pay here: https://gitpay.me/pr/1301' })
    expect(response?.html_url).to.equal(
      'https://github.com/worknenjoy/gitpay/pull/1301#issuecomment-1'
    )
  })

  it('skips without making a request when no access token is provided', async () => {
    const githubScope = nock('https://api.github.com')
      .post('/repos/worknenjoy/gitpay/issues/1301/comments')
      .reply(201, {})

    const response = await postGitHubPullRequestComment({
      pullRequestUrl: 'https://github.com/worknenjoy/gitpay/pull/1301',
      commentBody: 'Pay here: https://gitpay.me/pr/1301',
      logContext: 'test',
      githubAccessToken: undefined
    })

    expect(response).to.equal(undefined)
    expect(githubScope.isDone()).to.equal(false)
  })
})
