import { findUserByIdSimple } from '../../../queries/user/findUserByIdSimple'
import { deleteExternalAccount } from '../../../provider/stripe/user'

type UserBankAccountDeleteParams = {
  userParams: {
    id: number
  }
  bankAccountId: string
}

export async function deleteUserBankAccount({ userParams, bankAccountId }: UserBankAccountDeleteParams) {
  const user = await findUserByIdSimple(userParams.id)
  const accountId = user?.dataValues?.account_id

  if (!accountId) return null

  return deleteExternalAccount(accountId, bankAccountId)
}
