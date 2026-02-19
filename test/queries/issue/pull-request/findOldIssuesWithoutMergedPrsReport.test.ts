import { expect } from 'chai'
import nock from 'nock'
import Models from '../../../../src/models'
import { truncateModels } from '../../../helpers'
import { OrderFactory, TaskFactory, UserFactory } from '../../../factories'
import { findOldIssuesWithoutMergedPrsReport } from '../../../../src/queries/issue/pull-request/findOldIssuesWithoutMergedPrsReport'

const models = Models as any

describe('Queries - Issue - Pull Request - findOldIssuesWithoutMergedPrsReport', () => {
  beforeEach(async () => {
    nock.cleanAll()

    await truncateModels(models.Order)
    await truncateModels(models.Task)
    await truncateModels(models.User)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('returns grouped PayPal/Stripe orders and draft PRs', async () => {
    const now = new Date('2026-02-19T00:00:00.000Z')
    const oldDate = new Date(now.getTime() - 370 * 24 * 60 * 60 * 1000)

    const user = await UserFactory()
    const issue = await TaskFactory({
      userId: user.id,
      createdAt: oldDate,
      updatedAt: oldDate,
      url: 'https://github.com/worknenjoy/gitpay/issues/10'
    })

    await OrderFactory({
      TaskId: issue.id,
      userId: user.id,
      provider: 'stripe',
      source_type: 'payment_intent',
      currency: 'USD',
      amount: 123,
      status: 'succeeded',
      paid: true
    })

    await OrderFactory({
      TaskId: issue.id,
      userId: user.id,
      provider: 'paypal',
      source_type: 'capture',
      currency: 'USD',
      amount: 50,
      status: 'succeeded',
      paid: true
    })

    // Non-matching orders should be excluded by the query include filter
    await OrderFactory({
      TaskId: issue.id,
      userId: user.id,
      provider: 'stripe',
      source_type: 'payment_intent',
      currency: 'USD',
      amount: 999,
      status: 'open',
      paid: true
    })

    await OrderFactory({
      TaskId: issue.id,
      userId: user.id,
      provider: 'paypal',
      source_type: 'capture',
      currency: 'USD',
      amount: 999,
      status: 'succeeded',
      paid: false
    })

    nock('https://api.github.com')
      .get('/repos/worknenjoy/gitpay/issues/10/timeline')
      .query(true)
      .reply(200, [
        {
          event: 'connected',
          source: {
            issue: {
              html_url: 'https://github.com/worknenjoy/gitpay/pull/123',
              number: 123,
              title: 'WIP: something',
              draft: true,
              pull_request: {
                merged_at: null
              }
            }
          }
        }
      ])

    const results = await findOldIssuesWithoutMergedPrsReport({ now, olderThanDays: 365 })
    expect(results).to.have.lengthOf(1)

    const entry: any = results[0]
    expect(entry.issue.id).to.equal(issue.id)

    expect(entry.ordersByProvider.stripe).to.have.lengthOf(1)
    expect(entry.ordersByProvider.paypal).to.have.lengthOf(1)

    expect(entry.ordersByProviderAndType.stripe.payment_intent).to.have.lengthOf(1)
    expect(entry.ordersByProviderAndType.paypal.capture).to.have.lengthOf(1)

    expect(entry.pullRequests.draft).to.have.lengthOf(1)
    expect(entry.pullRequests.draft[0].html_url).to.equal(
      'https://github.com/worknenjoy/gitpay/pull/123'
    )

    expect(nock.isDone()).to.equal(true)
  })
})
