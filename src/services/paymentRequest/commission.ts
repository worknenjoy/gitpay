/**
 * Gitpay's platform commission on payment-request payments. Kept in its own leaf
 * module (no imports) so both sellerNetAmount.ts and WhopPaymentProvider.ts can
 * import it without creating a cycle through src/providers.
 */
export const GITPAY_COMMISSION_PERCENT = 8
