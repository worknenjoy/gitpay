import { Transaction } from 'sequelize'
import models from '../../../models'
import {
  BalanceTransactionType,
  BalanceTransactionReason
} from '../../../models/paymentRequestBalanceTransaction'

const currentModels = models as any

export type CreatePaymentRequestBalanceTransactionParams = {
  paymentRequestBalanceId: number
  amount: number
  currency?: string
  type: BalanceTransactionType
  reason: BalanceTransactionReason
  reason_details?: string
  sourceId?: string
  status?: string
  openedAt?: Date
  closedAt?: Date
  tx?: Transaction
}

export async function createPaymentRequestBalanceTransaction(
  params: CreatePaymentRequestBalanceTransactionParams
) {
  if (!params.paymentRequestBalanceId) {
    throw new Error('No paymentRequestBalanceId provided')
  }
  if (params.amount === undefined || params.amount === null) {
    throw new Error('No amount provided')
  }

  const create = async (transaction?: Transaction) =>
    currentModels.PaymentRequestBalanceTransaction.create(
      {
        paymentRequestBalanceId: params.paymentRequestBalanceId,
        amount: params.amount,
        currency: params.currency || 'usd',
        type: params.type,
        reason: params.reason,
        reason_details: params.reason_details,
        sourceId: params.sourceId,
        status: params.status,
        openedAt: params.openedAt,
        closedAt: params.closedAt
      },
      { transaction }
    )

  if (params.tx) {
    return create(params.tx)
  }
  return create()
}
