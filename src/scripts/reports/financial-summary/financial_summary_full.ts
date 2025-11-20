// financial-summary-methods.js

import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_KEY as string)

import { Op } from 'sequelize'
import Models from '../../../models'

const models = Models as any
const { Wallet, Order, Task } = models

async function fetchAllStripeData(listFn: any, label: string, params = {}) {
  let hasMore = true
  let startingAfter: any = null
  let results: any = []
  let page = 0

  console.log(`[Stripe] Fetching ${label}...`)
  console.time(`[Stripe] ${label} fetch time`)

  while (hasMore) {
    page++
    console.log(
      `[Stripe] ${label}: requesting page ${page}${startingAfter ? ` (starting_after=${startingAfter})` : ''}`
    )
    const response: any = await listFn({
      limit: 100,
      ...params,
      ...(startingAfter && { starting_after: startingAfter })
    })

    results = results.concat(response.data)
    console.log(
      `[Stripe] ${label}: received ${response.data.length} items, total=${results.length}, has_more=${response.has_more}`
    )
    hasMore = response.has_more
    startingAfter = response.data.length ? response.data[response.data.length - 1].id : null
  }

  console.timeEnd(`[Stripe] ${label} fetch time`)
  console.log(`[Stripe] ${label}: done. total=${results.length}`)
  return results
}

async function getStripeData() {
  console.log('[Step] Fetching Stripe data...')
  console.time('[Step] Stripe data total time')

  const payments = await fetchAllStripeData((params: any) => stripe.charges.list(params), 'charges')
  const transfers = await fetchAllStripeData(
    (params: any) => stripe.transfers.list(params),
    'transfers'
  )
  const payouts = await fetchAllStripeData((params: any) => stripe.payouts.list(params), 'payouts')
  const invoices = await fetchAllStripeData(
    (params: any) => stripe.invoices.list(params),
    'invoices'
  )

  let totalPayments = 0
  let totalStripeFees = 0
  let totalRefunds = 0

  console.log('[Stripe] Processing charges to aggregate payments, refunds, and fees...')
  console.time('[Stripe] Charges processing time')
  const totalCount = payments.length
  let idx = 0

  for (const p of payments) {
    idx++
    if (!p.refunded) totalPayments += p.amount / 100
    if (p.amount_refunded > 0) totalRefunds += p.amount_refunded / 100
    if (p.balance_transaction) {
      try {
        const txn = await stripe.balanceTransactions.retrieve(p.balance_transaction)
        totalStripeFees += txn.fee / 100
      } catch (err: any) {
        console.warn(
          `[Stripe] Failed to retrieve balance transaction ${p.balance_transaction} for charge ${p.id}: ${err?.message || err}`
        )
      }
    }
    if (idx % 50 === 0 || idx === totalCount) {
      console.log(
        `[Stripe] Processed ${idx}/${totalCount} charges... so far: payments=$${totalPayments.toFixed(2)}, refunds=$${totalRefunds.toFixed(2)}, fees=$${totalStripeFees.toFixed(2)}`
      )
    }
  }
  console.timeEnd('[Stripe] Charges processing time')

  const totalTransfers = transfers.reduce((sum: any, t: any) => sum + t.amount / 100, 0)
  const totalPayouts = payouts.reduce((sum: any, p: any) => sum + p.amount / 100, 0)

  const subscriptionRevenue = invoices.reduce((sum: any, i: any) => {
    if (i.paid && i.subscription && i.subscription.startsWith('sub_')) {
      return sum + i.amount_paid / 100
    }
    return sum
  }, 0)

  console.log(
    `[Stripe] Aggregates -> payments=$${totalPayments.toFixed(2)}, refunds=$${totalRefunds.toFixed(2)}, fees=$${totalStripeFees.toFixed(2)}, transfers=$${totalTransfers.toFixed(2)}, payouts=$${totalPayouts.toFixed(2)}, subscriptions=$${subscriptionRevenue.toFixed(2)}`
  )
  console.timeEnd('[Step] Stripe data total time')

  return {
    totalPayments,
    totalStripeFees,
    totalRefunds,
    totalTransfers,
    totalPayouts,
    subscriptionRevenue
  }
}

