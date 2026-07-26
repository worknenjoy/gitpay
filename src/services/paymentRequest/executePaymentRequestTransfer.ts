/* eslint-disable no-console */
import { Transaction } from 'sequelize'
import Models from '../../models'
import { calculateAmountWithPercent } from '../../utils'
import { getPaymentProvider } from '../../providers'
import { findOrCreatePaymentRequestBalance } from '../../queries/payment-request/payment-request-balance'
import {
  updatePaymentIntentMetadata,
  retrievePaymentIntent
} from '../../mutations/provider/stripe/payment-intent'
import { PaymentRequestTransferStatus } from './paymentRequestTransferStatuses'

const models = Models as any

export type ExecutePaymentRequestTransferParams = {
  paymentRequestPaymentId: number
}

export type ExecutePaymentRequestTransferResult = {
  transferCreated: boolean
  deferred: boolean
  skipped: boolean
  reason?: string
  originalAmountDecimal: number
  transferAmountDecimal: number
  resultingBalanceCents: number
  currency: string
  user: any
  paymentRequest: any
  paymentRequestPayment: any
  balanceTransactionForEmail: any
  updatedBalanceTransactionForEmail: any
}

/** Whop settlement / sandbox errors that should be retried by the daily cron */
function isRetryableWhopTransferError(error: any): boolean {
  if (error?.body?.error?.type === 'insufficient_available_balance') return true
  if (error?.statusCode === 422 && String(error?.message || '').includes('whop_account_id')) {
    // Permanent: user must finish Whop onboarding
    return false
  }
  const message = String(error?.message || '').toLowerCase()
  return (
    message.includes('insufficient for ledger transfer') ||
    message.includes('available balance is insufficient') ||
    message.includes('insufficient_available_balance') ||
    message.includes('available fiat balance') ||
    message.includes('require available') ||
    message.includes('pending') ||
    message.includes('ethereum wallet') ||
    message.includes('wallet_send') ||
    message.includes('only supported from') ||
    message.includes('on-chain wallet') ||
    message.includes('sandbox')
  )
}

/**
 * Ensure a Claims-visible PaymentRequestTransfer row exists while funds settle.
 * Status `pending` shows up under Claims → payment request transfers.
 */
async function ensurePendingClaim(params: {
  paymentRequestPayment: any
  paymentRequest: any
  valueDecimal: number
  transferMethod: string
}): Promise<any> {
  const { paymentRequestPayment, paymentRequest, valueDecimal, transferMethod } = params

  let claim: any = null
  if (paymentRequestPayment.transferId) {
    claim = await models.PaymentRequestTransfer.findByPk(paymentRequestPayment.transferId)
  }
  if (!claim) {
    claim = await models.PaymentRequestTransfer.findOne({
      where: {
        paymentRequestId: paymentRequest.id,
        userId: paymentRequest.userId,
        status: 'pending',
        transfer_id: null
      },
      order: [['createdAt', 'DESC']]
    })
  }
  if (!claim) {
    claim = await models.PaymentRequestTransfer.create({
      paymentRequestId: paymentRequest.id,
      userId: paymentRequest.userId,
      value: valueDecimal,
      status: 'pending',
      transfer_method: transferMethod,
      transfer_id: null
    })
  } else if (claim.status === 'pending') {
    await claim.update({
      value: valueDecimal,
      transfer_method: transferMethod
    })
  }

  await paymentRequestPayment.update({
    transferStatus: PaymentRequestTransferStatus.PENDING_FUNDS,
    transferId: claim.id
  })
  await paymentRequest.update({
    transfer_status: PaymentRequestTransferStatus.PENDING_FUNDS
  })

  return claim
}

/**
 * Create the provider transfer for a paid payment-request payment.
 *
 * Shared by:
 * - checkout webhook (Stripe: instant; Whop: try now, defer on pending balance)
 * - daily cron / manual script (retry Whop pending_funds)
 *
 * On Whop deferral, creates a PaymentRequestTransfer with status=`pending` so Claims UI
 * shows the claim before funds settle. Balance ledger writes happen only after a
 * successful provider transfer (or when the payment is fully applied to debt).
 */
