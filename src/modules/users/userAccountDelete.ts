type UserAccountDeleteParams = {
  userId: number
  /** Force a provider (Whop tab passes 'whop', Stripe tab passes 'stripe') */
  provider?: string
}

export async function userAccountDelete({ userId, provider }: UserAccountDeleteParams) {
  const { deleteUserAccount } = await import('../../mutations/user/account/deleteUserAccount')
  return deleteUserAccount({ userId, provider })
}
