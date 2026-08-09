/* eslint-disable no-console */
import { Op } from 'sequelize'
import Models from '../../models'
import PaymentRequestMail from '../../mail/paymentRequest'
import { calculateAmountWithPercent } from '../../utils'
import { PaymentRequestTransferStatus } from './paymentRequestTransferStatuses'
import { executePaymentRequestTransfer } from './executePaymentRequestTransfer'

const models = Models as any

export type ProcessPendingTransfersOptions = {
  /**
   * Skip live Whop ledger transfer and write a mock transfer id (sandbox / ops).
   * Cron must never pass this — only the CLI script with an explicit flag.
   */
  mockSettlement?: boolean
  /** Limit to a single PaymentRequestPayment id */
  paymentRequestPaymentId?: number
}

export type ProcessPendingTransfersResult = {
  scanned: number
  transferred: number
  deferred: number
  skipped: number
  failed: number
  mockSettlement: boolean
  errors: Array<{ paymentRequestPaymentId: number; error: string }>
}

/**
 * Retry payment-request transfers that were deferred because Whop platform
 * available balance was still settling (pending).
 *
 * Also picks up legacy rows where the payment was stored but transferStatus
 * was left null (earlier bug when transfer failed without marking pending_funds).
 *
 * Safe to run daily via cron or on demand via script.
 * Pass `mockSettlement: true` only from the ops script when sandbox never settles.
 */
export async function processPendingPaymentRequestTransfers(
  options: ProcessPendingTransfersOptions = {}
): Promise<ProcessPendingTransfersResult> {
  const mockSettlement = Boolean(options.mockSettlement)
  const paymentWhere: any = {
    [Op.or]: [
      { transferStatus: PaymentRequestTransferStatus.PENDING_FUNDS },
      { transferStatus: { [Op.is]: null } }
    ]
  }
  if (options.paymentRequestPaymentId != null) {
    paymentWhere.id = options.paymentRequestPaymentId
  }

  const pendingPayments = await models.PaymentRequestPayment.findAll({
    where: paymentWhere,
    include: [
      {
        model: models.PaymentRequest,
        required: true,
        where: {
          provider: 'whop',
          status: 'paid',
          transfer_status: {
            [Op.notIn]: [PaymentRequestTransferStatus.INITIATED]
          }
        }
      },
      { model: models.User },
      { model: models.PaymentRequestCustomer }
    ],
    order: [['createdAt', 'ASC']]
  })

  const result: ProcessPendingTransfersResult = {
    scanned: pendingPayments.length,
    transferred: 0,
    deferred: 0,
    skipped: 0,
    failed: 0,
    mockSettlement,
    errors: []
  }

  console.log(
    `[payment-request-transfer-cron] Found ${pendingPayments.length} payment(s) with transferStatus=${PaymentRequestTransferStatus.PENDING_FUNDS}` +
      (mockSettlement ? ' (mockSettlement=true)' : '')
  )

  for (const payment of pendingPayments) {
    try {
      const transferResult = await executePaymentRequestTransfer({
        paymentRequestPaymentId: payment.id,
        mockSettlement
      })

      if (transferResult.skipped) {
        result.skipped += 1
        console.log(
          `[payment-request-transfer-cron] payment ${payment.id} skipped: ${transferResult.reason}`
        )
        continue
      }

      if (transferResult.deferred) {
        result.deferred += 1
        console.log(
          `[payment-request-transfer-cron] payment ${payment.id} still pending funds`
        )
        continue
      }

      if (transferResult.transferCreated) {
        result.transferred += 1
        console.log(
          `[payment-request-transfer-cron] payment ${payment.id} transferred successfully`
        )

        try {
          await PaymentRequestMail.transferInitiatedForPaymentRequest(
            transferResult.user,
            transferResult.paymentRequest,
            transferResult.originalAmountDecimal,
            transferResult.transferAmountDecimal,
            transferResult.balanceTransactionForEmail
              ? {
                  extraFee: calculateAmountWithPercent(
                    transferResult.balanceTransactionForEmail.amount,
                    0,
                    'centavos',
                    transferResult.currency
                  ).decimal,
                  total: calculateAmountWithPercent(
                    transferResult.resultingBalanceCents,
                    0,
                    'centavos',
                    transferResult.currency
                  ).decimal
                }
              : null
          )
        } catch (mailError) {
          console.error(
            `[payment-request-transfer-cron] transfer email failed for payment ${payment.id}`,
            mailError
          )
        }

        if (transferResult.updatedBalanceTransactionForEmail) {
          PaymentRequestMail.newBalanceTransactionForPaymentRequest(
            transferResult.user,
            transferResult.paymentRequestPayment,
            transferResult.updatedBalanceTransactionForEmail
          ).catch((mailError: any) => {
            console.error(
              `[payment-request-transfer-cron] balance email failed for payment ${payment.id}`,
              mailError
            )
          })
        }
        continue
      }

      // Applied to debt only (no provider transfer)
      result.transferred += 1
      console.log(
        `[payment-request-transfer-cron] payment ${payment.id} applied without transfer: ${transferResult.reason}`
      )
    } catch (error: any) {
      result.failed += 1
      const message = error?.message || String(error)
      result.errors.push({ paymentRequestPaymentId: payment.id, error: message })
      console.error(
        `[payment-request-transfer-cron] payment ${payment.id} failed:`,
        message
      )
    }
  }

  console.log(
    `[payment-request-transfer-cron] Done. scanned=${result.scanned} transferred=${result.transferred} deferred=${result.deferred} skipped=${result.skipped} failed=${result.failed}`
  )

  return result
}
