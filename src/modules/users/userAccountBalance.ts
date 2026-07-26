import { getDefaultPaymentProviderName, getPaymentProvider } from '../../providers'
import { findUserByIdSimple } from '../../queries/user/findUserByIdSimple'
import { WhopPaymentProvider } from '../../providers/whop/WhopPaymentProvider'

type UserAccountBalanceParams = {
  /** Stripe Connect account id (legacy path) */
  account_id?: string
  /** Preferred for multi-provider: load user and resolve provider account */
  userId?: number
}

/**
 * Available balance for payouts.
 * Stripe: Connect balance for account_id (amounts in cents).
 * Whop: connected company ledger available balance (normalized to cents for the UI).
 */
export async function userAccountBalance(userParameters: UserAccountBalanceParams) {
  const providerName = getDefaultPaymentProviderName()

  if (providerName === 'whop') {
    let whopAccountId: string | null = null

    if (userParameters.userId) {
      const user = await findUserByIdSimple(userParameters.userId)
      whopAccountId = user?.dataValues?.whop_account_id || null
    }

    if (!whopAccountId) {
      return {
        provider: 'whop',
        available: [{ amount: 0, currency: 'usd' }],
        pending: [{ amount: 0, currency: 'usd' }],
        object: 'balance'
      }
    }

    try {
      const whop = getPaymentProvider('whop') as WhopPaymentProvider
      const ledger = await whop.getCompanyLedgerBalances(whopAccountId)
      // UI BalanceCard uses type=centavos (Stripe convention)
      const availableCents = Math.round(Number(ledger.available || 0) * 100)
      const pendingCents = Math.round(Number(ledger.pending || 0) * 100)

      return {
        provider: 'whop',
        available: [{ amount: availableCents, currency: 'usd' }],
        pending: [{ amount: pendingCents, currency: 'usd' }],
        object: 'balance',
        company_id: whopAccountId
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('[whop] userAccountBalance failed', error)
      return {
        provider: 'whop',
        available: [{ amount: 0, currency: 'usd' }],
        pending: [{ amount: 0, currency: 'usd' }],
        object: 'balance',
        company_id: whopAccountId
      }
    }
  }

  if (!userParameters.account_id) {
    return {
      provider: 'stripe',
      available: [{ amount: 0, currency: 'usd' }],
      pending: [],
      object: 'balance'
    }
  }

  const { getUserStripeBalance } = await import('../../queries/user/stripe/getUserStripeBalance')
  return getUserStripeBalance(userParameters.account_id)
}
