import React from 'react'
import {
  mapOpenIssues,
  mapClosedIssues,
  mapMaintainerPayments,
  mapMaintainerStats,
  mapMaintainerChecklist
} from './maintainer-dashboard.mappers'

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

const OPEN_TASK = {
  id: 1,
  title: 'Fix bug',
  url: 'https://github.com/worknenjoy/gitpay/issues/1284',
  status: 'open',
  value: 180,
  assigned: 5,
  Assigns: [{ id: 5, User: { username: 'alexanmtz' } }],
  Project: { repo: 'worknenjoy/gitpay' }
}

const CLOSED_TASK = {
  id: 2,
  title: 'Fix wallet rounding',
  url: 'https://github.com/worknenjoy/gitpay/issues/1271',
  status: 'closed',
  value: 120,
  assigned: 6,
  Assigns: [{ id: 6, User: { username: 'lucasmiguel' } }],
  Project: { repo: 'worknenjoy/gitpay' }
}

describe('mapOpenIssues', () => {
  it('only includes open tasks, with the assignee in meta', () => {
    const rows = mapOpenIssues([OPEN_TASK, CLOSED_TASK])
    expect(rows.length).toBe(1)
    expect(rows[0].title).toBe('Fix bug')
    expect(rows[0].meta).toContain('worknenjoy/gitpay')
    expect(rows[0].meta).toContain('#1284')
    expect(messageText(rows[0].meta![2])).toBe('alexanmtz assigned')
    expect(chipText(rows[0].chip!)).toBe('Open')
    expect(rows[0].amount).toBe('180.00')
  })
})

describe('mapClosedIssues', () => {
  it('only includes closed tasks, with the paid contributor in `when`', () => {
    const rows = mapClosedIssues([OPEN_TASK, CLOSED_TASK])
    expect(rows.length).toBe(1)
    expect(rows[0].title).toBe('Fix wallet rounding')
    expect(chipText(rows[0].chip!)).toBe('Closed')
    expect(rows[0].chip!.tone).toBe('neutral')
    expect(rows[0].when).toBe('lucasmiguel')
  })
})

describe('mapMaintainerPayments', () => {
  it('marks an in_transit transfer as Paid, naming the recipient', () => {
    const [row] = mapMaintainerPayments([
      {
        id: 1,
        status: 'in_transit',
        value: 120,
        transfer_method: 'card',
        createdAt: '2024-09-06T00:00:00Z',
        Task: { url: 'https://github.com/worknenjoy/gitpay/issues/1271' },
        destination: { username: 'lucasmiguel' }
      }
    ])

    expect(messageText(row.title)).toBe('Bounty released to lucasmiguel')
    expect(row.meta).toContain('card')
    expect(messageText(row.meta![1])).toBe('issue #1271')
    expect(chipText(row.chip!)).toBe('Paid')
    expect(row.chip!.tone).toBe('success')
    expect(row.amount).toBe('120.00')
  })

  it('marks a pending transfer accordingly', () => {
    const [row] = mapMaintainerPayments([{ id: 1, status: 'pending', value: 50 }])
    expect(chipText(row.chip!)).toBe('Pending')
    expect(row.chip!.tone).toBe('warning')
  })
})

describe('mapMaintainerStats', () => {
  it('derives all four stats from dashboard data and the projects list', () => {
    const stats = mapMaintainerStats(
      {
        payments: { amount: 4293.2, succeeded: 159 },
        wallets: { balance: 0, total: 1 },
        issues: { open: 2, openValue: 350 }
      },
      [{ Organization: { id: 1 } }, { Organization: { id: 1 } }, { Organization: { id: 2 } }]
    )

    expect(stats[0].value).toBe('4,293.20')
    expect(messageText(stats[0].note)).toBe('across 159 payments')
    expect(stats[1].value).toBe('0.00')
    expect(stats[2].value).toBe('2')
    expect(messageText(stats[2].note)).toBe('$350.00 committed')
    expect(stats[3].value).toBe('3')
    expect(messageText(stats[3].note)).toBe('in 2 organizations')
  })
})

describe('mapMaintainerChecklist', () => {
  it('checks off each step as its data becomes available', () => {
    const { checklistProgress, checklistItems } = mapMaintainerChecklist({
      user: { id: 1 },
      dashboardData: { issues: { total: 3 }, payments: { succeeded: 1 } }
    })

    expect(checklistProgress).toEqual({ completed: 3, total: 3 })
    expect(checklistItems.every((item) => item.state === 'checked')).toBe(true)
  })

  it('leaves later steps empty until their requirement is met', () => {
    const { checklistProgress, checklistItems } = mapMaintainerChecklist({
      user: { id: 1 },
      dashboardData: { issues: { total: 0 }, payments: { succeeded: 0 } }
    })

    expect(checklistProgress).toEqual({ completed: 1, total: 3 })
    expect(checklistItems[0].state).toBe('checked')
    expect(checklistItems[1].state).toBe('empty')
    expect(checklistItems[2].state).toBe('empty')
  })
})
