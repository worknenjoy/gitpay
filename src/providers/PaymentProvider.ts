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

  abstract createPaymentRequestResources(
    params: CreatePaymentRequestResourcesParams
  ): Promise<PaymentRequestResources>

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
  abstract updatePaymentRequestDetails(
    params: UpdatePaymentRequestDetailsParams
  ): Promise<unknown>

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
  abstract isConnectedAccountActive(account: ConnectedAccountActiveParams | null | undefined): boolean

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
