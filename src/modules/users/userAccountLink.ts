type UserAccountLinkParams = {
  id: number
}

export async function userAccountLink(userParameters: UserAccountLinkParams) {
  const { createUserAccountLink } = await import('../../mutations/user/account/createUserAccountLink')
  return createUserAccountLink(userParameters)
}
