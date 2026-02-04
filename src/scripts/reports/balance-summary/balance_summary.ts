import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_KEY as string)

import { Op } from 'sequelize'
import Models from '../../../models'
import moment from 'moment'

import { getMonthlyBalanceAllYears } from './monthlyBalance'
import { printMonthlyBalanceAllYears } from './printMonthlyBalance'
import { getEarningsForAllPeriods } from './periodEarnings'
import { printPeriodEarnings } from './printPeriodEarnings'

const models = Models as any
const { Wallet, Order, Task, Payout } = models

// === Console helpers & formatters ===
const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m'
}
const hr = (w = 70) => `${C.gray}${'─'.repeat(w)}${C.reset}`
const toCents = (n: number) => Math.round((Number(n) || 0) * 100)
const formatUSD = (cents: number) =>
  (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })

async function getCurrentStripeBalance() {
  console.log(`${C.cyan}${C.bold}🔎 [Step] Fetching current Stripe balance...${C.reset}`)
  console.time('[Step] Stripe balance fetch time')

  const balance = await stripe.balance.retrieve()

  const availablePretty = balance.available
    .map((a) => `${formatUSD(a.amount)} ${a.currency.toUpperCase()}`)
    .join(`${C.gray} | ${C.reset}`)

  const pendingPretty = balance.pending
    .map((a) => `${formatUSD(a.amount)} ${a.currency.toUpperCase()}`)
    .join(`${C.gray} | ${C.reset}`)

  console.log(`${C.blue}ℹ️  [Stripe] Pending: ${pendingPretty}${C.reset}`)
  console.log(`${C.blue}ℹ️  [Stripe] Available: ${availablePretty}${C.reset}`)

  const pendingAmount = balance.pending
    .filter((a) => a.currency === 'usd')
    .reduce((sum, a) => sum + a.amount, 0) // already in cents
  const availableAmount = balance.available
    .filter((a) => a.currency === 'usd')
    .reduce((sum, a) => sum + a.amount, 0) // already in cents

  const totalAmount = pendingAmount + availableAmount
  console.log(
    `${C.blue}ℹ️  [Stripe] Total Balance (Available + Pending): ${formatUSD(totalAmount)}${C.reset}`
  )

  console.timeEnd('[Step] Stripe balance fetch time')
  return {
    available: balance.available,
    pending: balance.pending,
    total: totalAmount
  }
}

async function getTotalWalletBalance() {
  console.log(
    `${C.cyan}${C.bold}🧮 [Step] Calculating total Wallet balance from database...${C.reset}`
  )
  console.time('[Step] Wallet balance calculation time')

  const wallets = await Wallet.findAll({
    where: {
      balance: { [Op.gt]: 0 }
    }
  })

  let totalWalletBalance = 0
  for (const w of wallets) {
    totalWalletBalance += Number(w.balance) || 0 // DB values in decimal (USD)
  }

  // Show both DB-decimal view and USD formatted (converted to cents for display)
  console.log(
    `${C.blue}ℹ️  [Database] Total Wallet balance (DB decimal USD): ${totalWalletBalance.toFixed(2)} ` +
      `${C.gray}(${formatUSD(toCents(totalWalletBalance))})${C.reset}`
  )

  console.timeEnd('[Step] Wallet balance calculation time')
  return totalWalletBalance // keep returning decimal
}

