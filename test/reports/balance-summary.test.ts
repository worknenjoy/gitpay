import { expect } from 'chai'
import sinon from 'sinon'

import { getMonthlyBalanceAllYears } from '../../src/scripts/reports/balance-summary/monthlyBalance'
import { getEarningsForAllPeriods } from '../../src/scripts/reports/balance-summary/periodEarnings'

type StripeBalanceTxn = {
  id: string
  created: number // unix seconds
  currency: string
  net: number // cents
}

describe('Balance Summary Reports', () => {
  afterEach(() => {
    sinon.restore()
  })

  describe('Monthly earnings & balance', () => {
    it('task unpaid: Stripe +$100, pending exists, earns only fee', async () => {
      const clock = sinon.useFakeTimers({
        now: new Date('2025-02-15T12:00:00.000Z'),
        shouldAdvanceTime: false
      })

      try {
        const stripeTxns: StripeBalanceTxn[] = [
          {
            id: 'bt_charge_1',
            created: Math.floor(Date.parse('2025-02-10T00:00:00.000Z') / 1000),
            currency: 'usd',
            net: 10000
          }
        ]

        const stripe = {
          balanceTransactions: {
            list: sinon.stub().resolves({ data: stripeTxns as any, has_more: false })
          }
        } as any

        const Task = {
          findAll: sinon.stub().resolves([
            {
              id: 1,
              value: '100',
              paid: false,
              transfer_id: null,
              TransferId: null,
              createdAt: new Date('2025-02-10T00:00:00.000Z'),
              updatedAt: new Date('2025-02-10T00:00:00.000Z')
            }
          ])
        }

        const History = {
          findAll: sinon.stub().resolves([])
        }

        const Order = {
          findAll: sinon.stub().callsFake(async ({ where }: any) => {
            if (where?.provider === 'paypal') return []
            if (where?.provider === 'wallet') return []
            return []
          })
        }

        const WalletOrder = {
          findAll: sinon.stub().resolves([])
        }

        const rows = await getMonthlyBalanceAllYears(
          {
            stripe,
            stripeBalanceNowCents: 10000,
            Task,
            History,
            Order,
            WalletOrder
          },
          { from: new Date('2025-02-01T00:00:00.000Z') }
        )

        const feb = rows.find((r) => r.monthKey === '2025-02')
        expect(feb).to.exist

        // Stripe has $100, and a pending liability exists ($92 with 8% fee model).
        expect(feb!.stripeBalanceEndCents).to.equal(10000)
        expect(feb!.pendingEndStripeOnlyCents).to.equal(9200)
        expect(feb!.realBalanceEndCents).to.equal(800)
        expect(feb!.earnedCents).to.equal(800)

        // Pending created in the month includes this task.
        expect(feb!.pendingCreatedStripeOnlyCents).to.equal(9200)
        expect(feb!.pendingCreatedCount).to.equal(1)
      } finally {
        clock.restore()
      }
    })

    it('task paid within month: no pending at month end', async () => {
      const clock = sinon.useFakeTimers({
        now: new Date('2025-03-15T12:00:00.000Z'),
        shouldAdvanceTime: false
      })

      try {
        const stripeTxns: StripeBalanceTxn[] = [
          {
            id: 'bt_charge_1',
            created: Math.floor(Date.parse('2025-02-05T00:00:00.000Z') / 1000),
            currency: 'usd',
            net: 10000
          },
          {
            id: 'bt_transfer_1',
            created: Math.floor(Date.parse('2025-02-20T00:00:00.000Z') / 1000),
            currency: 'usd',
            net: -9200
          }
        ]

        const stripe = {
          balanceTransactions: {
            list: sinon.stub().resolves({ data: stripeTxns as any, has_more: false })
          }
        } as any

        const Task = {
          findAll: sinon.stub().resolves([
            {
              id: 1,
              value: '100',
              paid: true,
              transfer_id: 'tr_1',
              TransferId: null,
              createdAt: new Date('2025-02-05T00:00:00.000Z'),
              updatedAt: new Date('2025-02-20T00:00:00.000Z')
            }
          ])
        }

        const History = {
          findAll: sinon.stub().resolves([
            {
              TaskId: 1,
              fields: ['paid'],
              newValues: ['true'],
              createdAt: new Date('2025-02-20T00:00:00.000Z')
            }
          ])
        }

        const Order = {
          findAll: sinon.stub().callsFake(async ({ where }: any) => {
            if (where?.provider === 'paypal') return []
            if (where?.provider === 'wallet') return []
            return []
          })
        }

        const WalletOrder = {
          findAll: sinon.stub().resolves([])
        }

        // Stripe balance now is $8.00 after transfer.
        const rows = await getMonthlyBalanceAllYears(
          {
            stripe,
            stripeBalanceNowCents: 800,
            Task,
            History,
            Order,
            WalletOrder
          },
          { from: new Date('2025-02-01T00:00:00.000Z') }
        )

        const feb = rows.find((r) => r.monthKey === '2025-02')
        expect(feb).to.exist

        expect(feb!.stripeBalanceEndCents).to.equal(800)
        expect(feb!.pendingEndStripeOnlyCents).to.equal(0)
        expect(feb!.pendingEndCount).to.equal(0)
        expect(feb!.realBalanceEndCents).to.equal(800)
      } finally {
        clock.restore()
      }
    })
  })

  describe('Period earnings & balance', () => {
    it('last 30 days: earned equals delta of real balance', async () => {
      const now = new Date('2025-02-15T12:00:00.000Z')

      const stripeTxns: StripeBalanceTxn[] = [
        {
          id: 'bt_charge_1',
          created: Math.floor(Date.parse('2025-02-10T00:00:00.000Z') / 1000),
          currency: 'usd',
          net: 10000
        }
      ]

      const stripe = {
        balanceTransactions: {
          list: sinon.stub().resolves({ data: stripeTxns as any, has_more: false })
        }
      } as any

      const Task = {
        findAll: sinon.stub().resolves([
          {
            id: 1,
            value: '100',
            paid: false,
            transfer_id: null,
            TransferId: null,
            createdAt: new Date('2025-02-10T00:00:00.000Z'),
            updatedAt: new Date('2025-02-10T00:00:00.000Z')
          }
        ])
      }

      const History = {
        findAll: sinon.stub().resolves([])
      }

      const Order = {
        findAll: sinon.stub().callsFake(async ({ where }: any) => {
          if (where?.provider === 'paypal') return []
          if (where?.provider === 'wallet') return []
          return []
        })
      }

      const WalletOrder = {
        findAll: sinon.stub().resolves([])
      }

      const rows = await getEarningsForAllPeriods(
        {
          stripe,
          stripeBalanceNowCents: 10000,
          Task,
          History,
          Order,
          WalletOrder
        },
        { now }
      )

      const last30 = rows.find((r) => r.label === 'Last 30 days')
      expect(last30).to.exist

      expect(last30!.stripeBalanceEndCents).to.equal(10000)
      expect(last30!.pendingEndStripeOnlyCents).to.equal(9200)
      expect(last30!.realBalanceEndCents).to.equal(800)
      expect(last30!.earnedCents).to.be.a('number')
    })
  })
})
