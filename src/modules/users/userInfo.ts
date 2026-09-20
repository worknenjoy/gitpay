import models from '../../models'
import { calculateAmountWithPercent } from '../../utils'

const currentModels = models as any

const userInfo = async (params: any) => {
  const { userId } = params

  const issues = await currentModels.Task.findAndCountAll({
    where: {
      userId: userId
    }
  })

  const payments = await currentModels.Order.findAndCountAll({
    where: {
      userId: userId
    },
    include: [currentModels.Task]
  })

  const wallets = await currentModels.Wallet.findAndCountAll({
    where: {
      userId: userId
    }
  })

  const walletsSpendBalance = (
    await Promise.all(wallets.rows.map((wallet: any) => wallet.spendBalance()))
  ).reduce((sum: number, spend: any) => sum + spend.toNumber(), 0)

  const paymentRequests = await currentModels.PaymentRequest.findAndCountAll({
    where: {
      userId: userId
    },
    include: [currentModels.PaymentRequestPayment]
  })

  const transfers = await currentModels.Transfer.findAndCountAll({
    where: {
      to: userId
    }
  })

  const paymentRequestTransfers = await currentModels.PaymentRequestTransfer.findAndCountAll({
    where: {
      userId: userId
    }
  })

  const payouts = await currentModels.Payout.findAndCountAll({
    where: {
      userId: userId
    }
  })

  const payoutsByCurrency = payouts.rows.reduce(
    (
      acc: Record<
        string,
        {
          total: number
          pending: number
          completed: number
          in_transit: number
          amount: number
          paidAmount: number
          inTransitAmount: number
        }
      >,
      payout: any
    ) => {
      const currency = (payout.currency || 'unknown').toLowerCase()

      if (!acc[currency]) {
        acc[currency] = {
          total: 0,
          pending: 0,
          completed: 0,
          in_transit: 0,
          amount: 0,
          paidAmount: 0,
          inTransitAmount: 0
        }
      }

      // Payout.amount is stored in centavos (Stripe convention); convert to decimal
      // before combining with the decimal-denominated Transfer/PaymentRequestTransfer
      // values below (claimsAmount, awaitingPayoutAmount).
      const decimalAmount = calculateAmountWithPercent(
        Number(payout.amount || 0),
        0,
        'centavos',
        currency
      ).decimal

      acc[currency].total += 1
      acc[currency].pending += payout.status === 'pending' ? 1 : 0
      acc[currency].completed += payout.status === 'paid' ? 1 : 0
      acc[currency].in_transit += payout.status === 'in_transit' ? 1 : 0
      acc[currency].amount += Number(payout.amount || 0)
      acc[currency].paidAmount += payout.status === 'paid' ? decimalAmount : 0
      acc[currency].inTransitAmount += payout.status === 'in_transit' ? decimalAmount : 0

      return acc
    },
    {}
  )

  const claimsBounties = transfers.rows.reduce(
    (sum: number, transfer: any) => sum + Number(transfer.value || 0),
    0
  )
  const claimsPaymentRequests = paymentRequestTransfers.rows.reduce(
    (sum: number, prTransfer: any) => sum + Number(prTransfer.value || 0),
    0
  )
  const claimsAmount = claimsBounties + claimsPaymentRequests

  const paidOrInTransitAmount = (
    Object.values(payoutsByCurrency) as Array<{
      paidAmount: number
      inTransitAmount: number
    }>
  ).reduce(
    (sum, currencyPayouts) => sum + currencyPayouts.paidAmount + currencyPayouts.inTransitAmount,
    0
  )

  return {
    issues: {
      total: issues.count,
      open: issues.rows.filter((issue: any) => issue.status === 'open').length,
      closed: issues.rows.filter((issue: any) => issue.status === 'closed').length,
      // Sum of the bounty value committed to this user's still-open issues.
      openValue: issues.rows
        .filter((issue: any) => issue.status === 'open')
        .reduce((sum: number, issue: any) => sum + Number(issue.value || 0), 0)
    },
    payments: {
      total: payments.count,
      pending: payments.rows.filter((payment: any) => payment.status === 'open').length,
      succeeded: payments.rows.filter((payment: any) => payment.status === 'succeeded').length,
      failed: payments.rows.filter((payment: any) => payment.status === 'failed').length,
      refunded: payments.rows.filter((payment: any) => payment.status === 'refunded').length,
      amount: payments.rows
        .filter((payment: any) => payment.status === 'succeeded')
        .reduce((sum: number, payment: any) => sum + Number(payment.amount || 0), 0),
      // Distinct projects this user has funded a payment towards.
      distinctProjects: new Set(
        payments.rows.map((payment: any) => payment.Task?.ProjectId).filter(Boolean)
      ).size
    },
    wallets: {
      total: wallets.count,
      data: wallets.rows.map((wallet: any) => ({ name: wallet.name })),
      balance: wallets.rows[0]?.balance || 0,
      spendBalance: walletsSpendBalance
    },
    paymentRequests: {
      total: paymentRequests.count,
      active: paymentRequests.rows.filter((request: any) => request.active).length,
      amount: paymentRequests.rows.reduce((sum: number, request: any) => {
        const paidAmount =
          request.PaymentRequestPayments?.reduce(
            (paySum: number, pay: any) => paySum + Number(pay.amount || 0),
            0
          ) || 0
        return sum + paidAmount
      }, 0),
      payments: paymentRequests.rows.reduce((count: number, request: any) => {
        return count + (request.PaymentRequestPayments ? request.PaymentRequestPayments.length : 0)
      }, 0),
      // Distinct buyers across all of this user's payment links.
      customers: new Set(
        paymentRequests.rows.flatMap(
          (request: any) =>
            request.PaymentRequestPayments?.map((pay: any) => pay.customerId).filter(Boolean) || []
        )
      ).size,
      // Share of links that received at least one payment.
      convertedPercent:
        paymentRequests.count > 0
          ? Math.round(
              (paymentRequests.rows.filter(
                (request: any) => request.PaymentRequestPayments?.length > 0
              ).length /
                paymentRequests.count) *
                100
            )
          : 0,
      recentPayments: paymentRequests.rows.reduce(
        (acc: { count: number; amount: number }, request: any) => {
          const recent = (request.PaymentRequestPayments || []).filter(
            (pay: any) => new Date(pay.createdAt).getTime() >= Date.now() - 30 * 24 * 60 * 60 * 1000
          )
          return {
            count: acc.count + recent.length,
            amount:
              acc.amount +
              recent.reduce((sum: number, pay: any) => sum + Number(pay.amount || 0), 0)
          }
        },
        { count: 0, amount: 0 }
      )
    },
    claims: {
      total: transfers.count + paymentRequestTransfers.count,
      amount: claimsAmount,
      bounties: claimsBounties,
      paymentRequests: claimsPaymentRequests
    },
    payouts: payoutsByCurrency,
    // Money claimed but not yet disbursed via payout (not a wallet balance —
    // Wallet is the funder/maintainer funding wallet, unrelated to contributor earnings).
    awaitingPayoutAmount: claimsAmount - paidOrInTransitAmount
  }
}

export default userInfo
