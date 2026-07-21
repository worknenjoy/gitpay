import { getDefaultPaymentProviderName } from '../../providers'

type UserAccountBalanceParams = {
  account_id: string
}

/**
 * Available balance for payouts.
 * Stripe: Connect balance for account_id.
 * Whop: balance is managed in the Whop portal; return empty until ledger API is wired.
 */
export async function userAccountBalance(userParameters: UserAccountBalanceParams) {
  if (getDefaultPaymentProviderName() === 'whop') {
    return {
      provider: 'whop',
      available: [],
      pending: [],
      object: 'balance'
    }
  }

  const { getUserStripeBalance } = await import('../../queries/user/stripe/getUserStripeBalance')
  return getUserStripeBalance(userParameters.account_id)
}
