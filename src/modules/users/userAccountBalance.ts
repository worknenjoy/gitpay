type UserAccountBalanceParams = {
  account_id: string
}

export async function userAccountBalance(userParameters: UserAccountBalanceParams) {
  const { getUserStripeBalance } = await import('../../queries/user/stripe/getUserStripeBalance')
  return getUserStripeBalance(userParameters.account_id)
}
