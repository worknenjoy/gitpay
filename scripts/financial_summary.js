// financial-summary-methods.js

const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_KEY);
const { Op } = require("sequelize");
const { Wallet, Order, Task } = require("../models");


async function fetchAllStripeData(listFn, params = {}) {
  let hasMore = true;
  let startingAfter = null;
  let results = [];

  while (hasMore) {
    const response = await listFn({
      limit: 100,
      ...params,
      ...(startingAfter && { starting_after: startingAfter }),
    });

    results = results.concat(response.data);
    hasMore = response.has_more;
    startingAfter = response.data.length ? response.data[response.data.length - 1].id : null;
  }

  return results;
}

async function getStripeData() {
  const payments = await fetchAllStripeData((params) => stripe.charges.list(params));
  const transfers = await fetchAllStripeData((params) => stripe.transfers.list(params));
  const payouts = await fetchAllStripeData((params) => stripe.payouts.list(params));
  const invoices = await fetchAllStripeData((params) => stripe.invoices.list(params));

  let totalPayments = 0;
  let totalStripeFees = 0;
  let totalRefunds = 0;

  for (const p of payments) {
    if (!p.refunded) totalPayments += p.amount / 100;
    if (p.amount_refunded > 0) totalRefunds += p.amount_refunded / 100;
    if (p.balance_transaction) {
      const txn = await stripe.balanceTransactions.retrieve(p.balance_transaction);
      totalStripeFees += txn.fee / 100;
    }
  }

  const totalTransfers = transfers.reduce((sum, t) => sum + t.amount / 100, 0);
  const totalPayouts = payouts.reduce((sum, p) => sum + p.amount / 100, 0);

  const subscriptionRevenue = invoices.reduce((sum, i) => {
    if (i.paid && i.subscription && i.subscription.startsWith("sub_")) {
      return sum + i.amount_paid / 100;
    }
    return sum;
  }, 0);

  return { totalPayments, totalStripeFees, totalRefunds, totalTransfers, totalPayouts, subscriptionRevenue };
}

async function getDatabaseData() {
  const walletReserved = await Wallet.sum("balance") || 0;
  const orderTotal = await Order.sum("amount", { where: { status: "succeeded" } }) || 0;

  const unpaidTasks = await Task.sum("value", {
    where: {
      value: { [Op.gt]: 0 },
      status: { [Op.ne]: "paid" }
    },
  }) || 0;

  return { walletReserved, orderTotal, unpaidTasks };
}

(async () => {
  try {
    const stripeData = await getStripeData();
    const dbData = await getDatabaseData();
    const { unpaidTasks, walletReserved, orderTotal } = dbData

    // === METHOD 1: Original Stripe-Based Method ===
    const platformRevenueFromOrders = orderTotal * 0.08;
    const platformRevenueFromTransfers = stripeData.totalTransfers * 0.08;
    const platformRevenueWithFees = platformRevenueFromOrders + stripeData.totalStripeFees + platformRevenueFromTransfers;

    const availableBalanceOriginal =
      stripeData.totalPayments -
      stripeData.totalTransfers -
      stripeData.totalPayouts -
      walletReserved -
      stripeData.totalRefunds;

    // === METHOD 2: Fee Model (Task Earnings minus Stripe Fees + 8% from Transfers) ===
    const estimatedStripeFees = (stripeData.totalTransfers * 0.08 * 0.029) + (stripeData.totalTransfers / 100); // estimation: 2.9% + $0.30 per transfer
    const netTaskFeeEarnings = (stripeData.totalTransfers / 0.92) * 0.08 - estimatedStripeFees;
    const transferCleanFeeEarnings = (stripeData.totalTransfers / 0.92) * 0.08;
    const platformRevenueFullModel = netTaskFeeEarnings + transferCleanFeeEarnings + stripeData.subscriptionRevenue;

    const availableBalanceAdjusted =
      platformRevenueFullModel -
      unpaidTasks -
      walletReserved;

    // === Output ===
    console.log("\n====== Gitpay Financial Summary ======\n");

    console.log("--- METHOD 1: Original Stripe-Based Estimate ---");
    console.log("Total Platform Revenue:", platformRevenueWithFees.toFixed(2));
    console.log("Available Balance:", availableBalanceOriginal.toFixed(2));

    console.log("\n--- METHOD 2: Full Model with Transfer Logic ---");
    console.log("Net Task Earnings (8% - Stripe Fees):", netTaskFeeEarnings.toFixed(2));
    console.log("Transfer Earnings (8% clean):", transferCleanFeeEarnings.toFixed(2));
    console.log("Subscription Revenue:", stripeData.subscriptionRevenue.toFixed(2));
    console.log("Total Platform Revenue:", platformRevenueFullModel.toFixed(2));
    console.log("Adjusted Available Balance:", availableBalanceAdjusted.toFixed(2));

    console.log("------ List of Unpaid Tasks ---------");
    unpaidTasks.forEach(task => {
      console.log(`Task ID: ${task.id}, Title: ${task.title} Value: ${task.value}`);
    });
    console.log("\n========================================\n");
    
  } catch (error) {
    console.error("Error generating summary:", error);
  }
})();