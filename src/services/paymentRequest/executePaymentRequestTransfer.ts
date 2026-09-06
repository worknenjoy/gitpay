/* eslint-disable no-console */
import { Transaction } from 'sequelize'
import Models from '../../models'
import { getPaymentProvider } from '../../providers'
import { findOrCreatePaymentRequestBalance } from '../../queries/payment-request/payment-request-balance'
import {
  updatePaymentIntentMetadata,
  retrievePaymentIntent
} from '../../mutations/provider/stripe/payment-intent'
import { PaymentRequestTransferStatus } from './paymentRequestTransferStatuses'
import { computeSellerNetAmount } from './sellerNetAmount'

const models = Models as any

export type ExecutePaymentRequestTransferParams = {
  paymentRequestPaymentId: number
  /**
   * When true (Whop sandbox / ops), skip the live provider transfer API and
   * persist a synthetic transfer id so the rest of the flow can complete.
   * Does not create a real ledger move on Whop.
   */
  mockSettlement?: boolean
}

export type ExecutePaymentRequestTransferResult = {
  transferCreated: boolean
  deferred: boolean
  skipped: boolean
  reason?: string
  /** True only the first time this payment transitions into PENDING_FUNDS (not on cron retries). */
  newlyDeferred: boolean
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
  // Concurrent request with the same Idempotency-Key already in flight — our own
  // advisory lock should prevent this from Gitpay's own calls, but treat it as
  // retryable in case another caller (script, ops retry) collides.
  if (error?.status === 409 || error?.statusCode === 409) return true
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
 *
 * Pass `transaction` when called from inside the locked balance-decision transaction
 * (destination-missing case); omit it for the catch-block recovery path, where the
 * original transaction has already rolled back and these writes auto-commit individually.
 */
async function ensurePendingClaim(params: {
  paymentRequestPayment: any
  paymentRequest: any
  valueDecimal: number
  transferMethod: string
  transaction?: Transaction
}): Promise<any> {
  const { paymentRequestPayment, paymentRequest, valueDecimal, transferMethod, transaction } =
    params
  const opts = transaction ? { transaction } : undefined

  let claim: any = null
  if (paymentRequestPayment.transferId) {
    claim = await models.PaymentRequestTransfer.findByPk(paymentRequestPayment.transferId, opts)
  }
  if (!claim) {
    claim = await models.PaymentRequestTransfer.findOne({
      where: {
        paymentRequestId: paymentRequest.id,
        userId: paymentRequest.userId,
        status: 'pending',
        transfer_id: null
      },
      order: [['createdAt', 'DESC']],
      ...opts
    })
  }
  if (!claim) {
    claim = await models.PaymentRequestTransfer.create(
      {
        paymentRequestId: paymentRequest.id,
        userId: paymentRequest.userId,
        value: valueDecimal,
        status: 'pending',
        transfer_method: transferMethod,
        transfer_id: null
      },
      opts
    )
  } else if (claim.status === 'pending') {
    await claim.update(
      {
        value: valueDecimal,
        transfer_method: transferMethod
      },
      opts
    )
  }

  await paymentRequestPayment.update(
    {
      transferStatus: PaymentRequestTransferStatus.PENDING_FUNDS,
      transferId: claim.id
    },
    opts
  )
  await paymentRequest.update(
    {
      transfer_status: PaymentRequestTransferStatus.PENDING_FUNDS
    },
    opts
  )

  return claim
}

type LockedTransferOutcome =
  | { kind: 'debt_applied'; resultingBalance: number; balanceTransactionForEmail: any }
  | { kind: 'deferred_no_destination'; resultingBalance: number }
  | {
      kind: 'transferred'
      resultingBalance: number
      transfer: { transferId: string; amount?: number; currency?: string; raw?: unknown }
      balanceTransactionForEmail: any
      updatedBalanceTransactionForEmail: any
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
 *
 * Concurrency: the balance read, the skip/transfer decision, the external provider call,
 * and the resulting DB writes all run inside one DB transaction holding
 * `pg_advisory_xact_lock(userId)` — this serializes every call for the same seller
 * (webhook, cron, or manual script) so two near-simultaneous payments for the same user
 * can't both read a stale balance and double-clear debt or double-transfer. The lock is
 * transaction-scoped, so it releases automatically on commit or rollback (including on
 * a thrown error) with no manual unlock required.
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

  const wasAlreadyPendingFunds =
    paymentRequestPayment.transferStatus === PaymentRequestTransferStatus.PENDING_FUNDS

  if (!paymentRequest) {
    throw new Error(
      `PaymentRequest missing for PaymentRequestPayment ${params.paymentRequestPaymentId}`
    )
  }

  const currency = paymentRequest.currency || paymentRequestPayment.currency || 'usd'

  // originalAmountDecimal in results is the fee base (shown on transfer-initiated email),
  // not necessarily the customer gross (that stays on payment.amount for payment-made).
  const sellerNetAmount = computeSellerNetAmount({
    paymentRequestPayment,
    paymentRequest,
    currency
  })
  const transferAmountDecimal = sellerNetAmount.netAmountDecimal
  const transferAmountCents = sellerNetAmount.netAmountCents

  const baseResult = (
    overrides: Partial<ExecutePaymentRequestTransferResult>
  ): ExecutePaymentRequestTransferResult => ({
    transferCreated: false,
    deferred: false,
    skipped: false,
    newlyDeferred: false,
    originalAmountDecimal: sellerNetAmount.originalAmountDecimal,
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

  // Payment was refunded before its (Whop) deferred transfer ever settled —
  // never pay the seller for a payment the customer already got back.
  if (paymentRequestPayment.status === 'refunded') {
    if (paymentRequestPayment.transferId) {
      const claim = await models.PaymentRequestTransfer.findByPk(paymentRequestPayment.transferId)
      if (claim && claim.status === 'pending') {
        await claim.update({ status: 'refunded' })
      }
    }

    await paymentRequestPayment.update({ transferStatus: PaymentRequestTransferStatus.INITIATED })
    await paymentRequest.update({ transfer_status: PaymentRequestTransferStatus.INITIATED })

    return baseResult({ skipped: true, reason: 'payment_refunded' })
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

  let createdTransferId: string | null = null
  let previousBalanceForRecovery = 0

  try {
    const outcome: LockedTransferOutcome = await models.sequelize.transaction(
      async (tx: Transaction) => {
        // Serialize every balance decision for this seller (webhook, cron, script) —
        // held through the external provider call below, released automatically on
        // commit or rollback.
        await models.sequelize.query('SELECT pg_advisory_xact_lock(:userId)', {
          replacements: { userId: paymentRequest.userId },
          transaction: tx
        })

        await paymentRequestBalance.reload({ transaction: tx })
        const previousBalance = Number.parseInt(String(paymentRequestBalance.balance), 10) || 0
        previousBalanceForRecovery = previousBalance
        const creditAmount = transferAmountCents
        const resultingBalance = creditAmount + previousBalance

        // Full amount applied to debt — no provider transfer needed
        if (resultingBalance <= 0) {
          const balanceTransactionForEmail = await models.PaymentRequestBalanceTransaction.create(
            {
              paymentRequestBalanceId: paymentRequestBalance.id,
              amount: creditAmount,
              type: 'CREDIT',
              reason: 'ADJUSTMENT',
              reason_details: 'payment_request_payment_applied',
              status: 'completed'
            },
            { transaction: tx }
          )

          await paymentRequestPayment.update(
            { transferStatus: PaymentRequestTransferStatus.INITIATED },
            { transaction: tx }
          )
          await paymentRequest.update(
            { transfer_status: PaymentRequestTransferStatus.INITIATED },
            { transaction: tx }
          )

          return { kind: 'debt_applied', resultingBalance, balanceTransactionForEmail }
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
              transferMethod: 'whop',
              transaction: tx
            })
            return { kind: 'deferred_no_destination', resultingBalance }
          }
          const err: any = new Error(
            `Cannot create ${paymentProvider.name} transfer: user.${field} is missing`
          )
          err.statusCode = 422
          throw err
        }

        // Provider call first — only write balance/status after success.
        // mockSettlement: sandbox often never frees available balance; ops can complete the Gitpay side.
        let transfer: { transferId: string; amount?: number; currency?: string; raw?: unknown }

        if (params.mockSettlement && paymentProvider.name === 'whop') {
          transfer = {
            transferId: `mock_tr_pr_${paymentRequestPayment.id}_${Date.now()}`,
            amount: resultingBalance / 100,
            currency,
            raw: { mock: true, reason: 'mock_settlement' }
          }
          console.log(
            `[payment-request-transfer] mockSettlement for payment ${paymentRequestPayment.id} → ${transfer.transferId}`
          )
        } else {
          // Deterministic per payment + exact amount: safe to replay on retry of the
          // identical decision, but a genuinely different amount (e.g. new debt landed
          // between attempts) gets its own key rather than colliding with a stale one.
          const idempotencyKey = `pr_payment_transfer_${paymentRequestPayment.id}_${resultingBalance}`
          transfer = await paymentProvider.createTransfer({
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
            transferGroup: `payment_request_payment_${paymentRequestPayment.id}`,
            idempotencyKey
          })
        }

        if (!transfer?.transferId) {
          throw new Error('Failed to create transfer')
        }

        createdTransferId = transfer.transferId

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
          kind: 'transferred',
          resultingBalance,
          transfer,
          balanceTransactionForEmail: balanceTx,
          updatedBalanceTransactionForEmail: updatedBalanceTx
        }
      }
    )

    if (outcome.kind === 'debt_applied') {
      return baseResult({
        resultingBalanceCents: outcome.resultingBalance,
        balanceTransactionForEmail: outcome.balanceTransactionForEmail,
        reason: 'applied_to_balance_debt'
      })
    }

    if (outcome.kind === 'deferred_no_destination') {
      await paymentRequestPayment.reload({
        include: [
          { model: models.PaymentRequest },
          { model: models.User },
          { model: models.PaymentRequestCustomer }
        ]
      })
      return baseResult({
        deferred: true,
        newlyDeferred: !wasAlreadyPendingFunds,
        resultingBalanceCents: outcome.resultingBalance,
        reason: `missing_${paymentProvider.name === 'whop' ? 'whop_account_id' : 'account_id'}`,
        paymentRequest: paymentRequestPayment.PaymentRequest || paymentRequest,
        paymentRequestPayment
      })
    }

    // kind === 'transferred'
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
      newlyDeferred: false,
      originalAmountDecimal: sellerNetAmount.originalAmountDecimal,
      transferAmountDecimal,
      resultingBalanceCents: outcome.resultingBalance,
      currency,
      user: paymentRequestPayment.User,
      paymentRequest: paymentRequestPayment.PaymentRequest || paymentRequest,
      paymentRequestPayment,
      balanceTransactionForEmail: outcome.balanceTransactionForEmail,
      updatedBalanceTransactionForEmail: outcome.updatedBalanceTransactionForEmail
    }
  } catch (error: any) {
    // The locked transaction (if one was open) has already rolled back — these
    // recovery writes run outside it and auto-commit individually, same as before.
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
        valueDecimal: (transferAmountCents + previousBalanceForRecovery) / 100,
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
        newlyDeferred: !wasAlreadyPendingFunds,
        resultingBalanceCents: transferAmountCents + previousBalanceForRecovery,
        reason: 'insufficient_available_balance',
        paymentRequest: paymentRequestPayment.PaymentRequest || paymentRequest,
        paymentRequestPayment
      })
    }

    throw error
  }
}
