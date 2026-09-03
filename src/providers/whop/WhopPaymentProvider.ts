import { Webhook } from 'standardwebhooks'
import type { PaymentProvider } from '../PaymentProvider'
import type {
  AccountDispute,
  AccountLinkParams,
  AccountLinkResult,
  AccountRequirementItem,
  AccountResult,
  PayoutMethod,
  BountyCheckoutParams,
  BountyCheckoutResult,
  ConnectedAccountActiveParams,
  ConnectedAccountParams,
  CreatePaymentRequestResourcesParams,
  DeactivatePaymentRequestResourcesParams,
  FinalizePaymentRequestResourcesParams,
  InvoiceParams,
  InvoiceResult,
  NormalizedEventType,
  PaymentProviderName,
  PaymentRequestResourceMetadata,
  PaymentRequestResources,
  UpdatePaymentRequestDetailsParams,
  PayoutParams,
  PayoutResult,
  ProviderWebhookEvent,
  RefundParams,
  RefundResult,
  TransferParams,
  TransferResult
} from '../types'
import { getWhopClient, getWhopCompanyId, type WhopClient } from './client'
import { getFrontendHostBase } from './redirectBase'

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
    // Top-level company_id is rejected for company-scoped API keys
    // ("Cannot provide company_id for this configuration"), but inline plan requires
    // plan.company_id (platform WHOP_COMPANY_ID).
    // Create a Product so checkout shows the bounty title (empty product otherwise).
    // Checkout-configuration metadata is copied to payments/memberships (webhook correlation).
    // Do NOT put metadata on the inline plan — Whop rejects many values there.
    const companyId = this.companyId()
    if (!companyId) {
      throw new Error('WHOP_COMPANY_ID is required to create a bounty checkout')
    }

    const rawMeta = params.metadata || {}
    const redirectUrl = rawMeta.return_url || rawMeta.redirect_url || undefined
    const metadata: Record<string, string> = {
      purpose: String(rawMeta.purpose || 'bounty_order')
    }
    if (rawMeta.order_id != null && rawMeta.order_id !== '') {
      metadata.order_id = String(rawMeta.order_id)
    }
    if (rawMeta.task_id != null && rawMeta.task_id !== '') {
      metadata.task_id = String(rawMeta.task_id)
    }

    const productTitle = (params.title || params.description || 'Gitpay bounty').trim().slice(0, 80)
    // Whop plan titles (unlike product titles, which allow 80) are capped at 30 chars.
    const planTitle = productTitle.slice(0, 30)

    const product = await this.client.post<any>('/products', {
      title: productTitle,
      description: params.description || productTitle,
      company_id: companyId
    })

    if (!product?.id) {
      throw new Error('Whop product create failed: missing product id')
    }

    const body: Record<string, unknown> = {
      mode: 'payment',
      metadata,
      plan: {
        company_id: companyId,
        product_id: product.id,
        initial_price: params.amount,
        plan_type: 'one_time',
        currency: params.currency || 'usd',
        title: planTitle,
        description: params.description || productTitle,
        force_create_new_plan: true
      }
    }
    // redirect_url is top-level; Whop requires https:// (not http://localhost)
    if (redirectUrl && String(redirectUrl).startsWith('https://')) {
      body.redirect_url = String(redirectUrl)
    }

    const checkout = await this.client.post<any>('/checkout_configurations', body)

    const planId = checkout.plan?.id || checkout.plan_id
    const purchaseUrl =
      checkout.purchase_url ||
      checkout.checkout_url ||
      checkout.url ||
      (planId ? `https://whop.com/checkout/${planId}` : undefined) ||
      (checkout.id ? `https://whop.com/checkout/${checkout.id}` : undefined)

    return {
      sourceId: checkout.id,
      sessionId: checkout.id,
      paymentUrl: purchaseUrl,
      status: 'open',
      paid: false,
      raw: { ...checkout, product }
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
      company_id: companyId,
      // Payment-request products are reachable via direct link only — keep them off
      // the public Whop storefront listing.
      visibility: 'hidden'
    })

    if (params.custom_amount) {
      // Whop has no reusable open-amount checkout: unlike Stripe's custom_unit_amount,
      // every Whop plan needs a fixed initial_price at creation. Don't create a plan here —
      // a fresh one is minted per payer, for their entered amount, via createCheckoutForAmount
      // once they reach the Gitpay-hosted pay page (payment_url below, finalized with the
      // real id in finalizePaymentRequestResources since it isn't known yet at this point).
      return {
        productId: product.id,
        priceId: '',
        paymentLinkId: product.id,
        paymentUrl: ''
      }
    }

    const planBody: Record<string, unknown> = {
      product_id: product.id,
      account_id: companyId,
      plan_type: 'one_time',
      currency: params.currency || 'usd',
      metadata,
      description: params.description || params.title,
      initial_price: params.amount || 0,
      visibility: 'hidden'
    }

    const plan = await this.client.post<any>('/plans', planBody)

    return {
      productId: product.id,
      priceId: plan.id,
      paymentLinkId: plan.id,
      paymentUrl: plan.purchase_url || `https://whop.com/checkout/${plan.id}`
    }
  }

  async finalizePaymentRequestResources(
    params: FinalizePaymentRequestResourcesParams
  ): Promise<{ paymentUrl?: string } | undefined> {
    if (!params.custom_amount) return undefined
    return {
      paymentUrl: `${getFrontendHostBase()}/#/payment-requests/${params.paymentRequestId}/pay`
    }
  }

  /**
   * Mint a fresh, single-use Whop checkout for a payer-entered amount (Whop custom-amount
   * payment requests). Mirrors createBountyCheckout's inline-plan pattern: metadata stays at
   * the checkout_configuration top level (Whop rejects many values on the inline plan).
   */
  async createCheckoutForAmount(
    context: {
      productId: string
      title: string
      description?: string
      currency?: string
      metadata?: Record<string, unknown>
    },
    amount: number
  ): Promise<{ sessionId: string; purchaseUrl?: string }> {
    const companyId = this.companyId()
    // Whop plan titles (unlike product titles, which allow 80) are capped at 30 chars.
    const title = context.title.slice(0, 30)

    const body: Record<string, unknown> = {
      mode: 'payment',
      metadata: context.metadata || {},
      plan: {
        company_id: companyId,
        product_id: context.productId,
        initial_price: amount,
        plan_type: 'one_time',
        currency: context.currency || 'usd',
        title,
        description: context.description || context.title,
        force_create_new_plan: true,
        visibility: 'hidden'
      }
    }

    const checkout = await this.client.post<any>('/checkout_configurations', body)

    const planId = checkout.plan?.id || checkout.plan_id
    const purchaseUrl =
      checkout.purchase_url ||
      checkout.checkout_url ||
      checkout.url ||
      (planId ? `https://whop.com/checkout/${planId}` : undefined) ||
      (checkout.id ? `https://whop.com/checkout/${checkout.id}` : undefined)

    return {
      sessionId: checkout.id,
      purchaseUrl
    }
  }

  async updatePaymentRequestPaymentLinkMetadata(
    paymentLinkId: string,
    metadata: PaymentRequestResourceMetadata
  ): Promise<unknown> {
    try {
      return await this.client.patch(`/plans/${paymentLinkId}`, {
        metadata: {
          payment_request_id: metadata.payment_request_id ?? null,
          user_id: metadata.user_id ?? null
        }
      })
    } catch (error) {
      // Custom-amount payment requests store a product id (no persistent plan) here —
      // there's nothing to patch until a checkout is minted per payer. Best-effort no-op.
      console.warn('[whop] updatePaymentRequestPaymentLinkMetadata: no plan for id', {
        paymentLinkId,
        error
      })
      return null
    }
  }

  async updatePaymentRequestPaymentLinkActive(
    paymentLinkId: string,
    active: boolean
  ): Promise<unknown> {
    // Whop has no payment-link active flag; archive product visibility via plan stock/visibility when possible.
    // For custom-amount payment requests paymentLinkId is a product id (no persistent plan) —
    // this PATCH best-effort no-ops (caught below); real enforcement is the active check in
    // the public checkout endpoint before a new checkout is ever minted.
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

  async updatePaymentRequestDetails(params: UpdatePaymentRequestDetailsParams): Promise<unknown> {
    const results: unknown[] = []

    if (typeof params.active === 'boolean') {
      results.push(
        await this.updatePaymentRequestPaymentLinkActive(params.paymentLinkId, params.active)
      )
    }

    if (params.title !== undefined || params.description !== undefined) {
      // payment_link_id is normally the Whop plan id; resolve its product for title
      // updates. For custom-amount payment requests there's no persistent plan —
      // payment_link_id is already the product id — so fall back to patching it directly.
      let productId: string | undefined
      let hasPlan = true
      try {
        const plan = await this.client.get<any>(`/plans/${params.paymentLinkId}`)
        productId = plan?.product_id || plan?.product?.id
      } catch (error) {
        hasPlan = false
        productId = params.paymentLinkId
      }

      if (productId) {
        const productBody: Record<string, unknown> = {}
        if (params.title !== undefined) {
          productBody.title = String(params.title).slice(0, 80)
        }
        if (params.description !== undefined) {
          productBody.description = params.description
        }
        results.push(await this.client.patch(`/products/${productId}`, productBody))
      }

      if (hasPlan && (params.description !== undefined || params.title !== undefined)) {
        results.push(
          await this.client.patch(`/plans/${params.paymentLinkId}`, {
            description: params.description ?? params.title
          })
        )
      }
    }

    return results
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
    const refund = await this.client.post<any>(`/payments/${params.paymentReference}/refund`, body)
    // SDK uses POST /payments/{id}/refund - check path
    return {
      refundId: refund.id || refund.refund_id || params.paymentReference,
      status: refund.status,
      raw: refund
    }
  }

  /**
   * Fetch platform ledger available/pending USD (major units).
   * GET /ledger_accounts/{biz_id} — id may be company or ldgr_…
   */
  async getCompanyLedgerBalances(companyId?: string): Promise<{
    ledgerId: string | null
    available: number
    pending: number
    reserve: number
    raw: any
  }> {
    const id = companyId || this.companyId()
    if (!id) {
      return { ledgerId: null, available: 0, pending: 0, reserve: 0, raw: null }
    }
    try {
      const ledger = await this.client.get<any>(`/ledger_accounts/${id}`)
      const usd =
        (ledger.balances || []).find(
          (b: any) => String(b.currency || '').toLowerCase() === 'usd'
        ) || ledger.balances?.[0]
      return {
        ledgerId: ledger.id || null,
        available: Number(usd?.balance ?? 0),
        pending: Number(usd?.pending_balance ?? 0),
        reserve: Number(usd?.reserve_balance ?? 0),
        raw: ledger
      }
    } catch (error) {
      console.warn('[whop] getCompanyLedgerBalances failed', error)
      return { ledgerId: null, available: 0, pending: 0, reserve: 0, raw: null }
    }
  }

  async createTransfer(params: TransferParams): Promise<TransferResult> {
    // Shared callers (PR checkout, bounty transfers) pass amount in cents (Stripe convention).
    // Whop ledger transfers use major currency units (e.g. 18.63).
    const amountMajor = params.amount / 100
    const originId = this.companyId()
    const destinationId = params.destination
    const currency = (params.currency || 'usd').toLowerCase()

    if (!originId) {
      throw new Error('WHOP_COMPANY_ID is required for transfers (platform origin)')
    }
    if (!destinationId) {
      throw new Error('Whop transfer destination (connected company biz_…) is required')
    }

    // Preflight: ledger transfers debit available balance only (not pending).
    // Whop often returns a misleading "Ethereum wallet" error when available is 0.
    const ledger = await this.getCompanyLedgerBalances(originId)
    if (ledger.raw && ledger.available + 1e-9 < amountMajor) {
      const err: any = new Error(
        [
          `Whop platform available balance is insufficient for ledger transfer.`,
          `Need ${amountMajor} ${currency} available; have available=${ledger.available}, pending=${ledger.pending}, reserve=${ledger.reserve}.`,
          `origin_id=${originId} (ledger ${ledger.ledgerId || 'unknown'}), destination_id=${destinationId}.`,
          'Payments usually land in pending for 1–4 days before becoming available.',
          'Sandbox: Whop docs note payouts/transfers may be limited; check sandbox.whop.com Balances',
          'or wait for pending funds to settle / top up available balance.',
          'This is not a crypto/wallet_send issue — we use type=ledger (fiat platform → connected company).'
        ].join(' ')
      )
      err.status = 400
      err.body = {
        error: {
          type: 'insufficient_available_balance',
          available: ledger.available,
          pending: ledger.pending,
          required: amountMajor
        }
      }
      throw err
    }

    // Explicit type: 'ledger' — platform fiat balance → connected company.
    const body: Record<string, unknown> = {
      type: 'ledger',
      amount: amountMajor,
      currency,
      origin_id: originId,
      destination_id: destinationId,
      metadata: params.metadata || {}
    }
    if (params.description) {
      body.notes = params.description
    }
    const paymentRef =
      (params.metadata as any)?.payment_request_payment_id ||
      (params.metadata as any)?.source_payment_id ||
      (params.metadata as any)?.order_id
    if (paymentRef != null) {
      body.idempotence_key = `gitpay_transfer_${paymentRef}`
    }

    try {
      const transfer = await this.client.post<any>('/transfers', body)
      return {
        transferId: transfer.id,
        amount: transfer.amount,
        currency: transfer.currency,
        raw: transfer
      }
    } catch (error: any) {
      const message = String(error?.message || '')
      if (
        message.includes('Ethereum wallet') ||
        message.includes('wallet_send') ||
        message.includes('only supported from') ||
        message.includes('on-chain wallet')
      ) {
        const bal = await this.getCompanyLedgerBalances(originId)
        const err: any = new Error(
          [
            error.message,
            'Whop rejected the ledger transfer (often a misleading error when available fiat balance is 0',
            'or when sandbox does not fully support platform transfers).',
            `origin_id=${originId}, destination_id=${destinationId}, amount=${amountMajor} ${currency}.`,
            `Platform ledger: available=${bal.available}, pending=${bal.pending}, reserve=${bal.reserve}.`,
            'Ledger transfers require available (not pending) USD on the platform company.',
            'Sandbox limitation: docs state payouts may not work yet — try production or wait for settlement.',
            'We send type=ledger (not wallet_send).',
            'insufficient_available_balance'
          ].join(' ')
        )
        err.status = error.status
        err.body = {
          error: {
            type: 'insufficient_available_balance',
            available: bal.available,
            pending: bal.pending,
            required: amountMajor
          }
        }
        throw err
      }
      throw error
    }
  }

  async reverseTransfer(_transferId: string, _params: object = {}): Promise<unknown> {
    // Whop has no direct transfer reverse equivalent in stable API; best-effort no-op.
    console.warn('Whop reverseTransfer is not supported; skipping')
    return null
  }

  async createPayout(params: PayoutParams): Promise<PayoutResult> {
    // Whop withdrawals use major currency units (e.g. 50.00), same as ledger transfers.
    const body: Record<string, unknown> = {
      company_id: params.accountId,
      amount: params.amount,
      currency: (params.currency || 'usd').toLowerCase()
    }
    // Optional: omit when user has a default payout method configured on Whop
    if (params.payoutMethodId) {
      body.payout_method_id = params.payoutMethodId
    }
    if (params.metadata) {
      body.metadata = params.metadata
    }

    // eslint-disable-next-line no-console
    console.log('[whop] createPayout /withdrawals', {
      company_id: body.company_id,
      amount: body.amount,
      currency: body.currency,
      has_payout_method: Boolean(params.payoutMethodId)
    })

    const withdrawal = await this.client.post<any>('/withdrawals', body)
    return {
      payoutId: withdrawal.id || withdrawal.withdrawal_id,
      status: withdrawal.status || 'pending',
      raw: withdrawal
    }
  }

  /**
   * List withdrawals for a connected company — GET /withdrawals?company_id=…,
   * paginated (cursor-based, per @whop/sdk's WithdrawalListParams). Used by the
   * payout reconciliation cron / manual sync script to backfill/correct Payouts
   * the webhook may have missed, since the webhook is otherwise the sole
   * real-time source. `createdAfter` filters to withdrawals created after that
   * unix timestamp (a bounded recent-window pass); omit for a full-history walk.
   * `pageCursor` continues a previous page — response field names for cursor/
   * page-info are best-effort (multiple aliases checked) pending confirmation
   * against a real paginated response.
   */
  async listWithdrawals(
    companyId: string,
    options: { createdAfter?: number; first?: number; pageCursor?: string } = {}
  ): Promise<{ withdrawals: any[]; hasMore: boolean; endCursor: string | null }> {
    const params = new URLSearchParams({ company_id: companyId })
    if (options.createdAfter) params.set('created_after', String(options.createdAfter))
    if (options.first) params.set('first', String(options.first))
    if (options.pageCursor) params.set('after', options.pageCursor)

    const response = await this.client.get<any>(`/withdrawals?${params.toString()}`)
    const withdrawals: any[] = Array.isArray(response)
      ? response
      : (response?.data ?? response?.withdrawals ?? [])
    const pageInfo = response?.page_info || response?.pageInfo || {}

    return {
      withdrawals,
      hasMore: Boolean(pageInfo.has_next_page ?? pageInfo.hasNextPage ?? false),
      endCursor: pageInfo.end_cursor ?? pageInfo.endCursor ?? null
    }
  }

  /** Fetch a single withdrawal — GET /withdrawals/{id}. */
  async getWithdrawal(withdrawalId: string): Promise<any> {
    return this.client.get<any>(`/withdrawals/${encodeURIComponent(withdrawalId)}`)
  }

  async createConnectedAccount(params: ConnectedAccountParams): Promise<AccountResult> {
    const email = params.email != null ? String(params.email).trim().toLowerCase() : ''
    if (!email || !email.includes('@')) {
      const err: any = new Error('Whop connected account requires a valid user email (Users.email)')
      err.status = 422
      throw err
    }

    const title =
      (params.title && String(params.title).trim()) ||
      (params.metadata?.title && String(params.metadata.title).trim()) ||
      email

    const body: Record<string, unknown> = {
      email,
      parent_company_id: this.companyId(),
      title,
      metadata: {
        ...(params.metadata || {}),
        // Keep title in metadata for ops / debugging
        title
      }
    }

    // Whop requires lowercase ISO 3166-1 alpha-2 (e.g. us, br, gb) — not uppercase
    if (params.country) {
      body.country = String(params.country).trim().toLowerCase()
    }

    // eslint-disable-next-line no-console
    console.log('[whop] createConnectedAccount', {
      email,
      emailLength: email.length,
      country: body.country,
      title,
      parent_company_id: body.parent_company_id,
      baseUrl: process.env.WHOP_API_BASE_URL || process.env.WHOP_SANDBOX || 'production-default'
    })

    try {
      const company = await this.client.post<any>('/companies', body)
      return {
        accountId: company.id,
        raw: company
      }
    } catch (error: any) {
      const bodyMessage = String(error?.body?.error?.message || '')
      const message = String(error?.message || '')
      // Whop enforces a title/name uniqueness constraint scoped to the parent company —
      // this fires whenever a connected company with this exact title already exists under
      // WHOP_COMPANY_ID (almost always an orphan from an earlier attempt by the same user,
      // since the title is generated deterministically from the Gitpay profile).
      if (/already created an account with the same name/i.test(bodyMessage || message)) {
        const err: any = new Error(message)
        err.code = 'whop_account_name_conflict'
        err.status = error.status
        err.body = error.body
        err.title = title
        throw err
      }
      // Whop validates deliverability (MX / "real" mailbox), not only format.
      if (message.toLowerCase().includes('email') || message.toLowerCase().includes('mail')) {
        const err: any = new Error(
          [
            `Whop rejected email "${email}" when creating the connected company.`,
            error.message,
            'Whop requires a deliverable address (not format-only).',
            'Use a real inbox on the Gitpay user (Users.email) — temporary, disposable, or no-reply addresses are often rejected.',
            'Confirm the logged email matches the signed-in user profile.'
          ].join(' ')
        )
        err.status = error.status || 400
        err.body = error.body
        err.email = email
        throw err
      }
      throw error
    }
  }

  /**
   * Find a connected company already enrolled under our own platform (`parent_company_id`)
   * matching this Gitpay user — used to recover from the title/name uniqueness conflict in
   * `createConnectedAccount` (see `err.code === 'whop_account_name_conflict'`), which almost
   * always means an orphaned company from an earlier attempt already exists for this user.
   * Never searches outside our own platform's connected accounts.
   */
  async findConnectedAccountForUser(params: {
    title: string
    gitpayUserId: string
    email?: string
  }): Promise<AccountResult | null> {
    const { title, gitpayUserId, email } = params
    let cursor: string | undefined
    let titleOnlyMatch: any = null

    for (let page = 0; page < 10; page++) {
      const query = new URLSearchParams({ parent_company_id: this.companyId(), first: '50' })
      if (cursor) query.set('after', cursor)

      const response = await this.client.get<any>(`/companies?${query.toString()}`)
      const companies: any[] = Array.isArray(response) ? response : (response?.data ?? [])

      for (const company of companies) {
        const metadata = company?.metadata || {}
        const sameTitle = company?.title === title
        const sameUser = String(metadata.gitpay_user_id || '') === gitpayUserId

        if (sameTitle && sameUser) {
          return { accountId: company.id, raw: company }
        }
        if (sameTitle && !titleOnlyMatch) {
          // Sanity-check against email when we have no metadata match, so we never
          // hand back a title collision that belongs to a different person.
          if (!email || !metadata.email || metadata.email === email) {
            titleOnlyMatch = company
          }
        }
      }

      const pageInfo = response?.page_info || response?.pageInfo || {}
      const hasMore = Boolean(pageInfo.has_next_page ?? pageInfo.hasNextPage ?? false)
      cursor = pageInfo.end_cursor ?? pageInfo.endCursor ?? undefined
      if (!hasMore || !cursor) break
    }

    return titleOnlyMatch ? { accountId: titleOnlyMatch.id, raw: titleOnlyMatch } : null
  }

  async createAccountLink(params: AccountLinkParams): Promise<AccountLinkResult> {
    try {
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
    } catch (error: any) {
      const message = String(error?.message || '')
      // Whop often returns this when the key is an App key, not a Company/Account key,
      // or when the key belongs to a different company than WHOP_COMPANY_ID / the sub-merchant parent.
      if (message.includes('company:balance:read') || message.includes('not authorized to scope')) {
        const err: any = new Error(
          [
            error.message,
            'Whop account_links requires a Company (Account) API key for the platform company',
            `(WHOP_COMPANY_ID=${this.companyId() || 'unset'}) that can act on sub-merchant ${params.accountId}.`,
            'If the verify script works but Gitpay fails, restart the API process so it reloads WHOP_API_KEY from .env',
            '(dotenv only loads at process start; a long-running nodemon process may still hold an old key).',
            'Use Developer → Company / Account API Keys, ensure WHOP_API_KEY matches that company,',
            'and that the user company was created with parent_company_id set to WHOP_COMPANY_ID.'
          ].join(' ')
        )
        err.status = error.status
        err.body = error.body
        throw err
      }
      throw error
    }
  }

  /**
   * List payout methods (bank/card/crypto) configured for a connected company.
   * GET /payout_methods?company_id=… — a top-level resource scoped by query param, NOT
   * nested under /companies/{id} (see https://docs.whop.com/api-reference/payout-methods/list-payout-methods).
   * Best-effort: on any failure we return [] so the UI shows a "managed on Whop" empty
   * state rather than an error.
   */
  async getPayoutMethods(accountId: string): Promise<PayoutMethod[]> {
    const id = accountId || this.companyId()
    if (!id) return []
    try {
      const response = await this.client.get<any>(
        `/payout_methods?company_id=${encodeURIComponent(id)}`
      )
      const list: any[] = Array.isArray(response)
        ? response
        : response?.data || response?.payout_methods || []
      return list.map((m: any) => {
        // Real schema: id, nickname, institution_name, account_reference (masked, e.g.
        // "****1234"), currency, is_default, destination: { category, name, country_code }.
        const maskedDigits =
          typeof m.account_reference === 'string' ? m.account_reference.replace(/\D/g, '') : ''
        return {
          id: m.id || m.payout_method_id,
          type: m.destination?.category || m.type || m.method_type || null,
          label: m.nickname || m.institution_name || m.destination?.name || m.label || null,
          last4: maskedDigits || m.last4 || m.last_four || null,
          currency: m.currency || null,
          default: Boolean(m.is_default ?? m.default),
          raw: m
        }
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('[whop] getPayoutMethods failed', error)
      return []
    }
  }

  /**
   * Disputes are delivered to Gitpay via webhooks (dispute.created/updated), not
   * fetched per company. No account-scoped list endpoint is used, so return [].
   */
  async getDisputes(_accountId: string): Promise<AccountDispute[]> {
    return []
  }

  /**
   * Derive the Payout Settings requirements checklist from data already fetched.
   * Does not call additional Whop endpoints — statuses come from the company object
   * plus whether a payout method exists.
   */
  buildRequirements(company: any, payoutMethods: PayoutMethod[]): AccountRequirementItem[] {
    const verified = company?.verified
    const hasProfile = Boolean(
      (company?.title || company?.name) && company?.country && company?.email
    )
    const hasPayoutMethod = Array.isArray(payoutMethods) && payoutMethods.length > 0
    return [
      { key: 'identity_document', status: verified === true ? 'done' : 'required' },
      { key: 'payout_method', status: hasPayoutMethod ? 'done' : 'required' },
      { key: 'company_profile', status: hasProfile ? 'done' : 'required' },
      { key: 'gitpay_connection', status: company?.parent_company_id ? 'done' : 'pending' }
    ]
  }

  /**
   * Whop KYC and payout methods are managed on the Whop portal. `payouts_enabled` (set in
   * userAccount.ts) already combines Whop's payout-capability/verified signal with an
   * explicit check that a payout method has been linked — both are required for "active".
   */
  isConnectedAccountActive(account: ConnectedAccountActiveParams | null | undefined): boolean {
    if (!account?.id) return false
    return Boolean((account as any)?.payouts_enabled)
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
      // One-time plan checkouts often grant access via membership events
      'membership.activated': 'payment.succeeded',
      'membership.went_valid': 'payment.succeeded',
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
