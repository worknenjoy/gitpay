import { findUserByIdSimple } from '../../../queries/user/findUserByIdSimple'
import { listExternalAccounts } from '../../../queries/provider/stripe/account'
import { updateExternalAccount } from '../../provider/stripe/user'
import { Stripe } from 'stripe'

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

export async function updateUserBankAccount({
  userParams,
  bank_account
}: UserBankAccountUpdateParams) {
  const { id, default_for_currency, account_holder_name, account_holder_type } = bank_account

  const user = await findUserByIdSimple(userParams.id)
  const accountId = user?.dataValues?.account_id

  if (!accountId) return null

  const bankAccounts = await listExternalAccounts(accountId, {
    object: 'bank_account'
  })

  if (!bankAccounts.data.length) return null

  const bankAccount =
    (id && bankAccounts.data.find((b: any) => b.id === id)) || bankAccounts.data[0]

  const accountHolderType: Stripe.AccountUpdateExternalAccountParams.AccountHolderType | undefined =
    account_holder_type === 'company' || account_holder_type === 'individual'
      ? account_holder_type
      : undefined

  return updateExternalAccount(accountId, bankAccount.id, {
    default_for_currency,
    account_holder_name,
    account_holder_type: accountHolderType
  })
}
