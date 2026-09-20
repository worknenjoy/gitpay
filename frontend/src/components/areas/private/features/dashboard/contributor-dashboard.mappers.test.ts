import React from 'react'
import {
  mapWorkItems,
  mapSolutions,
  mapPayoutRows,
  mapStats,
  mapClaimsSections,
  mapPayoutsSummarySections,
  mapChecklist
} from './contributor-dashboard.mappers'

// Mapper output embeds <FormattedMessage /> elements (not plain strings) so the
// dashboard's copy is translatable. Resolve one back to its English text using
// its own defaultMessage + values, without needing a full IntlProvider render.
const messageText = (node: React.ReactNode): string => {
  const element = node as React.ReactElement<{
    defaultMessage: string
    values?: Record<string, any>
  }>
  const { defaultMessage, values } = element.props
  if (!values) return defaultMessage
  return Object.keys(values).reduce(
    (message, key) => message.replace(`{${key}}`, String(values[key])),
    defaultMessage
  )
}

const chipText = (chip: { label: React.ReactNode }) =>
  typeof chip.label === 'string' ? chip.label : messageText(chip.label)

describe('mapWorkItems', () => {
  it('maps an open task assigned to the user into a row', () => {
    const [row] = mapWorkItems([
      {
        id: 1,
        title: 'Fix bug',
        url: 'https://github.com/worknenjoy/gitpay/issues/1284',
        status: 'open',
        value: 180,
        assigned: 5,
        Assigns: [{ id: 5, createdAt: '2024-01-01T00:00:00Z' }],
        Project: { repo: 'worknenjoy/gitpay' }
      }
    ])

    expect(row.title).toBe('Fix bug')
    expect(row.meta).toContain('worknenjoy/gitpay')
    expect(row.meta).toContain('#1284')
    expect(messageText(row.meta![2])).toMatch(/^assigned /)
    expect(chipText(row.chip!)).toBe('Open')
    expect(row.chip!.tone).toBe('success')
    expect(row.amount).toBe('180.00')
  })

  it('marks a closed task as Closed/error', () => {
    const [row] = mapWorkItems([{ id: 1, title: 'Fix bug', status: 'closed', value: 120 }])
    expect(chipText(row.chip!)).toBe('Closed')
    expect(row.chip!.tone).toBe('error')
  })

  it('returns an empty array for no tasks', () => {
    expect(mapWorkItems([])).toEqual([])
    expect(mapWorkItems()).toEqual([])
  })
})

describe('mapSolutions', () => {
  it('marks a merged solution as Merged/success with a Paid order', () => {
    const [row] = mapSolutions([
      {
        id: 1,
        isPRMerged: true,
        isIssueClosed: true,
        createdAt: '2024-01-01T00:00:00Z',
        Task: {
          title: 'Fix bug',
          url: 'https://github.com/worknenjoy/gitpay/issues/1271',
          value: 120,
          Project: { repo: 'worknenjoy/gitpay' },
          Orders: [{ status: 'succeeded', amount: 12000 }]
        }
      }
    ])

    expect(chipText(row.chip!)).toBe('Merged')
    expect(row.chip!.tone).toBe('success')
    expect(messageText(row.when)).toBe('Paid')
    expect(row.amount).toBe('120.00')
  })

  it('marks a solution with a pending order as In transit', () => {
    const [row] = mapSolutions([
      {
        id: 1,
        isPRMerged: true,
        isIssueClosed: true,
        createdAt: '2024-01-01T00:00:00Z',
        Task: { title: 'Fix bug', value: 64.81, Orders: [{ status: 'pending' }] }
      }
    ])
    expect(messageText(row.when)).toBe('In transit')
  })

  it('marks an unmerged, still-open solution as Open/info with no when', () => {
    const [row] = mapSolutions([
      { id: 1, isPRMerged: false, isIssueClosed: false, Task: { title: 'Fix bug', value: 10 } }
    ])
    expect(chipText(row.chip!)).toBe('Open')
    expect(row.chip!.tone).toBe('info')
    expect(row.when).toBeUndefined()
  })
})

describe('mapPayoutRows', () => {
  it('converts the payout amount from cents to decimal and maps status to a chip', () => {
    const [row] = mapPayoutRows([
      {
        id: 2291,
        currency: 'usd',
        amount: 21500,
        status: 'paid',
        createdAt: '2024-09-06T00:00:00Z'
      }
    ])

    expect(chipText(row.chip!)).toBe('Paid')
    expect(row.chip!.tone).toBe('success')
    expect(row.currency).toBe('$')
    expect(row.amount).toBe('215.00')
    expect(row.meta).toContain('PO-2291')
  })

  it('maps in_transit status to a warning chip', () => {
    const [row] = mapPayoutRows([{ id: 1, currency: 'usd', amount: 100, status: 'in_transit' }])
    expect(chipText(row.chip!)).toBe('In transit')
    expect(row.chip!.tone).toBe('warning')
  })
})

