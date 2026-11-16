import { mapAutoWithdrawalProps } from './dashboard-shared.mappers'

describe('mapAutoWithdrawalProps', () => {
  it('reports not connected when there is no payout account', () => {
    const notConnected = { connected: false, enabled: false, frequency: null, nextRunDate: null }
    expect(mapAutoWithdrawalProps({ data: { provider: 'whop', active: false } })).toEqual(
      notConnected
    )
    expect(mapAutoWithdrawalProps(undefined)).toEqual(notConnected)
  })

  it('reads the Whop withdrawal schedule', () => {
    expect(
      mapAutoWithdrawalProps({
        data: {
          id: 'biz_1',
          provider: 'whop',
          payout_schedule: { interval: 'weekly', day: 1, next_payout_date: '2026-11-23' }
        }
      })
    ).toEqual({ connected: true, enabled: true, frequency: 'weekly', nextRunDate: '2026-11-23' })
  })

  it('treats a manual or missing Whop schedule as disabled', () => {
    expect(
      mapAutoWithdrawalProps({
        data: { id: 'biz_1', provider: 'whop', payout_schedule: { interval: 'manual' } }
      })
    ).toEqual({ connected: true, enabled: false, frequency: null, nextRunDate: null })
    expect(
      mapAutoWithdrawalProps({ data: { id: 'biz_1', provider: 'whop', payout_schedule: null } })
    ).toEqual({ connected: true, enabled: false, frequency: null, nextRunDate: null })
  })

  it('reads the Stripe payout schedule', () => {
    expect(
      mapAutoWithdrawalProps({
        data: {
          id: 'acct_1',
          provider: 'stripe',
          settings: { payouts: { schedule: { interval: 'daily', delay_days: 2 } } }
        }
      })
    ).toEqual({ connected: true, enabled: true, frequency: 'daily', nextRunDate: null })
  })
})
