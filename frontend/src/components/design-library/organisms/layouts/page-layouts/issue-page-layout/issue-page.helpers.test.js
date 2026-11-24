import {
  getBountySummary,
  getBreakdownTotals,
  getPaymentTiming,
  getPaymentMethod,
  getIssueVisibility,
  getDeadlineInfo,
  getGithubInfo,
  getImporter,
  isImporterAuthor,
  getSolutionChecklist,
  canSubmitSolution,
  getAddBountyFooter,
  hasBountyAvailable,
  isBountyLocked,
  getSolutionsFromTaskSolution
} from './issue-page.helpers'

const order = (overrides = {}) => ({
  id: 1,
  amount: '100',
  paid: true,
  status: 'succeeded',
  provider: 'stripe',
  source_type: 'card',
  createdAt: '2026-11-10T00:00:00.000Z',
  User: { id: 7, name: 'worknenjoy' },
  ...overrides
})

describe('issue page helpers', () => {
  describe('getPaymentMethod', () => {
    it('maps providers and source types', () => {
      expect(getPaymentMethod({ provider: 'paypal' })).toBe('paypal')
      expect(getPaymentMethod({ provider: 'wallet' })).toBe('wallet')
      expect(getPaymentMethod({ provider: 'stripe', source_type: 'invoice-item' })).toBe('invoice')
      expect(getPaymentMethod({ provider: 'stripe', source_type: 'card' })).toBe('card')
      expect(getPaymentMethod({})).toBe('card')
    })
  })

  describe('getBountySummary', () => {
    it('returns an empty bounty when there are no orders and no value', () => {
      expect(getBountySummary({ value: 0 })).toEqual({ total: 0, sponsors: [], payments: [] })
      expect(getBountySummary(undefined)).toEqual({ total: 0, sponsors: [], payments: [] })
    })

    it('lists paid orders, dedupes sponsors and keeps anonymous payers', () => {
      const summary = getBountySummary({
        value: '350',
        orders: [
          order({ id: 1, amount: '200' }),
          order({ id: 2, amount: '100', User: { id: 8, name: 'defnax' } }),
          order({ id: 3, amount: '50', User: null }),
          order({ id: 4, amount: '10', User: { id: 7, name: 'worknenjoy' } }),
          order({ id: 5, amount: '999', paid: false, status: 'failed' })
        ]
      })
      expect(summary.total).toBe(360)
      expect(summary.payments.map((p) => p.id)).toEqual([1, 2, 3, 4])
      expect(summary.sponsors.map((s) => s.name)).toEqual(['worknenjoy', 'defnax', 'Anonymous'])
      expect(summary.payments[2].sponsor.anonymous).toBe(true)
    })

    it('keeps open invoices as pending without adding them to the total', () => {
      const summary = getBountySummary({
        value: 0,
        orders: [order({ id: 9, paid: false, status: 'open', source_type: 'invoice-item' })]
      })
      expect(summary.payments[0]).toMatchObject({ state: 'pending', method: 'invoice' })
      expect(summary.total).toBe(0)
    })
  })

  describe('getBreakdownTotals / getPaymentTiming', () => {
    const payments = [
      { id: 1, amount: 200, state: 'paid', method: 'card', sponsor: { name: 'a' } },
      { id: 2, amount: 100, state: 'pledged', method: 'card', sponsor: { name: 'b' } },
      { id: 3, amount: 50, state: 'pending', method: 'invoice', sponsor: { name: 'c' } }
    ]

    it('sums each state', () => {
      expect(getBreakdownTotals(payments)).toEqual({
        paid: 200,
        pledged: 100,
        pending: 50,
        total: 300,
        count: 3
      })
    })

    it('derives the timing from the payment states', () => {
      expect(getPaymentTiming(payments)).toBe('flex')
      expect(getPaymentTiming([payments[1]])).toBe('later')
      expect(getPaymentTiming([payments[0]])).toBe('advance')
      expect(getPaymentTiming([])).toBe('advance')
    })
  })

  describe('getIssueVisibility', () => {
    it('reads not_listed', () => {
      expect(getIssueVisibility({ not_listed: true })).toBe('unlisted')
      expect(getIssueVisibility({ not_listed: false })).toBe('public')
    })
  })

  describe('getDeadlineInfo', () => {
    const now = new Date('2026-11-23T10:00:00.000Z')
    it('returns undefined without a deadline', () => {
      expect(getDeadlineInfo(null, now)).toBeUndefined()
      expect(getDeadlineInfo('not a date', now)).toBeUndefined()
    })
    it('counts whole days left', () => {
      expect(getDeadlineInfo('2026-12-15T00:00:00.000Z', now)).toMatchObject({
        daysLeft: 22,
        overdue: false
      })
      expect(getDeadlineInfo('2026-11-23T23:00:00.000Z', now)).toMatchObject({ daysLeft: 0 })
      expect(getDeadlineInfo('2026-11-20T00:00:00.000Z', now)).toMatchObject({
        daysLeft: -3,
        overdue: true
      })
    })
  })

  describe('getGithubInfo', () => {
    it('is undefined for non github issues or without metadata', () => {
      expect(getGithubInfo({ provider: 'bitbucket', metadata: { issue: {} } })).toBeUndefined()
      expect(getGithubInfo({ provider: 'github' })).toBeUndefined()
    })
    it('maps the github issue payload', () => {
      const info = getGithubInfo({
        provider: 'github',
        private: false,
        url: 'https://github.com/a/b/issues/1',
        metadata: {
          issue: {
            state: 'open',
            comments: 14,
            updated_at: '2026-11-20T00:00:00Z',
            html_url: 'https://github.com/a/b/issues/1',
            user: { id: 1, login: 'defnax', avatar_url: 'x', html_url: 'y' },
            assignees: [{ id: 2, login: 'alexanmtz' }, null]
          }
        }
      })
      expect(info).toMatchObject({
        status: 'open',
        repoPrivate: false,
        comments: 14,
        author: { name: 'defnax' },
        assignees: [{ name: 'alexanmtz' }]
      })
    })
  })

  describe('importer', () => {
    const task = {
      User: { id: 3, name: 'RetroShare', provider_username: 'RetroShare' },
      metadata: { issue: { user: { login: 'retroshare' } } }
    }
    it('maps the importer', () => {
      expect(getImporter(task)).toMatchObject({ id: 3, name: 'RetroShare' })
      expect(getImporter({})).toBeUndefined()
    })
    it('compares the importer with the github author', () => {
      expect(isImporterAuthor(task)).toBe(true)
      expect(
        isImporterAuthor({ ...task, metadata: { issue: { user: { login: 'defnax' } } } })
      ).toBe(false)
      expect(isImporterAuthor({ User: { name: 'x' } })).toBeUndefined()
    })
  })

  describe('bounty availability', () => {
    it('detects an available and a locked bounty', () => {
      expect(hasBountyAvailable({ value: '100' })).toBe(true)
      expect(hasBountyAvailable({ value: '0' })).toBe(false)
      expect(hasBountyAvailable({ value: '100', paid: true })).toBe(false)
      expect(isBountyLocked({ transfer_id: 'tr_1' })).toBe(true)
      expect(isBountyLocked({})).toBe(false)
    })
  })

  describe('solution checklist', () => {
    const ready = {
      isConnectedToGitHub: true,
      isAuthorOfPR: true,
      isPRMerged: true,
      isIssueClosed: true,
      hasIssueReference: true
    }

    it('fails every PR rule before a URL is checked and warns without a bounty', () => {
      expect(getSolutionChecklist({ pullRequestData: {}, bountyAvailable: false })).toEqual([
        { id: 'bounty', state: 'warning' },
        { id: 'connected', state: 'failed' },
        { id: 'author', state: 'failed' },
        { id: 'merged', state: 'failed' },
        { id: 'issueClosed', state: 'failed' },
        { id: 'referenced', state: 'failed' }
      ])
    })

    it('warns when the author PR is not merged yet', () => {
      const items = getSolutionChecklist({
        pullRequestData: { ...ready, isPRMerged: false },
        bountyAvailable: true
      })
      expect(items.find((i) => i.id === 'merged')?.state).toBe('warning')
    })

    it('checks everything for a ready solution and allows submitting', () => {
      const items = getSolutionChecklist({ pullRequestData: ready, bountyAvailable: true })
      expect(items.every((i) => i.state === 'checked')).toBe(true)
      expect(
        canSubmitSolution({
          pullRequestURL: 'https://github.com/a/b/pull/1',
          pullRequestData: ready,
          taskData: { value: '100' }
        })
      ).toBe(true)
      expect(
        canSubmitSolution({
          pullRequestURL: 'https://github.com/a/b/pull/1',
          pullRequestData: ready,
          taskData: { value: '100', paid: true }
        })
      ).toBe(false)
    })
  })

  describe('getAddBountyFooter', () => {
    it('picks the footer for each method and timing', () => {
      expect(getAddBountyFooter({ method: 'card' })).toBe('card')
      expect(getAddBountyFooter({ method: 'card', later: true })).toBe('pledge')
      expect(getAddBountyFooter({ method: 'invoice' })).toBe('invoice')
      expect(getAddBountyFooter({ method: 'wallet', amount: 100, walletBalance: 420 })).toBe(
        'wallet'
      )
      expect(getAddBountyFooter({ method: 'wallet', amount: 100, walletBalance: 35 })).toBe(
        'walletShort'
      )
    })
  })

  describe('getSolutionsFromTaskSolution', () => {
    it('is empty without a solution', () => {
      expect(getSolutionsFromTaskSolution({}, {})).toEqual([])
      expect(getSolutionsFromTaskSolution(null, {})).toEqual([])
    })
    it('maps the current user solution', () => {
      const [row] = getSolutionsFromTaskSolution(
        {
          id: 5,
          pullRequestURL: 'https://github.com/RetroShare/RetroShare/pull/3102',
          isPRMerged: true,
          createdAt: '2026-11-21'
        },
        { data: { name: 'alexanmtz' } }
      )
      expect(row).toEqual({
        id: 5,
        author: { name: 'alexanmtz' },
        pullRequest: {
          number: 3102,
          title: 'RetroShare/RetroShare/pull/3102',
          url: 'https://github.com/RetroShare/RetroShare/pull/3102',
          state: 'merged'
        },
        sentAt: '2026-11-21',
        payout: 'ready'
      })
    })
  })
})
