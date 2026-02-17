type UserAccountDeleteParams = {
  userId: number
}

export async function userAccountDelete({ userId }: UserAccountDeleteParams) {
  const { deleteUserAccount } = await import('../../mutations/user/account/deleteUserAccount')
  return deleteUserAccount({ userId })
}
