import { expect } from 'chai'
import sinon from 'sinon'
import nock from 'nock'
import '../../../src/server'
import Models from '../../../src/models'
import { truncateModels } from '../../helpers'
import { UserFactory } from '../../factories'
import StatsMail from '../../../src/mail/stats'
import { sendgrid } from '../../../src/config/secrets'
// @ts-ignore - @sendgrid/mail types may not be properly exported
import sgMail from '@sendgrid/mail'
import { syncStats, syncStatsHandler } from '../../../src/inngest/functions/syncStats'

const models = Models as any

// Fake Inngest `step`: runs each step inline and records the step ids.
const makeStep = () => {
  const ran: string[] = []
  return {
    ran,
    step: {
      run: async (id: string, fn: () => Promise<any>) => {
        ran.push(id)
        return fn()
      }
    }
  }
}

describe('Inngest sync-stats function', () => {
  beforeEach(async () => {
    await truncateModels(models.PlatformPublicStats)
    await truncateModels(models.User)
    nock('https://slack.com').get('/api/conversations.list').reply(200, { ok: false }).persist()
  })

  afterEach(() => {
    nock.cleanAll()
    sinon.restore()
  })

  it('registers with id sync-stats and both cron and event triggers', () => {
    const config = (syncStats as any).getConfig({
      baseUrl: new URL('http://localhost/api/inngest'),
      appPrefix: 'gitpay'
    })
    // JSON round-trip drops undefined keys (e.g. `expression`) the SDK adds
    const triggers = JSON.parse(JSON.stringify(config[0].triggers))
    expect(config[0].id).to.equal('gitpay-sync-stats')
    expect(triggers).to.deep.include({ cron: 'TZ=UTC 0 0 * * *' })
    expect(triggers).to.deep.include({ event: 'stats/sync.requested' })
  })

  it('persists stats and skips the mail step on the first run', async () => {
    const mail = sinon.stub(StatsMail, 'newUsers').resolves()
    await UserFactory({ email: 'first@example.com' })

    const { step, ran } = makeStep()
    const logger = { info: sinon.spy() }
    const result = await syncStatsHandler({ step, logger })

    expect(ran).to.deep.equal(['sync-info'])
    expect(logger.info.calledWithMatch(/No new users since last sync/)).to.equal(true)
    expect(result.users_count).to.equal(1)
    expect(await models.PlatformPublicStats.count()).to.equal(1)
    expect(mail.called).to.equal(false)
  })

  it('runs the mail step when there are new users since the last sync', async () => {
    const mail = sinon.stub(StatsMail, 'newUsers').resolves()
    await UserFactory({ email: 'first@example.com' })
    await syncStatsHandler({ ...makeStep(), logger: { info: () => {} } })

    await UserFactory({ email: 'second@example.com' })
    const { step, ran } = makeStep()
    const result = await syncStatsHandler({ step, logger: { info: () => {} } })

    expect(ran).to.deep.equal(['sync-info', 'mail-new-users'])
    expect(result.new_users_count).to.equal(1)
    expect(mail.calledOnceWithExactly(1, 2)).to.equal(true)
  })

  it('fails the mail step (so Inngest retries it) when the email cannot be sent', async () => {
    sinon.stub(StatsMail, 'newUsers').rejects(new Error('SendGrid down'))
    await UserFactory({ email: 'first@example.com' })
    await syncStatsHandler({ ...makeStep(), logger: { info: () => {} } })

    await UserFactory({ email: 'second@example.com' })
    const { step, ran } = makeStep()
    let thrown: any
    try {
      await syncStatsHandler({ step, logger: { info: () => {} } })
    } catch (error) {
      thrown = error
    }

    expect(ran).to.deep.equal(['sync-info', 'mail-new-users'])
    expect(thrown?.message).to.equal('SendGrid down')
  })
})

describe('StatsMail.newUsers', () => {
  afterEach(() => sinon.restore())

  it('throws when SendGrid returns an error instead of swallowing it', async () => {
    const sendgridError = new Error('Unauthorized')
    sinon.stub(sendgrid, 'apiKey').get(() => 'SG.test')
    sinon.stub(sgMail, 'send').rejects(sendgridError)

    let thrown: any
    try {
      await StatsMail.newUsers(1, 2)
    } catch (error) {
      thrown = error
    }
    expect(thrown).to.equal(sendgridError)
  })
})
