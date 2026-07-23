/** User model field that stores the connected account id for each payment provider */
const CONNECTED_ACCOUNT_ID_FIELD: Record<string, string> = {
  stripe: 'account_id',
  whop: 'whop_account_id'
}

const getActivePaymentProvider = (account?: { data?: { provider?: string } }) => {
  return (
    account?.data?.provider ||
    (typeof process !== 'undefined' && process.env && process.env.PAYMENT_PROVIDER) ||
    'stripe'
  )
}

/**
 * Whether the connected payout account is ready for payment requests / payouts.
 *
 * Prefers the provider-normalized `active` flag from GET /user/account
 * (set via PaymentProvider.isConnectedAccountActive). Falls back to account
 * payload / connected account id on the user for the active provider.
 */
export const validAccount = (user, account) => {
  const data = account?.data

  if (typeof data?.active === 'boolean') {
    return data.active
  }

  // Account payload present: apply shared requirement checks (Stripe-shaped)
  if (data?.id) {
    if (data?.requirements?.disabled_reason?.startsWith('rejected')) return false
    if ((data?.requirements?.currently_due?.length || 0) > 0) return false
    return true
  }

  // Fallback (e.g. account still loading): connected account id for active provider
  const provider = getActivePaymentProvider(account)
  const field = CONNECTED_ACCOUNT_ID_FIELD[provider] || 'account_id'
  return Boolean(user?.[field])
}
