import models from '../../models'
import paymentRequest from '../../models/paymentRequest';

const currentModels = models as any

const userInfo = async (params:any) => {
  const { userId } = params;

  const issues = await currentModels.Task.findAndCountAll({
    where: {
      userId: userId
    }
  });

  const payments = await currentModels.Order.findAndCountAll({
    where: {
      userId: userId
    }
  });

  const wallets = await currentModels.Wallet.findAndCountAll({
    where: {
      userId: userId
    }
  });

  const paymentRequests = await currentModels.PaymentRequest.findAndCountAll({
    where: {
      userId: userId
    },
    include: [currentModels.PaymentRequestPayment]
  });

  const transfers = await currentModels.Transfer.findAndCountAll({
    where: {
      to: userId
    }
  });

  const paymentRequestTransfers = await currentModels.PaymentRequestTransfer.findAndCountAll({
    where: {
      userId: userId
    }
  });

  const payouts = await currentModels.Payout.findAndCountAll({
    where: {
      userId: userId
    }
  });

  const payoutsByCurrency = payouts.rows.reduce((acc: Record<string, {
    total: number;
    pending: number;
    completed: number;
    in_transit: number;
    amount: number;
  }>, payout: any) => {
    const currency = (payout.currency || 'unknown').toLowerCase();

    if (!acc[currency]) {
      acc[currency] = {
        total: 0,
        pending: 0,
        completed: 0,
        in_transit: 0,
        amount: 0
      };
    }

    acc[currency].total += 1;
    acc[currency].pending += payout.status === 'pending' ? 1 : 0;
    acc[currency].completed += payout.status === 'completed' ? 1 : 0;
    acc[currency].in_transit += payout.status === 'in_transit' ? 1 : 0;
    acc[currency].amount += Number(payout.amount || 0);

    return acc;
  }, {});


  return {
    issues: {
      total: issues.count,
      open: issues.rows.filter((issue:any) => issue.status === 'open').length,
      closed: issues.rows.filter((issue:any) => issue.status === 'closed').length
    },
    payments: {
      total: payments.count,
      pending: payments.rows.filter((payment:any) => payment.status === 'open').length,
      succeeded: payments.rows.filter((payment:any) => payment.status === 'succeeded').length,
      failed: payments.rows.filter((payment:any) => payment.status === 'failed').length,
      amount: payments.rows.filter((payment:any) => payment.status === 'succeeded').reduce((sum:number, payment:any) => sum + Number(payment.amount || 0), 0)
    },
    wallets: {
      total: wallets.count,
      data: wallets.rows.map((wallet:any) => ({ name: wallet.name })),
      balance: wallets.rows[0]?.balance || 0
    },
    paymentRequests: {
      total: paymentRequests.count,
      amount: paymentRequests.rows.reduce((sum:number, request:any) => {
        const paidAmount = request.PaymentRequestPayments?.reduce((paySum:number, pay:any) => paySum + Number(pay.amount || 0), 0) || 0;
        return sum + paidAmount;
      }, 0),
      payments: paymentRequests.rows.reduce((count:number, request:any) => {
        return count + (request.PaymentRequestPayments ? request.PaymentRequestPayments.length : 0);
      }, 0)
    },
    claims: {
      total: transfers.count + paymentRequestTransfers.count,
      amount: transfers.rows.reduce((sum:number, transfer:any) => sum + Number(transfer.value || 0), 0) +
              paymentRequestTransfers.rows.reduce((sum:number, prTransfer:any) => sum + Number(prTransfer.value || 0), 0)
    },
    payouts: payoutsByCurrency
  };
  
};

export default userInfo;