export async function executePaymentRequestTransfer(
  params: ExecutePaymentRequestTransferParams
): Promise<ExecutePaymentRequestTransferResult> {
  const paymentRequestPayment = await models.PaymentRequestPayment.findByPk(
    params.paymentRequestPaymentId,
    {
      include: [
        { model: models.PaymentRequest },
        { model: models.User },
        { model: models.PaymentRequestCustomer }
      ]
    }
  )

  if (!paymentRequestPayment) {
    throw new Error(`PaymentRequestPayment ${params.paymentRequestPaymentId} not found`)
  }

  const paymentRequest = paymentRequestPayment.PaymentRequest
  const user = paymentRequestPayment.User

  if (!paymentRequest) {
    throw new Error(
      `PaymentRequest missing for PaymentRequestPayment ${params.paymentRequestPaymentId}`
    )
  }

  const currency = paymentRequest.currency || paymentRequestPayment.currency || 'usd'
  const originalAmount = calculateAmountWithPercent(
    Number(paymentRequestPayment.amount),
    0,
    'decimal',
    currency
  )
  const amountAfterFee = paymentRequest.custom_amount
    ? calculateAmountWithPercent(Number(paymentRequestPayment.amount), 8, 'decimal', currency)
    : calculateAmountWithPercent(Number(paymentRequest.amount), 8, 'decimal', currency)

  const transferAmountDecimal = amountAfterFee.decimal
  const transferAmountCents = amountAfterFee.centavos

  const baseResult = (
    overrides: Partial<ExecutePaymentRequestTransferResult>
  ): ExecutePaymentRequestTransferResult => ({
    transferCreated: false,
    deferred: false,
    skipped: false,
    originalAmountDecimal: originalAmount.decimal,
    transferAmountDecimal,
    resultingBalanceCents: 0,
    currency,
    user,
    paymentRequest,
    paymentRequestPayment,
    balanceTransactionForEmail: null,
    updatedBalanceTransactionForEmail: null,
    ...overrides
  })

  // Already transferred — idempotent no-op
  if (
    paymentRequestPayment.transferStatus === PaymentRequestTransferStatus.INITIATED ||
    paymentRequest.transfer_status === PaymentRequestTransferStatus.INITIATED
  ) {
    return baseResult({ skipped: true, reason: 'already_initiated' })
  }

  const paymentProvider = getPaymentProvider(paymentRequest.provider || undefined)
  const paymentIntentId = paymentRequestPayment.source

  let chargeId: string | undefined
  if (paymentProvider.name === 'stripe') {
    try {
      await updatePaymentIntentMetadata(paymentIntentId, {
        payment_request_payment_id: paymentRequestPayment.id,
        payment_request_id: paymentRequest.id,
        user_id: paymentRequest.userId
      })
    } catch (error) {
      console.warn('[payment-request-transfer] payment intent metadata update failed', error)
    }

    const paymentIntent = await retrievePaymentIntent(paymentIntentId)
    chargeId = (paymentIntent.latest_charge as any)?.id
    if (!chargeId) {
      throw new Error('Could not retrieve charge ID from PaymentIntent')
    }
  }

  const paymentRequestBalance = await findOrCreatePaymentRequestBalance(paymentRequest.userId)
  if (!paymentRequestBalance) {
    throw new Error('Failed to find or create payment request balance')
  }

  // Re-read balance in case of concurrent cron runs
  await paymentRequestBalance.reload()
  const previousBalance = Number.parseInt(String(paymentRequestBalance.balance), 10) || 0
  const creditAmount = transferAmountCents
  const resultingBalance = creditAmount + previousBalance

  // Full amount applied to debt — no provider transfer needed
  if (resultingBalance <= 0) {
    const balanceTransactionForEmail = await models.PaymentRequestBalanceTransaction.create({
      paymentRequestBalanceId: paymentRequestBalance.id,
      amount: creditAmount,
      type: 'CREDIT',
      reason: 'ADJUSTMENT',
      reason_details: 'payment_request_payment_applied',
      status: 'completed'
    })

    await paymentRequestPayment.update({
      transferStatus: PaymentRequestTransferStatus.INITIATED
    })
    await paymentRequest.update({
      transfer_status: PaymentRequestTransferStatus.INITIATED
    })

    return baseResult({
      resultingBalanceCents: resultingBalance,
      balanceTransactionForEmail,
      reason: 'applied_to_balance_debt'
    })
  }

  const destination =
    paymentProvider.name === 'whop' ? user?.whop_account_id : user?.account_id

  if (!destination) {
    const field = paymentProvider.name === 'whop' ? 'whop_account_id' : 'account_id'
    // Still surface a pending claim for Whop so ops/UI see the paid request
    if (paymentProvider.name === 'whop') {
      await ensurePendingClaim({
        paymentRequestPayment,
        paymentRequest,
        valueDecimal: resultingBalance / 100,
        transferMethod: 'whop'
      })
      await paymentRequestPayment.reload({
        include: [
          { model: models.PaymentRequest },
          { model: models.User },
          { model: models.PaymentRequestCustomer }
        ]
      })
      return baseResult({
        deferred: true,
        resultingBalanceCents: resultingBalance,
        reason: `missing_${field}`,
        paymentRequest: paymentRequestPayment.PaymentRequest || paymentRequest,
        paymentRequestPayment
      })
    }
    const err: any = new Error(
      `Cannot create ${paymentProvider.name} transfer: user.${field} is missing`
    )
    err.statusCode = 422
    throw err
  }

  let createdTransferId: string | null = null

  try {
    // Provider call first — only write balance/status after success
    const transfer = await paymentProvider.createTransfer({
      amount: resultingBalance,
      currency,
      destination,
      description: `Payment for service using Payment Request id: ${paymentRequest.id} and Payment Request Payment id: ${paymentRequestPayment.id}`,
      metadata: {
        user_id: paymentRequest.userId,
        payment_request_id: paymentRequest.id,
        payment_request_payment_id: paymentRequestPayment.id,
        source_payment_id: paymentIntentId
      },
      sourceTransaction: chargeId,
      transferGroup: `payment_request_payment_${paymentRequestPayment.id}`
    })

    if (!transfer?.transferId) {
      throw new Error('Failed to create transfer')
    }

    createdTransferId = transfer.transferId

    const { balanceTransactionForEmail, updatedBalanceTransactionForEmail } =
      await models.sequelize.transaction(async (tx: Transaction) => {
        let balanceTx: any = null
        let updatedBalanceTx: any = null

        if (previousBalance < 0) {
          balanceTx = await models.PaymentRequestBalanceTransaction.create(
            {
              paymentRequestBalanceId: paymentRequestBalance.id,
              amount: previousBalance * -1,
              type: 'CREDIT',
              reason: 'ADJUSTMENT',
              reason_details: 'payment_request_payment_applied',
              status: 'completed'
            },
            { transaction: tx }
          )
          updatedBalanceTx = await models.PaymentRequestBalanceTransaction.findByPk(balanceTx.id, {
            transaction: tx,
            include: [models.PaymentRequestBalance]
          })
        }

        await paymentRequest.update(
          {
            transfer_status: PaymentRequestTransferStatus.INITIATED,
            transfer_id: transfer.transferId
          },
          { transaction: tx }
        )

        // Promote existing pending claim (Whop deferral) or create / find by transfer_id
        let paymentRequestTransfer: any = null
        if (paymentRequestPayment.transferId) {
          paymentRequestTransfer = await models.PaymentRequestTransfer.findByPk(
            paymentRequestPayment.transferId,
            { transaction: tx }
          )
        }
        if (!paymentRequestTransfer) {
          paymentRequestTransfer = await models.PaymentRequestTransfer.findOne({
            where: { transfer_id: transfer.transferId },
            transaction: tx
          })
        }
        if (!paymentRequestTransfer) {
          paymentRequestTransfer = await models.PaymentRequestTransfer.findOne({
            where: {
              paymentRequestId: paymentRequest.id,
              userId: paymentRequest.userId,
              status: 'pending',
              transfer_id: null
            },
            transaction: tx,
            order: [['createdAt', 'DESC']]
          })
        }

        if (paymentRequestTransfer) {
          await paymentRequestTransfer.update(
            {
              transfer_id: transfer.transferId,
              paymentRequestId: paymentRequest.id,
              userId: paymentRequest.userId,
              value: resultingBalance / 100,
              status: 'created',
              transfer_method: paymentProvider.name
            },
            { transaction: tx }
          )
        } else {
          paymentRequestTransfer = await models.PaymentRequestTransfer.create(
            {
              transfer_id: transfer.transferId,
              paymentRequestId: paymentRequest.id,
              userId: paymentRequest.userId,
              value: resultingBalance / 100,
              status: 'created',
              transfer_method: paymentProvider.name
            },
            { transaction: tx }
          )
        }

        await paymentRequestPayment.update(
          {
            transferStatus: PaymentRequestTransferStatus.INITIATED,
            transferId: paymentRequestTransfer.id
          },
          { transaction: tx }
        )

        return {
          balanceTransactionForEmail: balanceTx,
          updatedBalanceTransactionForEmail: updatedBalanceTx
        }
      })

    await paymentRequestPayment.reload({
      include: [
        { model: models.PaymentRequest },
        { model: models.User },
        { model: models.PaymentRequestCustomer }
      ]
    })

    return {
      transferCreated: true,
      deferred: false,
      skipped: false,
      originalAmountDecimal: originalAmount.decimal,
      transferAmountDecimal,
      resultingBalanceCents: resultingBalance,
      currency,
      user: paymentRequestPayment.User,
      paymentRequest: paymentRequestPayment.PaymentRequest || paymentRequest,
      paymentRequestPayment,
      balanceTransactionForEmail,
      updatedBalanceTransactionForEmail
    }
  } catch (error: any) {
    if (createdTransferId) {
      await paymentProvider.reverseTransfer(createdTransferId, {}).catch(() => null)
    }

    // Whop: settle later via cron/script; always leave a pending claim for Claims UI
    if (paymentProvider.name === 'whop' && isRetryableWhopTransferError(error)) {
      console.log(
        `[payment-request-transfer] deferring transfer for payment ${paymentRequestPayment.id}:`,
        error?.message || error
      )
      await ensurePendingClaim({
        paymentRequestPayment,
        paymentRequest,
        valueDecimal: resultingBalance / 100,
        transferMethod: 'whop'
      })
      await paymentRequestPayment.reload({
        include: [
          { model: models.PaymentRequest },
          { model: models.User },
          { model: models.PaymentRequestCustomer }
        ]
      })
      return baseResult({
        deferred: true,
        resultingBalanceCents: resultingBalance,
        reason: 'insufficient_available_balance',
        paymentRequest: paymentRequestPayment.PaymentRequest || paymentRequest,
        paymentRequestPayment
      })
    }

    throw error
  }
}
