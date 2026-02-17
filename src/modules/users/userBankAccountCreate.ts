type UserBankAccountCreateParams = {
  userParams: {
    id: number
    country: string
    currency?: string
  }
  bankAccountParams: {
    country?: string
    currency?: string
    account_holder_type: string
    account_holder_name: string
    routing_number: string
    account_number: string
  }
}

export async function userBankAccountCreate({
  userParams,
  bankAccountParams
}: UserBankAccountCreateParams) {
  const { createUserBankAccount } = await import(
    '../../mutations/user/bank-account/createUserBankAccount'
  )
  return createUserBankAccount({ userParams, bankAccountParams })
}
