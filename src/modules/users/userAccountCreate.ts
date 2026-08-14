type UserAccountCreateParams = {
  id: number
  /** Required for Stripe (Connect custom accounts); optional for Whop, which collects
   * country itself during account_onboarding/KYC. */
  country?: string
}

export async function userAccountCreate(userParameters: UserAccountCreateParams) {
  const { createUserAccount } = await import('../../mutations/user/account/createUserAccount')
  return createUserAccount(userParameters)
}
