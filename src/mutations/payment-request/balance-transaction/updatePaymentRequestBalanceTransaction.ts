import { Transaction } from 'sequelize'
import models from '../../../models'

const currentModels = models as any

export type UpdatePaymentRequestBalanceTransactionParams = {
  id: number
  status?: string
  reason_details?: string
  closedAt?: Date
  tx?: Transaction
}

export async function updatePaymentRequestBalanceTransaction(
  params: UpdatePaymentRequestBalanceTransactionParams
) {
  const record = await currentModels.PaymentRequestBalanceTransaction.findByPk(params.id)
  if (!record) {
    throw new Error(`PaymentRequestBalanceTransaction ${params.id} not found`)
  }

  const updates: Record<string, any> = {}
  if (params.status !== undefined) updates.status = params.status
  if (params.reason_details !== undefined) updates.reason_details = params.reason_details
  if (params.closedAt !== undefined) updates.closedAt = params.closedAt

  await record.update(updates, params.tx ? { transaction: params.tx } : {})
  return record
}