async function getDatabaseData() {
  console.log('[Step] Fetching database data...')
  console.time('[Step] DB data total time')

  console.log('[DB] Summing wallet reserved balance...')
  const walletReserved = (await Wallet.sum('balance')) || 0
  console.log(`[DB] Wallet reserved: $${walletReserved.toFixed(2)}`)

  console.log('[DB] Summing succeeded order totals...')
  const orderTotal = (await Order.sum('amount', { where: { status: 'succeeded' } })) || 0
  console.log(`[DB] Order total (succeeded): $${orderTotal.toFixed(2)}`)

  console.log('[DB] Fetching unpaid tasks list...')
  const unpaidTasksList = await Task.findAll({
    where: {
      value: { [Op.gt]: 0 },
      paid: false
    },
    include: [Order]
  })
  console.log(`[DB] Unpaid tasks count: ${unpaidTasksList.length}`)

  console.log('[DB] Summing unpaid tasks amount...')
  const unpaidTasks =
    (await Task.sum('value', {
      where: {
        value: { [Op.gt]: 0 },
        paid: false
      }
    })) || 0
  console.log(`[DB] Unpaid tasks total: $${unpaidTasks.toFixed(2)}`)

  console.timeEnd('[Step] DB data total time')
  return { walletReserved, orderTotal, unpaidTasks, unpaidTasksList }
}

;(async () => {
  console.log('==> Starting Gitpay Financial Summary...')
  console.time('[Total] Financial summary time')
  try {
    console.log('[Step] 1/3: Stripe data')
    const stripeData = await getStripeData()

    console.log('[Step] 2/3: Database data')
    const dbData = await getDatabaseData()
    const { unpaidTasks, unpaidTasksList, walletReserved, orderTotal } = dbData

    console.log('[Step] 3/3: Calculations (Method 1 and Method 2)...')
    console.time('[Calc] Method 1')
    // === METHOD 1: Original Stripe-Based Method ===
    const platformRevenueFromOrders = orderTotal * 0.08
    const platformRevenueFromTransfers = stripeData.totalTransfers * 0.08
    const platformRevenueWithFees =
      platformRevenueFromOrders + stripeData.totalStripeFees + platformRevenueFromTransfers

    const availableBalanceOriginal =
      stripeData.totalPayments -
      stripeData.totalTransfers -
      stripeData.totalPayouts -
      walletReserved -
      stripeData.totalRefunds
    console.timeEnd('[Calc] Method 1')

    console.time('[Calc] Method 2')
    // === METHOD 2: Fee Model (Task Earnings minus Stripe Fees + 8% from Transfers) ===
    const estimatedStripeFees =
      stripeData.totalTransfers * 0.08 * 0.029 + stripeData.totalTransfers / 100 // estimation: 2.9% + $0.30 per transfer
    const netTaskFeeEarnings = (stripeData.totalTransfers / 0.92) * 0.08 - estimatedStripeFees
    const transferCleanFeeEarnings = (stripeData.totalTransfers / 0.92) * 0.08
    const platformRevenueFullModel =
      netTaskFeeEarnings + transferCleanFeeEarnings + stripeData.subscriptionRevenue

    const availableBalanceAdjusted = platformRevenueFullModel - unpaidTasks - walletReserved
    console.timeEnd('[Calc] Method 2')

    // === Output ===
    console.log('\n====== Gitpay Financial Summary ======\n')

    console.log('--- METHOD 1: Original Stripe-Based Estimate ---')
    console.log('Total Platform Revenue:', platformRevenueWithFees.toFixed(2))
    console.log('Available Balance:', availableBalanceOriginal.toFixed(2))

    console.log('\n--- METHOD 2: Full Model with Transfer Logic ---')
    console.log('Net Task Earnings (8% - Stripe Fees):', netTaskFeeEarnings.toFixed(2))
    console.log('Transfer Earnings (8% clean):', transferCleanFeeEarnings.toFixed(2))
    console.log('Subscription Revenue:', stripeData.subscriptionRevenue.toFixed(2))
    console.log('Total Platform Revenue:', platformRevenueFullModel.toFixed(2))
    console.log('Adjusted Available Balance:', availableBalanceAdjusted.toFixed(2))

    console.log('------ List of Unpaid Tasks ---------')
    unpaidTasksList.forEach((task: any) => {
      console.log(`Task ID: ${task.id}, Title: ${task.title} Value: ${task.value}`)
    })
    console.log('\n========================================\n')
  } catch (error) {
    console.error('Error generating summary:', error)
  } finally {
    console.timeEnd('[Total] Financial summary time')
    console.log('==> Finished Gitpay Financial Summary.')
  }
})()
