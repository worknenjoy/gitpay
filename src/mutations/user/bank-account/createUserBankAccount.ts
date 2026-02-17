import { currencyMap } from '../../../utils/currency/currency-map'
import { findUserByIdSimple } from '../../../queries/user/findUserByIdSimple'
import { createExternalAccount } from '../../provider/stripe/user'
import { Stripe } from 'stripe'

const getCurrency = (country: string) => {
  return currencyMap[country]
}

type UserBankAccountCreateParams = {
  userParams: {
    id: number
    country: string
    currency?: string
  }
  bankAccountParams: {
    country?: string
    currency?: string
    account_holder_type: string
    account_holder_name: string
    routing_number: string
    account_number: string
  }
}

export async function createUserBankAccount({
  userParams,
  bankAccountParams
}: UserBankAccountCreateParams) {
  const userCountry = userParams.country
  const userCurrency = userParams.currency || getCurrency(userCountry)

  const user = await findUserByIdSimple(userParams.id)
  const accountId = user?.dataValues?.account_id

  if (!accountId) return null

  const accountHolderType:
    | Stripe.AccountCreateExternalAccountParams.BankAccount.AccountHolderType
    | undefined =
    bankAccountParams.account_holder_type === 'company' ||
    bankAccountParams.account_holder_type === 'individual'
      ? bankAccountParams.account_holder_type
      : undefined

  return createExternalAccount(accountId, {
    external_account: {
      object: 'bank_account',
      country: bankAccountParams.country || userCountry,
      currency: bankAccountParams.currency || userCurrency,
      account_holder_type: accountHolderType,
      account_holder_name: bankAccountParams.account_holder_name,
      routing_number: bankAccountParams.routing_number,
      account_number: bankAccountParams.account_number
    }
  })
}
