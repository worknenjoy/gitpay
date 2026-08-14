type UserAccountLinkParams = {
  id: number
  /** Force a provider (Whop tab passes 'whop', Stripe tab passes 'stripe') */
  provider?: string
  /**
   * What the user is trying to resolve — 'identity' (KYC only) or 'payout' (payout
   * method/withdrawals, and identity too). Only meaningful for Whop; see
   * createUserAccountLink for the mapping to Whop's account-link `use_case`.
   */
  purpose?: string
}

export async function userAccountLink(userParameters: UserAccountLinkParams) {
  const { createUserAccountLink } = await import(
    '../../mutations/user/account/createUserAccountLink'
  )
  return createUserAccountLink(userParameters)
}
