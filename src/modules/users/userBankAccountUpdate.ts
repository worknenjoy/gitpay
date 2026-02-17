type UserBankAccountUpdateParams = {
  userParams: {
    id: number
  }
  bank_account: {
    id?: string
    account_holder_name: string
    account_holder_type: string
    default_for_currency?: boolean
  }
}

export async function userBankAccountUpdate({
  userParams,
  bank_account
}: UserBankAccountUpdateParams) {
  const { updateUserBankAccount } = await import(
    '../../mutations/user/bank-account/updateUserBankAccount'
  )
  return updateUserBankAccount({ userParams, bank_account })
}