async function getTotalAmountForPendingTasks() {
  console.log(
    `${C.cyan}${C.bold}📝 [Step] Calculating total amount for pending Tasks in database...${C.reset}`
  )
  console.time('[Step] Pending Tasks amount calculation time')

  const tasks = await Task.findAll({
    where: {
      value: { [Op.gt]: 0 }
    },
    include: [models.Order]
  })

  const pendingTasks = tasks.filter(
    (t: any) => !t.paid && t.transfer_id === null && t.TransferId === null
  )

  let totalPendingTasksAmount = 0
  console.log('---- List of pending tasks ----')
  for (const t of pendingTasks) {
    console.log(
      `- Task ID: ${t.id}, Paid: ${t.paid ? 'Yes' : 'No'}, Value: ${formatUSD(toCents(t.value))}`,
      `Created ${moment(t.createdAt).format('MMMM Do YYYY, h:mm:ss a')} (${moment(t.createdAt).fromNow()})`,
      `Source: ${t.Orders.map((o: any) => `${o.provider} - ${formatUSD(toCents(o.amount))}`).join(', ') || 'N/A'}`,
      `Transfer ID: ${t.TransferId}`,
      `transfer_id: ${t.transfer_id}`
    )
    totalPendingTasksAmount += Number(t.value) * 0.92 || 0 // 8% platform fee; DB values in decimal (USD)
  }
  console.log('------------------------------')

  let totalPendingPaypalOrdersAmount = 0
  console.log('---- List of pending tasks with PayPal orders ----')
  for (const t of pendingTasks) {
    if (t.Orders.length > 0) {
      t.Orders.forEach((order: any) => {
        if (order.provider === 'paypal' && order.status === 'succeeded') {
          console.log(
            `- Task ID: ${t.id}, Paid: ${t.paid ? 'Yes' : 'No'}, Value: ${formatUSD(toCents(t.value))}`,
            `Created ${moment(t.createdAt).format('MMMM Do YYYY, h:mm:ss a')} (${moment(t.createdAt).fromNow()})`,
            `Order ID: ${order.id}, Provider: ${order.provider}, Amount: ${formatUSD(toCents(order.amount))}`
          )
          totalPendingPaypalOrdersAmount += Number(order.amount) * 0.92 || 0 // 8% platform fee; DB values in decimal (USD)
        }
      })
    }
  }

  console.log('-----------------------------------------------')
  console.log(
    `${C.yellow}⚠️  Note: The total amount for pending Tasks includes $${totalPendingPaypalOrdersAmount.toFixed(2)} ` +
      `from Tasks associated with PayPal Orders.${C.reset}`
  )

  console.log(
    `${C.blue}ℹ️  [Database] Total amount of Tasks (DB decimal USD): ${pendingTasks.length} ` +
      `${C.blue}ℹ️  [Database] Total amount for pending Tasks (DB decimal USD): ${totalPendingTasksAmount.toFixed(2)} ` +
      `${C.gray}(${formatUSD(toCents(totalPendingTasksAmount))})${C.reset}`
  )

  console.timeEnd('[Step] Pending Tasks amount calculation time')
  return {
    totalPendingTasksAmount,
    totalPendingPaypalOrdersAmount
  } // keep returning decimal
}

async function getSummary() {
  const stripeBalance = await getCurrentStripeBalance()
  const paypalBalance = 448.67 // Placeholder for future PayPal integration
  const totalWalletBalance = await getTotalWalletBalance()
  const { totalPendingTasksAmount, totalPendingPaypalOrdersAmount } =
    await getTotalAmountForPendingTasks()
  const totalPendingTasksAmountOnlyStripe = totalPendingTasksAmount - totalPendingPaypalOrdersAmount

  return {
    stripeBalance,
    paypalBalance,
    totalWalletBalance,
    totalPendingTasksAmount,
    totalPendingPaypalOrdersAmount,
    totalPendingTasksAmountOnlyStripe
  }
}

