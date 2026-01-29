const stripe = require('../shared/stripe/stripe')()

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
