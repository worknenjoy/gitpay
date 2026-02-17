type UserAccountParams = {
  id: number
}

export async function userAccount(userParameters: UserAccountParams) {
  const { getUserStripeAccount } = await import('../../queries/user/stripe/getUserStripeAccount')
  return getUserStripeAccount(userParameters.id)
}