;(async () => {
  console.log(`${C.bold}${C.magenta}🚀 Starting Gitpay Financial Summary (Simple)...${C.reset}`)
  console.time('[Total] Financial summary time')
  try {
    const summary = await getSummary()

    // Convert to cents for consistent math:
    const stripeAvailableCents = summary.stripeBalance.total
    const paypalBalanceCents = toCents(summary.paypalBalance) // DB decimal -> cents
    const walletBalanceCents = toCents(summary.totalWalletBalance) // DB decimal -> cents
    const pendingTasksCents = toCents(summary.totalPendingTasksAmount) // DB decimal -> cents
    const pendingTasksCentsOnlyStripe = toCents(summary.totalPendingTasksAmountOnlyStripe) // DB decimal -> cents
    const pendingPaypalOrdersCents = toCents(summary.totalPendingPaypalOrdersAmount) // DB decimal -> cents

    // Compute final available balance in cents
    const totalAvailableCents =
      stripeAvailableCents + paypalBalanceCents - walletBalanceCents - pendingTasksCents
    const totalAvailableCentsOnlyStripe =
      stripeAvailableCents - walletBalanceCents - pendingTasksCentsOnlyStripe

    // Pretty values
    const stripeAvailableUSD = formatUSD(stripeAvailableCents)
    const paypalBalanceUSD = formatUSD(paypalBalanceCents)
    const walletBalanceUSD = formatUSD(walletBalanceCents)
    const pendingTasksUSD = formatUSD(pendingTasksCents)
    const pendingTasksUSDOnlyStripeUSD = formatUSD(pendingTasksCentsOnlyStripe)
    const pendingPaypalOrdersUSD = formatUSD(pendingPaypalOrdersCents)
    const finalUSD = formatUSD(totalAvailableCents)
    const finalUSDOnlyStripe = formatUSD(totalAvailableCentsOnlyStripe)

    // Fancy output
    console.log(hr())
    console.log(`${C.bold}📊 Financial Summary${C.reset}`)
    console.log(
      `${C.gray}• Stripe Available (cents)${C.reset}: ${stripeAvailableCents} ${C.gray}=>${C.reset} ${stripeAvailableUSD}`
    )
    console.log(
      `${C.gray}• Total Remaining Balance (DB decimal → cents)${C.reset}: ${walletBalanceCents} ${C.gray}=>${C.reset} ${walletBalanceUSD}`
    )
    console.log(
      `${C.gray}• Total Amount for Pending Tasks Total (DB decimal → cents)${C.reset}: ${pendingTasksCents} ${C.gray}=>${C.reset} ${pendingTasksUSD}`
    )
    console.log(
      `${C.gray}• Total Amount for Pending Tasks only Stripe (DB decimal → cents)${C.reset}: ${pendingTasksCentsOnlyStripe} ${C.gray}=>${C.reset} ${pendingTasksUSDOnlyStripeUSD}`
    )
    console.log(hr())

    console.log(
      `${C.cyan}${C.bold}🧠 Total Available Balance Calculation (Paypal + Stripe) ${C.reset}`
    )
    console.log(
      `${C.gray}Formula:${C.reset} Available = (Stripe Available + Paypal Balance) - Wallet Balance - Pending Tasks`
    )
    console.log(
      `= (${stripeAvailableUSD} ${C.gray} + ${C.reset}${paypalBalanceUSD}) ${C.gray}- ${C.reset}${walletBalanceUSD} ${C.gray}- ${C.reset}${pendingTasksUSD}`
    )
    console.log(hr())

    const bannerColor =
      totalAvailableCents > 0 ? C.bgGreen : totalAvailableCents < 0 ? C.bgRed : C.bgYellow
    const bannerTextColor = totalAvailableCents >= 0 ? C.bold : `${C.bold}${C.reset}`
    console.log(hr())
    console.log(
      `${bannerColor}${bannerTextColor}  ✅ FINAL AVAILABLE BALANCE: ${finalUSD}  ${C.reset}`
    )
    console.log(hr())

    console.log(`${C.cyan}${C.bold}🧠 Total Available Balance Calculation (Stripe only)${C.reset}`)
    console.log(
      `${C.gray}Formula:${C.reset} Available = Stripe Available - Wallet Balance - (Pending Tasks - PayPal related Tasks orders)`
    )
    console.log(
      `= ${stripeAvailableUSD} ${C.gray}- ${C.reset}${walletBalanceUSD} ${C.gray}- (${C.reset}${pendingTasksUSD} ${C.gray} - ${C.reset}${pendingPaypalOrdersUSD})`
    )
    console.log(hr())
    console.log(
      `${bannerColor}${bannerTextColor}  ✅ FINAL AVAILABLE BALANCE FOR STRIPE: ${finalUSDOnlyStripe}  ${C.reset}`
    )
    console.log(hr())

    const periodRows = await getEarningsForAllPeriods({ Order, Payout })
    printPeriodEarnings(periodRows, { C, hr, formatUSD })

    const monthlyRows = await getMonthlyBalanceAllYears({ Order, Payout })
    printMonthlyBalanceAllYears(monthlyRows, { C, hr, formatUSD })

    // Keep original JSON dump for debugging if desired (commented to reduce noise)
    // console.log(JSON.stringify(summary, null, 2));
  } catch (err) {
    console.error(`${C.red}❌ Failed to compute financial summary:${C.reset}`, err)
    process.exitCode = 1
  } finally {
    if (models?.sequelize?.close) {
      await models.sequelize.close()
    }
    console.timeEnd('[Total] Financial summary time')
  }
})()
