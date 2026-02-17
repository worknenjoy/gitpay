type UserBankAccountDeleteParams = {
  userParams: {
    id: number
  }
  bankAccountId: string
}

export async function userBankAccountDelete({
  userParams,
  bankAccountId
}: UserBankAccountDeleteParams) {
  const { deleteUserBankAccount } = await import(
    '../../mutations/user/bank-account/deleteUserBankAccount'
  )
  return deleteUserBankAccount({ userParams, bankAccountId })
}
