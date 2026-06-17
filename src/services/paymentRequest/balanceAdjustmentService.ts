import models from '../../models'
import { createPaymentRequestBalanceTransaction } from '../../mutations/payment-request/balance-transaction'
import PaymentRequestMail from '../../mail/paymentRequest'

const currentModels = models as any

export type BalanceAdjustmentServiceParams = {
  paymentRequestBalanceId: number
  amount: number
  currency?: string
}

export type BalanceAdjustmentServiceResult = {
  balanceTransaction: any
  balance: any
  user: any
}

export async function balanceAdjustmentService(
  params: BalanceAdjustmentServiceParams
): Promise<BalanceAdjustmentServiceResult> {
  const balance = await currentModels.PaymentRequestBalance.findByPk(
    params.paymentRequestBalanceId,
    { include: [{ model: currentModels.User }] }
  )
  if (!balance) {
    throw new Error(`PaymentRequestBalance ${params.paymentRequestBalanceId} not found`)
  }

  const user = balance.User
  if (!user) {
    throw new Error(
      `No user associated with PaymentRequestBalance ${params.paymentRequestBalanceId}`
    )
  }

  const balanceTransaction = await createPaymentRequestBalanceTransaction({
    paymentRequestBalanceId: params.paymentRequestBalanceId,
    amount: params.amount,
    currency: params.currency || balance.currency || 'usd',
    type: 'CREDIT',
    reason: 'ADJUSTMENT',
    reason_details: 'manual_payment_for_credit_due'
  })

  const transactionWithBalance = await currentModels.PaymentRequestBalanceTransaction.findByPk(
    balanceTransaction.id,
    { include: [{ model: currentModels.PaymentRequestBalance }] }
  )

  await PaymentRequestMail.newBalanceTransactionForPaymentRequest(
    user,
    null,
    transactionWithBalance,
    'Manual payment for credit due'
  )

  const updatedBalance = await currentModels.PaymentRequestBalance.findByPk(
    params.paymentRequestBalanceId
  )

  return {
    balanceTransaction: transactionWithBalance.dataValues ?? transactionWithBalance,
    balance: updatedBalance.dataValues ?? updatedBalance,
    user: user.dataValues ?? user
  }
}
