import React from 'react'
import {
  mapPaymentLinks,
  mapPaymentsReceived,
  mapProviderStats,
  mapProviderChecklist
} from './service-provider-dashboard.mappers'

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

describe('mapPaymentLinks', () => {
  it('marks an active link with its paid count', () => {
    const [row] = mapPaymentLinks([
      {
        id: 1,
        title: 'Repository audit, one repo',
        payment_url: 'gitpay.me/alexanmtz/audit',
        custom_amount: false,
        active: true,
        amount: 120,
        PaymentRequestPayments: [{ id: 1 }, { id: 2 }]
      }
    ])

    expect(row.title).toBe('Repository audit, one repo')
    expect(row.meta).toContain('gitpay.me/alexanmtz/audit')
    expect(row.meta).toContain('fixed')
    expect(chipText(row.chip!)).toBe('Active')
    expect(row.chip!.tone).toBe('success')
    expect(row.amount).toBe('120.00')
    expect(messageText(row.when)).toBe('2 paid')
  })

  it('marks a flexible, unpaid, archived link accordingly', () => {
    const [row] = mapPaymentLinks([
      { id: 1, title: 'Sprint retainer', custom_amount: true, active: false, amount: 900 }
    ])

    expect(row.meta).toContain('flexible')
    expect(chipText(row.chip!)).toBe('Archived')
    expect(row.chip!.tone).toBe('neutral')
    expect(row.when).toBe('—')
  })
})

describe('mapPaymentsReceived', () => {
  it('maps a succeeded payment to a Paid/success chip', () => {
    const [row] = mapPaymentsReceived([
      {
        id: 1,
        amount: 24,
        status: 'succeeded',
        source: 'card',
        paymentRequestId: 1301,
        createdAt: '2024-09-12T00:00:00Z',
        PaymentRequest: { title: 'Whop payout provider integration' }
      }
    ])

    expect(row.title).toBe('Whop payout provider integration')
    expect(messageText(row.meta![0])).toBe('PR #1301')
    expect(row.meta).toContain('card')
    expect(chipText(row.chip!)).toBe('Paid')
    expect(row.chip!.tone).toBe('success')
    expect(row.amount).toBe('24.00')
  })

  it('maps failed and refunded statuses to their own chip tones', () => {
    const [failed] = mapPaymentsReceived([{ id: 1, amount: 10, status: 'failed' }])
    const [refunded] = mapPaymentsReceived([{ id: 2, amount: 10, status: 'refunded' }])

    expect(chipText(failed.chip!)).toBe('Failed')
    expect(failed.chip!.tone).toBe('error')
    expect(chipText(refunded.chip!)).toBe('Refunded')
    expect(refunded.chip!.tone).toBe('neutral')
  })
})

describe('mapProviderStats', () => {
  it('derives revenue, recent payments, customers, and links from dashboard data', () => {
    const stats = mapProviderStats({
      claims: { paymentRequests: 61 },
      paymentRequests: {
        total: 3,
        active: 2,
        payments: 4,
        customers: 4,
        convertedPercent: 80,
        recentPayments: { count: 2, amount: 24 }
      }
    })

    expect(stats[0].value).toBe('61.00')
    expect(messageText(stats[0].note)).toBe('across 4 payments')
    expect(stats[1].value).toBe('24.00')
    expect(messageText(stats[1].note)).toBe('2 in the last 30 days')
    expect(stats[2].value).toBe('4')
    expect(messageText(stats[2].note)).toBe('80% of links converted')
    expect(stats[3].value).toBe('3')
    expect(messageText(stats[3].note)).toBe('2 active')
  })

  it('defaults to zeroed values when dashboard data is missing', () => {
    const stats = mapProviderStats(undefined)
    expect(stats[0].value).toBe('0.00')
    expect(stats[2].value).toBe('0')
  })
})

describe('mapProviderChecklist', () => {
  it('checks off each step as its data becomes available', () => {
    const { checklistProgress, checklistItems } = mapProviderChecklist({
      user: { id: 1 },
      account: { data: { active: true } },
      hasCreatedLink: true,
      hasPaidLink: true
    })

    expect(checklistProgress).toEqual({ completed: 4, total: 4 })
    expect(checklistItems.every((item) => item.state === 'checked')).toBe(true)
  })

  it('links pending steps to their handler, but never Account created or First link paid', () => {
    const onCreatePaymentLinkClick = () => {}
    const onConnectPayoutClick = () => {}
    const { checklistItems } = mapProviderChecklist({
      user: { id: 1 },
      account: { data: { active: false } },
      hasCreatedLink: false,
      hasPaidLink: false,
      onCreatePaymentLinkClick,
      onConnectPayoutClick
    })

    expect(checklistItems[0].onClick).toBeUndefined()
    expect(checklistItems[1].onClick).toBe(onCreatePaymentLinkClick)
    expect(checklistItems[2].onClick).toBe(onConnectPayoutClick)
    expect(checklistItems[3].onClick).toBeUndefined()
  })

  it('drops the link once a step is already checked', () => {
    const { checklistItems } = mapProviderChecklist({
      user: { id: 1 },
      account: { data: { active: true } },
      hasCreatedLink: true,
      hasPaidLink: true,
      onCreatePaymentLinkClick: () => {},
      onConnectPayoutClick: () => {}
    })

    expect(checklistItems.every((item) => item.onClick === undefined)).toBe(true)
  })
})
