/**
 * Shared DTOs for multi-provider payment connectors (Stripe, Whop, …).
 * Provider-specific IDs are stored as opaque strings on domain models.
 */

export type PaymentProviderName = 'stripe' | 'whop'

export type PaymentRequestResourceMetadata = {
  payment_request_id?: number | string | null
  user_id?: number | string | null
}

export type CreatePaymentRequestResourcesParams = {
  title: string
  description?: string
  currency: string
  amount?: number
  custom_amount?: boolean
  metadata?: PaymentRequestResourceMetadata
}

export type PaymentRequestResources = {
  productId: string
  priceId: string
  paymentLinkId: string
  paymentUrl: string
}

export type FinalizePaymentRequestResourcesParams = {
  paymentLinkId: string
  paymentRequestId: number | string
  custom_amount?: boolean
}

/** Sync payment-request title/description/active to the provider checkout resource */
export type UpdatePaymentRequestDetailsParams = {
  paymentLinkId: string
  active?: boolean
  title?: string
  description?: string | null
}

export type BountyCheckoutParams = {
  amount: number
  currency: string
  /** Customer-facing product/checkout title (e.g. issue bounty title) */
  title?: string
  description?: string
  metadata: Record<string, string>
  customerEmail?: string
  /** Stripe-only legacy: card token / source id for immediate charge */
  sourceId?: string
  customerId?: string
  transferGroup?: string
}

export type BountyCheckoutResult = {
  /** Provider payment/session id to store on Order.source_id */
  sourceId: string
  /** Charge / payment id when paid immediately (Stripe charges) */
  paymentId?: string
  status: string
  paid?: boolean
  sessionId?: string
  paymentUrl?: string
  raw?: unknown
}

export type InvoicePurpose = 'bounty_order' | 'wallet_topup'

export type InvoiceParams = {
  purpose: InvoicePurpose
  amount: number
  currency: string
  customerEmail: string
  customerName?: string
  customerId?: string
  dueDays?: number
  description: string
  metadata: Record<string, string>
}

export type InvoiceResult = {
  invoiceId: string
  status: string
  hostedUrl?: string | null
  dueDate?: string | null
  /** Stripe invoice-item id when applicable */
  invoiceItemId?: string | null
  raw?: unknown
}

export type RefundParams = {
  /**
   * Provider payment reference:
   * - Stripe: charge id (`ch_…`) or payment intent id (`pi_…`)
   * - Whop: payment id (`pay_…`)
   */
  paymentReference: string
  amountCents?: number
  metadata?: Record<string, string>
}

export type RefundResult = {
  refundId: string
  status?: string
  raw?: unknown
}

export type TransferParams = {
  amount: number
  currency: string
  destination: string
  description?: string
  metadata?: Record<string, string | number | null | undefined>
  /** Stripe: charge id for source_transaction */
  sourceTransaction?: string
  transferGroup?: string
}

export type TransferResult = {
  transferId: string
  amount?: number
  currency?: string
  raw?: unknown
}

export type PayoutParams = {
  amount: number
  currency: string
  /** Connected account / company id */
  accountId: string
  metadata?: Record<string, string>
  payoutMethodId?: string
}

export type PayoutResult = {
  payoutId: string
  status?: string
  raw?: unknown
}

export type ConnectedAccountParams = {
  email: string
  country?: string
  /** Display name for the connected account / company */
  title?: string
  metadata?: Record<string, string>
  type?: string
}

export type AccountResult = {
  accountId: string
  raw?: unknown
}

/**
 * Normalized connected-account readiness for payouts / payment requests.
 * Providers evaluate their native account payload into this shape.
 */
export type ConnectedAccountActiveParams = {
  /** Provider account id when present */
  id?: string | null
  requirements?: {
    currently_due?: string[]
    disabled_reason?: string | null
  } | null
  charges_enabled?: boolean
  payouts_enabled?: boolean
  details_submitted?: boolean
  [key: string]: unknown
}

/**
 * Normalized payout account detail structures used by the Payout Settings UI.
 * Providers derive these from their native account payloads; missing data is
 * expressed as `pending`/`null` rather than fabricated.
 */
export type AccountRequirementStatus = 'done' | 'required' | 'pending'

export type AccountRequirementItem = {
  /** Stable key, e.g. 'identity_document', 'payout_method', 'company_profile', 'gitpay_connection' */
  key: string
  status: AccountRequirementStatus
}

export type PayoutMethod = {
  id: string
  /** e.g. 'bank_account', 'card', 'crypto' */
  type?: string | null
  label?: string | null
  last4?: string | null
  currency?: string | null
  default?: boolean
  raw?: unknown
}

export type AccountIdentity = {
  legalName?: string | null
  accountType?: string | null
  taxForm?: string | null
  /** 'verified' | 'unverified' | 'pending' */
  identityCheck?: string | null
}

export type AccountDispute = {
  id: string
  status?: string | null
  amount?: number | null
  currency?: string | null
  reason?: string | null
  created_at?: string | null
  raw?: unknown
}

export type AccountLinkParams = {
  accountId: string
  refreshUrl: string
  returnUrl: string
  type?: string
}

export type AccountLinkResult = {
  url: string
  raw?: unknown
}

/** Domain-level webhook event types shared across providers */
export type NormalizedEventType =
  | 'checkout.completed'
  | 'payment.succeeded'
  | 'payment.failed'
  | 'invoice.created'
  | 'invoice.paid'
  | 'invoice.failed'
  | 'payment.refunded'
  | 'transfer.created'
  | 'transfer.reversed'
  | 'payout.created'
  | 'payout.updated'
  | 'payout.paid'
  | 'payout.failed'
  | 'dispute.created'
  | 'dispute.updated'
  | 'dispute.closed'
  | 'dispute.funds_withdrawn'

export type ProviderWebhookEvent = {
  provider: PaymentProviderName
  /** Original provider event type string */
  type: string
  id?: string
  data: {
    object: any
  }
  /** Full raw event for provider-specific handlers */
  raw: any
}

export type NormalizedCheckoutSession = {
  paymentLinkId: string
  paymentId: string
  amountTotalCents: number
  currency: string
  paymentStatus: string
  customer: { name?: string; email?: string }
  chargeId?: string
  metadata: Record<string, string>
  raw: unknown
}

export type DeactivatePaymentRequestResourcesParams = {
  productId?: string
  priceId?: string
  paymentLinkId?: string
}
