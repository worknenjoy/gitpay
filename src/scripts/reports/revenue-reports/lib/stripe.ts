import StripeFactory from '../../../../modules/shared/stripe/stripe'
import { Charge, Transfer } from './types'

export const stripe: any = StripeFactory()

export async function listChargesForRange(startUnix: number, endUnix: number): Promise<Charge[]> {
  const results: Charge[] = []
  let starting_after: string | undefined = undefined
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const page: any = await stripe.charges.list({
      limit: 100,
      starting_after,
      created: { gte: startUnix, lt: endUnix },
      expand: ['data.balance_transaction', 'data.invoice']
    })
    if (page && Array.isArray(page.data)) {
      const filtered = page.data.filter((ch: any) => ch?.status !== 'failed' && ch?.paid !== false)
      results.push(...filtered)
    }
    if (!page?.has_more || page.data.length === 0) break
    starting_after = page.data[page.data.length - 1].id
  }
  return results
}

export async function listTransfersForRange(
  startUnix: number,
  endUnix: number
): Promise<Transfer[]> {
  const results: Transfer[] = []
  let starting_after: string | undefined = undefined
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const page: any = await stripe.transfers.list({
      limit: 100,
      starting_after,
      created: { gte: startUnix, lt: endUnix }
    })
    if (page && Array.isArray(page.data)) results.push(...page.data)
    if (!page?.has_more || page.data.length === 0) break
    starting_after = page.data[page.data.length - 1].id
  }
  return results
}

export async function listPayoutsForRange(startUnix: number, endUnix: number): Promise<any[]> {
  const results: any[] = []
  let starting_after: string | undefined = undefined
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const page: any = await stripe.payouts.list({
      limit: 100,
      starting_after,
      arrival_date: { gte: startUnix, lt: endUnix }
    })
    if (page && Array.isArray(page.data)) results.push(...page.data)
    if (!page?.has_more || page.data.length === 0) break
    starting_after = page.data[page.data.length - 1].id
  }
  return results
}

export async function sumBalanceTransactionFeesForRange(
  startUnix: number,
  endUnix: number
): Promise<number> {
  let totalFee = 0
  let starting_after: string | undefined = undefined
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const page: any = await stripe.balanceTransactions.list({
      limit: 100,
      starting_after,
      created: { gte: startUnix, lt: endUnix }
    })
    if (page && Array.isArray(page.data)) {
      for (const bt of page.data) {
        if (bt?.currency && bt.currency.toLowerCase() === 'usd' && typeof bt.fee === 'number')
          totalFee += bt.fee
      }
    }
    if (!page?.has_more || page.data.length === 0) break
    starting_after = page.data[page.data.length - 1].id
  }
  return totalFee
}
