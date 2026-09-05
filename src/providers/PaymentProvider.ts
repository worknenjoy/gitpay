import type {
  AccountDispute,
  AccountLinkParams,
  AccountLinkResult,
  AccountResult,
  PayoutMethod,
  BountyCheckoutParams,
  BountyCheckoutResult,
  ConnectedAccountActiveParams,
  ConnectedAccountParams,
  CreatePaymentRequestResourcesParams,
  DeactivatePaymentRequestResourcesParams,
  FinalizePaymentRequestResourcesParams,
  InvoiceDetails,
  InvoiceParams,
  InvoiceResult,
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
  TransferResult,
  NormalizedEventType
} from './types'

/**
 * Abstract payment connector. Stripe, Whop, and future providers implement this.
 */
export abstract class PaymentProvider {
  abstract readonly name: PaymentProviderName

  // --- Checkout / pay-in ---

  abstract createBountyCheckout(params: BountyCheckoutParams): Promise<BountyCheckoutResult>

  abstract createInvoice(params: InvoiceParams): Promise<InvoiceResult>

  abstract retrieveInvoice(invoiceId: string): Promise<InvoiceDetails>

  abstract createPaymentRequestResources(
    params: CreatePaymentRequestResourcesParams
  ): Promise<PaymentRequestResources>

  /**
   * Optional post-creation follow-up, called once the payment request's real
   * (database) id is known — `createPaymentRequestResources` runs before the row
   * exists, so a provider whose payment URL needs that id (Whop's custom-amount
   * Gitpay-hosted pay page) can't build it up front. Most providers don't need
   * this; default is a no-op.
   */
  async finalizePaymentRequestResources(
    _params: FinalizePaymentRequestResourcesParams
  ): Promise<{ paymentUrl?: string } | undefined> {
    return undefined
  }

  abstract updatePaymentRequestPaymentLinkMetadata(
    paymentLinkId: string,
    metadata: PaymentRequestResourceMetadata
  ): Promise<unknown>

  abstract updatePaymentRequestPaymentLinkActive(
    paymentLinkId: string,
    active: boolean
  ): Promise<unknown>

  /**
   * Sync active flag and/or title/description on the provider checkout resource
   * (Stripe Payment Link + Product, Whop Plan + Product).
   */
  abstract updatePaymentRequestDetails(params: UpdatePaymentRequestDetailsParams): Promise<unknown>

  abstract deactivatePaymentRequestResources(
    resources: DeactivatePaymentRequestResourcesParams
  ): Promise<void>

  abstract refund(params: RefundParams): Promise<RefundResult>

  // --- Pay-out ---

  abstract createTransfer(params: TransferParams): Promise<TransferResult>

  abstract reverseTransfer(transferId: string, params?: object): Promise<unknown>

  abstract createPayout(params: PayoutParams): Promise<PayoutResult>

  // --- Connected accounts ---

  abstract createConnectedAccount(params: ConnectedAccountParams): Promise<AccountResult>

  abstract createAccountLink(params: AccountLinkParams): Promise<AccountLinkResult>

  /**
   * Whether a connected account is ready for payouts and payment requests.
   * Each provider applies its own rules (e.g. Stripe requirements vs Whop company id).
   */
  abstract isConnectedAccountActive(
    account: ConnectedAccountActiveParams | null | undefined
  ): boolean

  /**
   * Payout methods configured for a connected account (bank/card/crypto).
   * Best-effort: providers that manage this on their own portal (Whop) or that
   * cannot list it return an empty array so the UI shows a managed/empty state.
   */
  async getPayoutMethods(_accountId: string): Promise<PayoutMethod[]> {
    return []
  }

  /**
   * Disputes/chargebacks visible for a connected account.
   * Best-effort: providers that only receive these via webhooks return an empty
   * array so the UI renders an empty state rather than fabricated data.
   */
  async getDisputes(_accountId: string): Promise<AccountDispute[]> {
    return []
  }

  // --- Webhooks ---

  /**
   * Verify signature (when not in test) and parse the provider event.
   * `kind` distinguishes Stripe platform vs connect endpoints.
   */
  abstract verifyAndParseWebhook(
    req: { body: any; headers: Record<string, any> },
    kind?: 'platform' | 'connect'
  ): Promise<ProviderWebhookEvent>

  /** Map provider-native event type to a normalized domain event, if any. */
  abstract mapEventType(rawType: string): NormalizedEventType | null
}
