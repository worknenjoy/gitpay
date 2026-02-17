import { findUserByIdSimple } from '../findUserByIdSimple'
import { listExternalAccounts } from '../../provider/stripe/account'

export const listUserBankAccounts = async (userId: number) => {
  const user = await findUserByIdSimple(userId)
  const accountId = user?.dataValues?.account_id

  if (!accountId) return []

  const bankAccounts = await listExternalAccounts(accountId, { object: 'bank_account' })
  return bankAccounts.data ?? []
}
