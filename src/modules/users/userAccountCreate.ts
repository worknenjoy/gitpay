type UserAccountCreateParams = {
  id: number
  country: string
}

export async function userAccountCreate(userParameters: UserAccountCreateParams) {
  const { createUserAccount } = await import('../../mutations/user/account/createUserAccount')
  return createUserAccount(userParameters)
}
