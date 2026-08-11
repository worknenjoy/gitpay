type UserAccountLinkParams = {
  id: number
  /** Force a provider (Whop tab passes 'whop', Stripe tab passes 'stripe') */
  provider?: string
}

export async function userAccountLink(userParameters: UserAccountLinkParams) {
  const { createUserAccountLink } = await import(
    '../../mutations/user/account/createUserAccountLink'
  )
  return createUserAccountLink(userParameters)
}
