import models from '../../models'

const currentModels = models as any

const userInfo = async (params:any) => {
  const { userId } = params;

  const userIssues = currentModels.Task.findAndCountAll({
    where: {
      userId: userId
    }
  });

  const userPayments = currentModels.Order.findAndCountAll({
    where: {
      userId: userId
    }
  });

  const [issues, payments] = await Promise.all([userIssues, userPayments]);

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
    }
  };
  
};

export default userInfo;