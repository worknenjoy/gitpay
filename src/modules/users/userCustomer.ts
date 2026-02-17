type UserCustomerParams = {
  id: number
}

export async function userCustomer(userParameters: UserCustomerParams) {
  const { getUserStripeCustomer } = await import('../../queries/user/stripe/getUserStripeCustomer')
  return getUserStripeCustomer(userParameters.id)
}
