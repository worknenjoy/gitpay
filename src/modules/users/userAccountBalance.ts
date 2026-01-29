import stripeModule from '../shared/stripe/stripe'
const stripe = stripeModule()

type UserAccountBalanceParams = {
  account_id: string
}

export async function userAccountBalance(userParameters: UserAccountBalanceParams) {
  const { account_id } = userParameters
  const accountBalance = await stripe.balance.retrieve({
    stripeAccount: account_id
  })
  return accountBalance
}
