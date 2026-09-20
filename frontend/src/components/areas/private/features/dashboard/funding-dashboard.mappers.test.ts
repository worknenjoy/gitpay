import React from 'react'
import {
  mapFundingPayments,
  mapFundingStats,
  mapFundingChecklist
} from './funding-dashboard.mappers'

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

describe('mapFundingPayments', () => {
  it('marks a succeeded stripe order as Paid, with a "card" method tag', () => {
    const [row] = mapFundingPayments([
      {
        id: 1,
        amount: 600,
        status: 'succeeded',
        provider: 'stripe',
        createdAt: '2024-09-12T00:00:00Z',
        Task: { title: 'Gitpay core development, monthly', Project: { repo: 'worknenjoy/gitpay' } }
      }
    ])

    expect(row.title).toBe('Gitpay core development, monthly')
    expect(row.meta).toContain('card')
    expect(row.meta).toContain('worknenjoy/gitpay')
    expect(chipText(row.chip!)).toBe('Paid')
    expect(row.chip!.tone).toBe('success')
    expect(row.amount).toBe('600.00')
  })

  it('marks an open order as Pending, with a wallet method tag', () => {
    const [row] = mapFundingPayments([{ id: 1, amount: 240, status: 'open', provider: 'wallet' }])
    expect(row.meta).toContain('wallet')
    expect(chipText(row.chip!)).toBe('Pending')
    expect(row.chip!.tone).toBe('warning')
  })
})

describe('mapFundingStats', () => {
  it('derives all four stats from dashboard data', () => {
    const stats = mapFundingStats({
      payments: { amount: 24800, total: 42, succeeded: 40, distinctProjects: 10 },
      wallets: { balance: 0, total: 1 }
    })

    expect(stats[0].value).toBe('24,800.00')
    expect(messageText(stats[0].note)).toBe('across 10 projects')
    expect(stats[1].value).toBe('40')
    expect(messageText(stats[1].note)).toBe('$24,800.00 processed')
    expect(stats[2].value).toBe('10')
    expect(messageText(stats[2].note)).toBe('42 payments')
    expect(stats[3].value).toBe('0.00')
  })

  it('defaults to zeroed values when dashboard data is missing', () => {
    const stats = mapFundingStats(undefined)
    expect(stats[0].value).toBe('0.00')
    expect(stats[2].value).toBe('0')
  })
})

describe('mapFundingChecklist', () => {
  it('checks off each step as its data becomes available', () => {
    const { checklistProgress, checklistItems } = mapFundingChecklist({
      user: { id: 1 },
      dashboardData: { payments: { total: 5 }, wallets: { balance: 100 } }
    })

    expect(checklistProgress).toEqual({ completed: 3, total: 3 })
    expect(checklistItems.every((item) => item.state === 'checked')).toBe(true)
  })

  it('leaves later steps empty until their requirement is met', () => {
    const { checklistProgress, checklistItems } = mapFundingChecklist({
      user: { id: 1 },
      dashboardData: { payments: { total: 0 }, wallets: { balance: 0 } }
    })

    expect(checklistProgress).toEqual({ completed: 1, total: 3 })
    expect(checklistItems[0].state).toBe('checked')
    expect(checklistItems[1].state).toBe('empty')
    expect(checklistItems[2].state).toBe('empty')
  })
})
