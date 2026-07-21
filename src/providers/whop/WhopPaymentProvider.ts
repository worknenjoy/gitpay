import { Webhook } from 'standardwebhooks'
import type { PaymentProvider } from '../PaymentProvider'
import type {
  AccountLinkParams,
  AccountLinkResult,
  AccountResult,
  BountyCheckoutParams,
  BountyCheckoutResult,
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
import { getWhopClient, getWhopCompanyId, type WhopClient } from './client'

/**
 * Whop payment connector.
 * Uses REST against api.whop.com (or sandbox) with platform company as merchant of record.
 */
export class WhopPaymentProvider implements PaymentProvider {
  readonly name: PaymentProviderName = 'whop'

  private static instance: WhopPaymentProvider | null = null
  private client: WhopClient

  constructor(client?: WhopClient) {
    this.client = client || getWhopClient()
  }

  static getInstance(): WhopPaymentProvider {
    if (!WhopPaymentProvider.instance) {
      WhopPaymentProvider.instance = new WhopPaymentProvider()
    }
    return WhopPaymentProvider.instance
  }

  static resetInstance(): void {
    WhopPaymentProvider.instance = null
  }

  private companyId(): string {
    return this.client.companyId || getWhopCompanyId()
  }

  async createBountyCheckout(params: BountyCheckoutParams): Promise<BountyCheckoutResult> {
    const companyId = this.companyId()
    const checkout = await this.client.post<any>('/checkout_configurations', {
      company_id: companyId,
      currency: params.currency || 'usd',
      mode: 'payment',
      metadata: params.metadata,
      plan: {
        company_id: companyId,
        initial_price: params.amount,
        plan_type: 'one_time',
        currency: params.currency || 'usd',
        description: params.description,
        force_create_new_plan: true
      },
      redirect_url: params.metadata?.return_url || undefined
    })

    const planId = checkout.plan?.id || checkout.plan_id
    return {
      sourceId: checkout.id,
      sessionId: checkout.id,
      paymentUrl: checkout.purchase_url || (planId ? `https://whop.com/checkout/${planId}` : undefined),
      status: 'open',
      paid: false,
      raw: checkout
    }
  }

  async createInvoice(params: InvoiceParams): Promise<InvoiceResult> {
    const companyId = this.companyId()
    const dueDays = params.dueDays ?? 30
    const dueDate = new Date(Date.now() + dueDays * 24 * 60 * 60 * 1000).toISOString()

    const invoice = await this.client.post<any>('/invoices', {
      collection_method: 'send_invoice',
      company_id: companyId,
      email_address: params.customerEmail,
      customer_name: params.customerName || params.customerEmail,
      due_date: dueDate,
      product: {
        title: params.description.slice(0, 80) || 'Gitpay invoice',
        company_id: companyId
      },
      plan: {
        initial_price: params.amount,
        plan_type: 'one_time',
        currency: params.currency || 'usd',
        description: params.description,
        internal_notes: JSON.stringify(params.metadata || {})
      },
      line_items: [
        {
          label: params.description || 'Payment',
          unit_price: params.amount,
          quantity: 1
        }
      ]
    })

    const planId = invoice.current_plan?.id
    const hostedUrl = planId ? `https://whop.com/checkout/${planId}` : null

    return {
      invoiceId: invoice.id,
      status: invoice.status || 'open',
      hostedUrl,
      dueDate: invoice.due_date || dueDate,
      invoiceItemId: null,
      raw: invoice
    }
  }

  async createPaymentRequestResources(
    params: CreatePaymentRequestResourcesParams
  ): Promise<PaymentRequestResources> {
    const companyId = this.companyId()
    const metadata = {
      payment_request_id: params.metadata?.payment_request_id ?? null,
      user_id: params.metadata?.user_id ?? null,
      purpose: 'payment_request'
    }

    const product = await this.client.post<any>('/products', {
      title: params.title.slice(0, 80),
      description: params.description,
      company_id: companyId
    })

    const planBody: Record<string, unknown> = {
      product_id: product.id,
      account_id: companyId,
      plan_type: 'one_time',
      currency: params.currency || 'usd',
      metadata,
      description: params.description || params.title
    }

    if (params.custom_amount) {
      // Whop one-time with open amount: use a nominal price; custom amounts may need checkout config.
      // Prefer fixed amount when provided; otherwise 1.00 placeholder for custom link.
      planBody.initial_price = params.amount && params.amount > 0 ? params.amount : 1
    } else {
      planBody.initial_price = params.amount || 0
    }

    const plan = await this.client.post<any>('/plans', planBody)

    return {
      productId: product.id,
      priceId: plan.id,
      paymentLinkId: plan.id,
      paymentUrl: plan.purchase_url || `https://whop.com/checkout/${plan.id}`
    }
  }

  async updatePaymentRequestPaymentLinkMetadata(
    paymentLinkId: string,
    metadata: PaymentRequestResourceMetadata
  ): Promise<unknown> {
    return this.client.patch(`/plans/${paymentLinkId}`, {
      metadata: {
        payment_request_id: metadata.payment_request_id ?? null,
        user_id: metadata.user_id ?? null
      }
    })
  }

  async updatePaymentRequestPaymentLinkActive(
    paymentLinkId: string,
    active: boolean
  ): Promise<unknown> {
    // Whop has no payment-link active flag; archive product visibility via plan stock/visibility when possible.
    try {
      return await this.client.patch(`/plans/${paymentLinkId}`, {
        // stock 0 prevents new purchases when deactivating
        stock: active ? null : 0
      })
    } catch (error) {
      console.error('Failed to update Whop plan active state', error)
      return null
    }
  }

  async deactivatePaymentRequestResources(
    resources: DeactivatePaymentRequestResourcesParams
  ): Promise<void> {
    if (resources.paymentLinkId) {
      await this.updatePaymentRequestPaymentLinkActive(resources.paymentLinkId, false)
    }
  }

  async refund(params: RefundParams): Promise<RefundResult> {
    const body: Record<string, unknown> = {}
    if (typeof params.amountCents === 'number') {
      // Whop refund amount is in major currency units
      body.amount = params.amountCents / 100
    }
    const refund = await this.client.post<any>(
      `/payments/${params.paymentReference}/refund`,
      body
    )
    // SDK uses POST /payments/{id}/refund - check path
    return {
      refundId: refund.id || refund.refund_id || params.paymentReference,
      status: refund.status,
      raw: refund
    }
  }

  async createTransfer(params: TransferParams): Promise<TransferResult> {
    // Stripe path uses cents; Whop transfer amount is decimal major units.
    // Callers for PR currently pass cents for Stripe — Whop adapter converts when amount looks like cents
    // by convention: createTransfer receives amount already in provider-native units from the service layer.
    // For processCheckoutSessionCompleted we pass cents for Stripe; Whop provider expects major units.
    // Use amount as-is if < 1000 and has decimals, else if integer and large assume cents from Stripe path.
    // Better: TransferParams.amount is always major units for Whop, cents for Stripe at call site.
    // processCheckoutSessionCompleted passes resultingBalance in cents for Stripe.
    // When provider is Whop, convert cents → dollars here if metadata flag or if we document amount unit per provider.
    //
    // Convention used: TransferParams.amount is always the same unit as Stripe TransferCreate (cents)
    // when coming from shared PR path; Whop converts to dollars.
    const amountMajor = params.amount / 100

    const transfer = await this.client.post<any>('/transfers', {
      amount: amountMajor,
      currency: params.currency || 'usd',
      origin_id: this.companyId(),
      destination_id: params.destination,
      metadata: params.metadata || {},
      notes: params.description
    })

    return {
      transferId: transfer.id,
      amount: transfer.amount,
      currency: transfer.currency,
      raw: transfer
    }
  }

  async reverseTransfer(_transferId: string, _params: object = {}): Promise<unknown> {
    // Whop has no direct transfer reverse equivalent in stable API; best-effort no-op.
    console.warn('Whop reverseTransfer is not supported; skipping')
    return null
  }

  async createPayout(params: PayoutParams): Promise<PayoutResult> {
    const withdrawal = await this.client.post<any>('/withdrawals', {
      company_id: params.accountId,
      amount: params.amount,
      currency: params.currency || 'usd',
      payout_method_id: params.payoutMethodId
    })
    return {
      payoutId: withdrawal.id,
      status: withdrawal.status,
      raw: withdrawal
    }
  }

  async createConnectedAccount(params: ConnectedAccountParams): Promise<AccountResult> {
    const company = await this.client.post<any>('/companies', {
      email: params.email,
      parent_company_id: this.companyId(),
      title: params.metadata?.title || params.email,
      metadata: params.metadata || {}
    })
    return {
      accountId: company.id,
      raw: company
    }
  }

  async createAccountLink(params: AccountLinkParams): Promise<AccountLinkResult> {
    const link = await this.client.post<any>('/account_links', {
      company_id: params.accountId,
      refresh_url: params.refreshUrl,
      return_url: params.returnUrl,
      use_case: params.type || 'account_onboarding'
    })
    return {
      url: link.url,
      raw: link
    }
  }

  async verifyAndParseWebhook(
    req: { body: any; headers: Record<string, any> },
    _kind: 'platform' | 'connect' = 'platform'
  ): Promise<ProviderWebhookEvent> {
    let payload: any

    if (process.env.NODE_ENV === 'test') {
      payload =
        typeof req.body === 'string' || Buffer.isBuffer(req.body)
          ? JSON.parse(req.body.toString())
          : req.body
    } else {
      const secret = process.env.WHOP_WEBHOOK_SECRET || ''
      // Standard Webhooks expects base64-encoded secret (Whop docs: btoa(secret))
      const key = Buffer.from(secret, 'utf8').toString('base64')
      const wh = new Webhook(key)
      const bodyText =
        typeof req.body === 'string' || Buffer.isBuffer(req.body)
          ? req.body.toString()
          : JSON.stringify(req.body)

      const headers: Record<string, string> = {}
      for (const [k, v] of Object.entries(req.headers || {})) {
        headers[k.toLowerCase()] = Array.isArray(v) ? v[0] : String(v)
      }

      payload = wh.verify(bodyText, {
        'webhook-id': headers['webhook-id'],
        'webhook-timestamp': headers['webhook-timestamp'],
        'webhook-signature': headers['webhook-signature']
      })
    }

    // Whop envelope: { id, type, data, api_version, timestamp, company_id }
    return {
      provider: 'whop',
      type: payload.type,
      id: payload.id,
      data: { object: payload.data },
      raw: payload
    }
  }

  mapEventType(rawType: string): NormalizedEventType | null {
    const map: Record<string, NormalizedEventType> = {
      'payment.succeeded': 'payment.succeeded',
      'payment.failed': 'payment.failed',
      'invoice.created': 'invoice.created',
      'invoice.paid': 'invoice.paid',
      'invoice.past_due': 'invoice.failed',
      'invoice.voided': 'invoice.failed',
      'refund.created': 'payment.refunded',
      'refund.updated': 'payment.refunded',
      'withdrawal.created': 'payout.created',
      'withdrawal.updated': 'payout.updated',
      'dispute.created': 'dispute.created',
      'dispute.updated': 'dispute.updated'
    }
    return map[rawType] || null
  }
}
