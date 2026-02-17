type UserAccountUpdateParams = {
  userParams: {
    id: number
  }
  accountParams: any
}

export async function userAccountUpdate({ userParams, accountParams }: UserAccountUpdateParams) {
  const { updateUserAccount } = await import('../../mutations/user/account/updateUserAccount')
  return updateUserAccount({ userParams, accountParams })
}