describe('mapStats', () => {
  it('derives issues-merged and total-earned figures from dashboard data and solutions', () => {
    const stats = mapStats(
      {
        claims: { amount: 64.81 },
        paymentRequests: { active: 1, total: 3 },
        awaitingPayoutAmount: 64.81
      },
      [{ isPRMerged: true }, { isPRMerged: true }, { isPRMerged: false }]
    )

    expect(stats[0].value).toBe('64.81')
    expect(messageText(stats[0].label)).toBe('Total earned')
    expect(messageText(stats[0].note)).toBe('for issues solved')
    expect(stats[1].value).toBe('2')
    expect(messageText(stats[1].note)).toBe('ready to payout')
    expect(stats[2].value).toBe('3')
    expect(messageText(stats[2].note)).toBe('1 Active')
    expect(stats[3].value).toBe('64.81')
    expect(messageText(stats[3].note)).toBe('automatic payouts enabled')
  })

  it('defaults to zeroed values when dashboard data is missing', () => {
    const stats = mapStats(undefined, [])
    expect(stats[0].value).toBe('0.00')
    expect(stats[1].value).toBe('0')
  })
})

describe('mapClaimsSections', () => {
  it('sums bounties and payment requests into a Total row', () => {
    const [section] = mapClaimsSections({
      claims: { bounties: 32.42, paymentRequests: 5, amount: 37.42 }
    })
    const total = section.items[2]
    expect(messageText(total.label)).toBe('Total')
    expect(total.value).toBe('$37.42')
    expect(total.variant).toBe('emphasis')
  })
})

describe('mapPayoutsSummarySections', () => {
  it('sums paid and in-transit amounts into a Total row for the first currency', () => {
    const sections = mapPayoutsSummarySections({
      payouts: { usd: { paidAmount: 51.94, inTransitAmount: 9.06 } }
    })
    const items = sections?.[0].items ?? []
    expect(items.map((item) => messageText(item.label))).toEqual([
      'Paid out',
      'In transit',
      'Total'
    ])
    expect(items.map((item) => item.value)).toEqual(['$51.94', '$9.06', '$61.00'])
    expect(items[2].variant).toBe('emphasis')
  })

  it('returns undefined when there are no payouts yet', () => {
    expect(mapPayoutsSummarySections({ payouts: {} })).toBeUndefined()
    expect(
      mapPayoutsSummarySections({ payouts: { usd: { paidAmount: 0, inTransitAmount: 0 } } })
    ).toBeUndefined()
  })
})

describe('mapChecklist', () => {
  it('checks off each step as its data becomes available', () => {
    const { checklistProgress, checklistItems } = mapChecklist({
      user: { id: 1, provider: 'github' },
      account: { data: { active: true } },
      hasClaimedIssue: true
    })

    expect(checklistProgress).toEqual({ completed: 4, total: 4 })
    expect(checklistItems.every((item) => item.state === 'checked')).toBe(true)
  })

  it('leaves later steps empty until their requirement is met', () => {
    const { checklistProgress, checklistItems } = mapChecklist({
      user: { id: 1, provider: 'google' },
      account: { data: { active: false } },
      hasClaimedIssue: false
    })

    expect(checklistProgress).toEqual({ completed: 1, total: 4 })
    expect(checklistItems[0].state).toBe('checked')
    expect(checklistItems[1].state).toBe('empty')
    expect(checklistItems[2].state).toBe('empty')
    expect(checklistItems[3].state).toBe('empty')
  })

  it('links pending steps to the handler that completes them, but never Account created', () => {
    const onConnectGithubClick = () => {}
    const onClaimIssueClick = () => {}
    const onConnectPayoutClick = () => {}
    const { checklistItems } = mapChecklist({
      user: { id: 1, provider: 'google' },
      account: { data: { active: false } },
      hasClaimedIssue: false,
      onConnectGithubClick,
      onClaimIssueClick,
      onConnectPayoutClick
    })

    expect(checklistItems[0].onClick).toBeUndefined()
    expect(checklistItems[1].onClick).toBe(onConnectGithubClick)
    expect(checklistItems[2].onClick).toBe(onClaimIssueClick)
    expect(checklistItems[3].onClick).toBe(onConnectPayoutClick)
  })

  it('drops the link once a step is already checked', () => {
    const { checklistItems } = mapChecklist({
      user: { id: 1, provider: 'github' },
      account: { data: { active: true } },
      hasClaimedIssue: true,
      onConnectGithubClick: () => {},
      onClaimIssueClick: () => {},
      onConnectPayoutClick: () => {}
    })

    expect(checklistItems.every((item) => item.onClick === undefined)).toBe(true)
  })
})
