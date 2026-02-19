import { expect } from 'chai'
import nock from 'nock'
import Models from '../../../../src/models'
import { truncateModels } from '../../../helpers'
import { TaskFactory, UserFactory } from '../../../factories'
import { findOldIssuesWithoutMergedPrs } from '../../../../src/queries/issue/pull-request/findOldIssuesWithoutMergedPrs'

const models = Models as any

describe('Queries - Issue - Pull Request - findOldIssuesWithoutMergedPrs', () => {
  beforeEach(async () => {
    nock.cleanAll()

    await truncateModels(models.Task)
    await truncateModels(models.User)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('returns only issues older than 1y with no merged PRs', async () => {
    const now = new Date('2026-02-19T00:00:00.000Z')
    const oldDate = new Date(now.getTime() - 400 * 24 * 60 * 60 * 1000)

    const user = await UserFactory()

    const oldIssueNoPr = await TaskFactory({
      userId: user.id,
      createdAt: oldDate,
      updatedAt: oldDate,
      url: 'https://github.com/worknenjoy/gitpay/issues/1'
    })

    const oldIssueWithMergedPr = await TaskFactory({
      userId: user.id,
      createdAt: oldDate,
      updatedAt: oldDate,
      url: 'https://github.com/worknenjoy/gitpay/issues/2'
    })

    // This one should not trigger any GitHub call
    await TaskFactory({
      userId: user.id,
      createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      url: 'https://github.com/worknenjoy/gitpay/issues/3'
    })

    nock('https://api.github.com')
      .get('/repos/worknenjoy/gitpay/issues/1/timeline')
      .query(true)
      .reply(200, [])

    nock('https://api.github.com')
      .get('/repos/worknenjoy/gitpay/issues/2/timeline')
      .query(true)
      .reply(200, [
        {
          event: 'connected',
          source: {
            issue: {
              pull_request: {
                merged_at: '2020-01-01T00:00:00.000Z'
              }
            }
          }
        }
      ])

    const results = await findOldIssuesWithoutMergedPrs({ now, olderThanDays: 365 })

    expect(results).to.have.lengthOf(1)
    expect(results[0].id).to.equal(oldIssueNoPr.id)

    expect(nock.isDone()).to.equal(true)
    expect(results.find((i: any) => i.id === oldIssueWithMergedPr.id)).to.equal(undefined)
  })
})
