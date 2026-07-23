import type { PaymentProvider } from '../PaymentProvider'
import type {
  AccountLinkParams,
  AccountLinkResult,
  AccountResult,
  BountyCheckoutParams,
  BountyCheckoutResult,
  ConnectedAccountActiveParams,
  ConnectedAccountParams,
  CreatePaymentRequestResourcesParams,
  DeactivatePaymentRequestResourcesParams,
  InvoiceParams,
  InvoiceResult,
  NormalizedEventType,
  PaymentProviderName,
  PaymentRequestResourceMetadata,
  PaymentRequestResources,
  PayoutParams,
  PayoutResult,
  ProviderWebhookEvent,
  RefundParams,
  RefundResult,
  TransferParams,
  TransferResult
} from '../types'
import { getStripeClient } from '../../provider/stripe/client'
import {
  createPaymentRequestStripeResources,
  deactivatePaymentRequestStripeResources,
  updatePaymentRequestPaymentLinkActive,
  updatePaymentRequestPaymentLinkMetadata
} from '../../mutations/provider/stripe/payment-request'
import {
  createTransfer as createStripeTransfer,
  createTransferReversal
} from '../../mutations/provider/stripe/transfer'

/**
 * Stripe implementation of PaymentProvider.
 * Delegates to existing Stripe client/mutations so behavior stays identical.
 */
export class StripePaymentProvider implements PaymentProvider {
  readonly name: PaymentProviderName = 'stripe'

  private static instance: StripePaymentProvider | null = null

  static getInstance(): StripePaymentProvider {
    if (!StripePaymentProvider.instance) {
      StripePaymentProvider.instance = new StripePaymentProvider()
    }
    return StripePaymentProvider.instance
  }

  static resetInstance(): void {
    StripePaymentProvider.instance = null
  }

