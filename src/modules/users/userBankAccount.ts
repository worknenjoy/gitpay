type UserBankAccountParams = {
  id: number
}

export async function userBankAccount(userParameters: UserBankAccountParams) {
  const { listUserBankAccounts } = await import('../../queries/user/stripe/listUserBankAccounts')
  return listUserBankAccounts(userParameters.id)
}
