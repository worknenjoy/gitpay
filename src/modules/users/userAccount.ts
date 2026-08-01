import { getPaymentProvider } from '../../providers'
import { findUserByIdSimple } from '../../queries/user/findUserByIdSimple'
import { getWhopClient } from '../../providers/whop/client'
import { WhopPaymentProvider } from '../../providers/whop/WhopPaymentProvider'
import { currencyForCountry } from '../../utils/currency/currency-map'

type UserAccountParams = {
  id: number
}

/**
 * Returns the connected payout account for the current payment provider.
 * Stripe: full Connect account object from Stripe API.
 * Whop: connected company from Whop API + local Users.whop_account_id.
 *
 * Always includes `provider` and `active` (via PaymentProvider.isConnectedAccountActive)
 * so clients can gate payment requests without provider-specific checks.
 */
export async function userAccount(userParameters: UserAccountParams) {
  const paymentProvider = getPaymentProvider()

  if (paymentProvider.name === 'whop') {
    const user = await findUserByIdSimple(userParameters.id)
    const whopAccountId = user?.dataValues?.whop_account_id
    if (!whopAccountId) {
      return {
        provider: paymentProvider.name,
        active: false
      }
    }

    let company: any = null
    try {
      company = await getWhopClient().get<any>(`/companies/${whopAccountId}`)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('[whop] retrieve company for user account failed', error)
    }

    let balances: { available: number; pending: number; reserve: number } | null = null
    try {
      const whop = paymentProvider as WhopPaymentProvider
      if (typeof whop.getCompanyLedgerBalances === 'function') {
        const ledger = await whop.getCompanyLedgerBalances(whopAccountId)
        balances = {
          available: ledger.available,
          pending: ledger.pending,
          reserve: ledger.reserve
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('[whop] ledger balances for connected company failed', error)
    }

    const country =
      company?.country ||
      company?.business_address?.country ||
      user?.dataValues?.country ||
      null
    const defaultCurrency =
      company?.default_currency ||
      company?.currency ||
      currencyForCountry(country)

    const account = {
      id: whopAccountId,
      object: 'account',
      provider: paymentProvider.name,
      email: company?.email || user?.dataValues?.email || null,
      country,
      default_currency: defaultCurrency,
      currency: defaultCurrency,
      title: company?.title || company?.name || null,
      verified: company?.verified ?? null,
      route: company?.route || null,
      url: company?.url || company?.hub_url || null,
      created_at: company?.created_at || null,
      parent_company_id: company?.parent_company_id || null,
      // Friendly status for UI (AccountHolderStatus expects capabilities.transfers)
      capabilities: {
        transfers: 'active'
      },
      business_profile: {
        name: company?.title || company?.name || null,
        url: company?.url || null
      },
      balances,
      // KYC / bank details are completed on Whop portal via account_links
      // (payout method / bank is not stored in Gitpay — only company + currency here)
      completed: true,
      charges_enabled: true,
      payouts_enabled: true,
      details_submitted: true,
      metadata: {
        internal_user_id: String(userParameters.id)
      }
    }

    return {
      ...account,
      active: paymentProvider.isConnectedAccountActive(account)
    }
  }

  const { getUserStripeAccount } = await import('../../queries/user/stripe/getUserStripeAccount')
  const account = await getUserStripeAccount(userParameters.id)
  const accountPayload =
    account && typeof account === 'object' && !Array.isArray(account) ? account : {}

  return {
    ...accountPayload,
    provider: paymentProvider.name,
    active: paymentProvider.isConnectedAccountActive(accountPayload as any)
  }
}
