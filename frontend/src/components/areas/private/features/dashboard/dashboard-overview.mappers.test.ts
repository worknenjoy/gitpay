import React from 'react'
import {
  mapOverviewStats,
  mapContributorSection,
  mapMaintainerSection,
  mapProviderSection,
  mapFundingSection
} from './dashboard-overview.mappers'

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

describe('mapOverviewStats', () => {
  it('derives all four stats from dashboard data alone', () => {
    const stats = mapOverviewStats({
      claims: { amount: 4354.2 },
      payments: { amount: 29093.2 },
      awaitingPayoutAmount: 64.81,
      wallets: { balance: 0, total: 1 }
    })

    expect(messageText(stats[0].label)).toBe('Money in')
    expect(stats[0].value).toBe('4,354.20')
    expect(messageText(stats[1].label)).toBe('Money out')
    expect(stats[1].value).toBe('29,093.20')
    expect(messageText(stats[2].label)).toBe('Awaiting payout')
    expect(stats[2].value).toBe('64.81')
    expect(messageText(stats[3].label)).toBe('Wallet balance')
    expect(stats[3].value).toBe('0.00')
    expect(messageText(stats[3].note)).toBe('1 wallet created')
  })
})

describe('mapContributorSection', () => {
  it('summarizes earnings and open issue count, reusing mapWorkItems for the list', () => {
    const section = mapContributorSection({
      dashboardData: { claims: { amount: 4293.2 } },
      tasks: [
        { id: 1, status: 'open', value: 1 },
        { id: 2, status: 'closed', value: 1 },
        { id: 3, status: 'open', value: 1 }
      ]
    })

    expect(section.key).toBe('contributor')
    expect(messageText(section.label)).toBe('Contributor')
    expect(messageText(section.sub!)).toBe('$4,293.20 earned · 2 issues open')
    expect(messageText(section.linkText!)).toBe('Open contributor view')
    expect(messageText(section.panelTitle)).toBe('Work items')
    expect(section.items.length).toBe(3)
  })
})

describe('mapMaintainerSection', () => {
  it('summarizes paid amount and org count, reusing mapOpenIssues for the list', () => {
    const section = mapMaintainerSection({
      dashboardData: { payments: { amount: 4293.2 } },
      tasks: [{ id: 1, status: 'open', value: 1 }],
      projects: [{ Organization: { id: 1 } }, { Organization: { id: 2 } }]
    })

    expect(section.key).toBe('maintainer')
    expect(messageText(section.label)).toBe('Maintainer')
    expect(messageText(section.sub!)).toBe('$4,293.20 paid · 2 projects in 2 organizations')
    expect(messageText(section.linkText!)).toBe('Open maintainer view')
    expect(section.items.length).toBe(1)
  })
})

describe('mapProviderSection', () => {
  it('summarizes revenue and payment link counts, reusing mapPaymentLinks for the list', () => {
    const section = mapProviderSection({
      dashboardData: { claims: { paymentRequests: 61 }, paymentRequests: { total: 3, active: 2 } },
      paymentRequests: [{ id: 1, title: 'Repository audit', amount: 120 }]
    })

    expect(section.key).toBe('provider')
    expect(messageText(section.label)).toBe('Service provider')
    expect(messageText(section.sub!)).toBe('$61.00 revenue · 3 payment links, 2 active')
    expect(messageText(section.linkText!)).toBe('Open provider view')
    expect(section.items.length).toBe(1)
  })
})

describe('mapFundingSection', () => {
  it('summarizes funded amount and project count, reusing mapFundingPayments for the list', () => {
    const section = mapFundingSection({
      dashboardData: { payments: { amount: 24800, distinctProjects: 10 } },
      orders: [{ id: 1, status: 'succeeded', amount: 600, provider: 'stripe' }]
    })

    expect(section.key).toBe('funding')
    expect(messageText(section.label)).toBe('Funding')
    expect(messageText(section.sub!)).toBe('$24,800.00 funded across 10 projects')
    expect(messageText(section.linkText!)).toBe('Open funding view')
    expect(section.items.length).toBe(1)
  })
})
