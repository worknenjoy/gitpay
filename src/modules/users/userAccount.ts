import { getPaymentProvider } from '../../providers'
import { findUserByIdSimple } from '../../queries/user/findUserByIdSimple'
import { getWhopClient } from '../../providers/whop/client'
import { WhopPaymentProvider } from '../../providers/whop/WhopPaymentProvider'
import { currencyForCountry } from '../../utils/currency/currency-map'

type UserAccountParams = {
  id: number
  /**
   * Force a specific provider regardless of the global PAYMENT_PROVIDER.
   * Used by the deprecated Stripe tab so legacy Stripe accounts still load
   * while the platform default is Whop.
   */
  provider?: string
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
  const paymentProvider = getPaymentProvider(userParameters.provider)

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

    // GET /accounts/{id} (Whop's newer, beta Account resource), queried with this user's
    // own whopAccountId. Used below only for capabilities.standard_payout — NOT for
    // country/business_address: confirmed those fields on this beta endpoint don't
    // reliably scope to the specific sub-merchant (one observed case returned "us", the
    // platform's own country, for a sub-merchant whose real KYC address was Denmark;
    // another case leaked a completely unrelated account's country after that account
    // onboarded). Best-effort: if this call fails (e.g. older API key without access),
    // the code below still has /companies.
    let whopAccount: any = null
    try {
      whopAccount = await getWhopClient().get<any>(`/accounts/${whopAccountId}`)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('[whop] retrieve account (beta) for user account failed', error)
    }

    const whop = paymentProvider as WhopPaymentProvider

    let balances: { available: number; pending: number; reserve: number } | null = null
    try {
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

    let payoutMethods: Awaited<ReturnType<WhopPaymentProvider['getPayoutMethods']>> = []
    try {
      payoutMethods = await whop.getPayoutMethods(whopAccountId)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('[whop] payout methods for connected company failed', error)
    }

    let disputes: Awaited<ReturnType<WhopPaymentProvider['getDisputes']>> = []
    try {
      disputes = await whop.getDisputes(whopAccountId)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('[whop] disputes for connected company failed', error)
    }

    // Whop has no proven-reliable, per-sub-merchant country signal (see comment above
    // `whopAccount`) — every live endpoint tried has leaked another account's/the
    // platform's country. Country is read as-is from Users.country and never synced
    // from Whop.
    const country = user?.dataValues?.country || null

    const defaultCurrency =
      company?.default_currency || company?.currency || currencyForCountry(country)

    const verified = company?.verified ?? null

    const hasPayoutMethod = Array.isArray(payoutMethods) && payoutMethods.length > 0

    // Whop's own computed payout-rail eligibility (from GET /accounts/{id}, requires
    // company:balance:read scope — same scope getCompanyLedgerBalances already relies on).
    // Reflects KYC/identity readiness for payouts, but NOT whether a payout destination has
    // actually been linked — confirmed by real accounts showing 'active' here with zero
    // payout methods on file. So this only replaces the identity/KYC half of "ready";
    // payout method presence is always checked separately, via hasPayoutMethod above.
    const payoutCapability: 'active' | 'inactive' | 'pending' | null =
      whopAccount?.capabilities?.standard_payout ?? null
    const kycReady = payoutCapability != null ? payoutCapability === 'active' : verified === true

    // Requirements checklist derived from the company + payout methods (no extra API calls).
    const requirementItems =
      typeof whop.buildRequirements === 'function'
        ? whop.buildRequirements(company, payoutMethods)
        : []
    const currentlyDue = requirementItems
      .filter((item) => item.status === 'required')
      .map((item) => item.key)

    const requirementsMet = kycReady && hasPayoutMethod
    const identityCheck =
      verified === true ? 'verified' : verified === false ? 'unverified' : 'pending'
    const defaultPayoutMethod =
      payoutMethods.find((method) => method.default) || payoutMethods[0] || null

    const account = {
      id: whopAccountId,
      object: 'account',
      provider: paymentProvider.name,
      email: company?.email || user?.dataValues?.email || null,
      country,
      default_currency: defaultCurrency,
      currency: defaultCurrency,
      title: company?.title || company?.name || null,
      verified,
      // Raw Whop-computed payout-rail eligibility signal, exposed for debugging; the
      // active/pending determination lives in payouts_enabled (see kycReady above).
      payoutCapability,
      route: company?.route || null,
      url: company?.url || company?.hub_url || null,
      created_at: company?.created_at || null,
      parent_company_id: company?.parent_company_id || null,
      // Friendly status for UI (AccountHolderStatus expects capabilities.transfers)
      capabilities: {
        transfers: requirementsMet ? 'active' : 'pending'
      },
      business_profile: {
        name: company?.title || company?.name || null,
        url: company?.url || null
      },
      balances,
      // Requirements & compliance checklist (Whop portal completes the underlying steps)
      requirements: {
        currently_due: currentlyDue,
        disabled_reason: null,
        checklist: requirementItems
      },
      // Identity & business (KYC completed on Whop; Gitpay reads the result)
      identity: {
        legalName: company?.title || company?.name || user?.dataValues?.name || null,
        accountType: company?.account_type || company?.business_type || 'individual',
        taxForm: company?.tax_form || null,
        identityCheck
      },
      // Best-effort payout method; bank/card/crypto is added on the Whop portal
      payout_method: defaultPayoutMethod,
      payout_methods: payoutMethods,
      // Disputes/refunds arrive via webhooks; empty until surfaced
      disputes,
      // KYC / bank details are completed on Whop portal via account_links
      completed: true,
      charges_enabled: requirementsMet,
      payouts_enabled: requirementsMet,
      details_submitted: requirementsMet,
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