  async createBountyCheckout(params: BountyCheckoutParams): Promise<BountyCheckoutResult> {
    const stripe = getStripeClient()

    if (!params.sourceId) {
      throw new Error('stripe_bounty_checkout_requires_source_id')
    }

    let customerId = params.customerId
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: params.customerEmail
      })
      customerId = customer.id
    }

    const card = await stripe.customers.createSource(customerId, {
      source: params.sourceId
    })

    const charge = await stripe.charges.create({
      amount: Math.round(params.amount * 100),
      currency: params.currency,
      customer: customerId,
      source: card.id,
      transfer_group: params.transferGroup,
      metadata: params.metadata
    })

    return {
      sourceId: card.id,
      paymentId: charge.id,
      status: charge.status,
      paid: charge.paid,
      raw: { charge, card, customerId }
    }
  }

  async createInvoice(params: InvoiceParams): Promise<InvoiceResult> {
    const stripe = getStripeClient()

    let customerId = params.customerId
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: params.customerEmail,
        name: params.customerName
      })
      customerId = customer.id
    }

    const daysUntilDue = params.dueDays ?? 30
    const invoice = await stripe.invoices.create({
      customer: customerId,
      collection_method: 'send_invoice',
      days_until_due: daysUntilDue,
      metadata: params.metadata
    })

    const unitAmount = Math.round(params.amount * 100)
    const invoiceItem = await stripe.invoiceItems.create({
      customer: customerId,
      currency: params.currency,
      quantity: 1,
      description: params.description,
      unit_amount: unitAmount,
      invoice: invoice.id,
      metadata: params.metadata
    })

    if (!invoiceItem?.id) {
      throw new Error('Failed to create invoice item')
    }

    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id)
    if (!finalizedInvoice?.id) {
      throw new Error('Failed to finalize invoice')
    }

    // Keep legacy behavior: always call sendInvoice (tests nock this path).
    await stripe.invoices.sendInvoice(invoice.id)

    return {
      invoiceId: finalizedInvoice.id,
      status: finalizedInvoice.status || invoice.status || 'open',
      hostedUrl: finalizedInvoice.hosted_invoice_url || null,
      dueDate: finalizedInvoice.due_date
        ? new Date(finalizedInvoice.due_date * 1000).toISOString()
        : null,
      invoiceItemId: invoiceItem.id,
      raw: finalizedInvoice
    }
  }

  async createPaymentRequestResources(
    params: CreatePaymentRequestResourcesParams
  ): Promise<PaymentRequestResources> {
    return createPaymentRequestStripeResources(params)
  }

  async updatePaymentRequestPaymentLinkMetadata(
    paymentLinkId: string,
    metadata: PaymentRequestResourceMetadata
  ): Promise<unknown> {
    return updatePaymentRequestPaymentLinkMetadata(paymentLinkId, metadata)
  }

  async updatePaymentRequestPaymentLinkActive(
    paymentLinkId: string,
    active: boolean
  ): Promise<unknown> {
    return updatePaymentRequestPaymentLinkActive(paymentLinkId, active)
  }

  async deactivatePaymentRequestResources(
    resources: DeactivatePaymentRequestResourcesParams
  ): Promise<void> {
    await deactivatePaymentRequestStripeResources(resources)
  }

  async refund(params: RefundParams): Promise<RefundResult> {
    const stripe = getStripeClient()
    const refundParams: { charge: string; amount?: number } = {
      charge: params.paymentReference
    }
    if (typeof params.amountCents === 'number') {
      refundParams.amount = params.amountCents
    }
    const refund = await stripe.refunds.create(refundParams)
    if (!refund?.id) {
      throw new Error('stripe_refund_failed')
    }
    return {
      refundId: refund.id,
      status: refund.status || undefined,
      raw: refund
    }
  }

  async createTransfer(params: TransferParams): Promise<TransferResult> {
    const transferData: any = {
      amount: params.amount,
      currency: params.currency,
      destination: params.destination,
      description: params.description,
      metadata: params.metadata || {},
      transfer_group: params.transferGroup
    }
    if (params.sourceTransaction) {
      transferData.source_transaction = params.sourceTransaction
    }

    const transfer = await createStripeTransfer(transferData)
    if (!transfer?.id) {
      throw new Error('Failed to create transfer')
    }
    return {
      transferId: transfer.id,
      amount: transfer.amount,
      currency: transfer.currency,
      raw: transfer
    }
  }

  async reverseTransfer(transferId: string, params: object = {}): Promise<unknown> {
    return createTransferReversal(transferId, params as any)
  }

  async createPayout(params: PayoutParams): Promise<PayoutResult> {
    const stripe = getStripeClient()
    const payout = await stripe.payouts.create(
      {
        amount: Math.round(params.amount * 100),
        currency: params.currency,
        metadata: params.metadata
      },
      {
        stripeAccount: params.accountId
      }
    )
    return {
      payoutId: payout.id,
      status: payout.status,
      raw: payout
    }
  }

  async createConnectedAccount(params: ConnectedAccountParams): Promise<AccountResult> {
    const stripe = getStripeClient()
    const account = await stripe.accounts.create({
      type: (params.type as any) || 'express',
      email: params.email,
      country: params.country,
      metadata: params.metadata
    })
    return {
      accountId: account.id,
      raw: account
    }
  }

  async createAccountLink(params: AccountLinkParams): Promise<AccountLinkResult> {
    const stripe = getStripeClient()
    const link = await stripe.accountLinks.create({
      account: params.accountId,
      refresh_url: params.refreshUrl,
      return_url: params.returnUrl,
      type: (params.type as any) || 'account_onboarding'
    })
    return {
      url: link.url,
      raw: link
    }
  }

  isConnectedAccountActive(account: ConnectedAccountActiveParams | null | undefined): boolean {
    if (!account?.id) return false
    const disabledReason = account.requirements?.disabled_reason
    if (typeof disabledReason === 'string' && disabledReason.startsWith('rejected')) {
      return false
    }
    if ((account.requirements?.currently_due?.length || 0) > 0) {
      return false
    }
    return true
  }

  async verifyAndParseWebhook(
    req: { body: any; headers: Record<string, any> },
    kind: 'platform' | 'connect' = 'platform'
  ): Promise<ProviderWebhookEvent> {
    const stripe = getStripeClient()
    const sig = req.headers['stripe-signature']
    const secret =
      kind === 'connect'
        ? process.env.STRIPE_WEBHOOK_SECRET_CONNECT
        : process.env.STRIPE_WEBHOOK_SECRET_PLATFORM

    let event: any

    if (process.env.NODE_ENV === 'test') {
      event =
        typeof req.body === 'string' || Buffer.isBuffer(req.body)
          ? JSON.parse(req.body.toString())
          : req.body
    } else {
      event = stripe.webhooks.constructEvent(req.body, sig, secret as string)
    }

    return {
      provider: 'stripe',
      type: event.type,
      id: event.id,
      data: event.data,
      raw: event
    }
  }

  mapEventType(rawType: string): NormalizedEventType | null {
    const map: Record<string, NormalizedEventType> = {
      'checkout.session.completed': 'checkout.completed',
      'checkout.session.async_payment_succeeded': 'checkout.completed',
      'charge.succeeded': 'payment.succeeded',
      'charge.failed': 'payment.failed',
      'charge.refunded': 'payment.refunded',
      'invoice.created': 'invoice.created',
      'invoice.paid': 'invoice.paid',
      'invoice.payment_succeeded': 'invoice.paid',
      'invoice.payment_failed': 'invoice.failed',
      'transfer.created': 'transfer.created',
      'transfer.reversed': 'transfer.reversed',
      'payout.created': 'payout.created',
      'payout.updated': 'payout.updated',
      'payout.paid': 'payout.paid',
      'payout.failed': 'payout.failed',
      'charge.dispute.created': 'dispute.created',
      'charge.dispute.closed': 'dispute.closed',
      'charge.dispute.funds_withdrawn': 'dispute.funds_withdrawn'
    }
    return map[rawType] || null
  }
}
